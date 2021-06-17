const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  Query: {
    getAllRecipes: async (parent, args, { Recipe }, info) => {
      const allRecipes = await Recipe.find().sort({
        createdDate: 'desc',
      });
      return allRecipes;
    },
    getRecipe: async (parent, { _id }, { Recipe }, info) => {
      const recipe = await Recipe.findOne({ _id });
      return recipe;
    },
    searchRecipes: async (parent, { searchTerm }, { Recipe }, info) => {
      if (searchTerm) {
        const searchResults = await Recipe.find(
          {
            $text: { $search: searchTerm },
          },
          {
            score: { $meta: 'textScore' },
          },
        ).sort({
          score: { $meta: 'textScore' },
        });
        return searchResults;
      } else {
        const recipes = await Recipe.find().sort({
          likes: 'desc',
          createdDate: 'desc',
        });
        return recipes;
      }
    },
    getUserRecipes: async (parent, { username }, { Recipe }, info) => {
      const userRecipes = await Recipe.find({ username }).sort({
        createdDate: 'desc',
      });
      return userRecipes;
    },
    getCurrentUser: async (parent, args, { currentUser, User }, info) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username,
      }).populate({
        path: 'favorites',
        model: 'Recipe',
      });
      return user;
    },
  },
  Mutation: {
    addRecipe: async (
      parent,
      { name, description, category, instructions, username, imageUrl },
      { Recipe },
      info,
    ) => {
      const newRecipe = await new Recipe({
        name,
        description,
        imageUrl,
        category,
        instructions,
        username,
      }).save();
      return newRecipe;
    },
    likeRecipe: async (parent, { _id, username }, { Recipe, User }, info) => {
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        { $inc: { likes: 1 } },
      );
      await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: _id } },
      );
      return recipe;
    },
    unlikeRecipe: async (parent, { _id, username }, { Recipe, User }, info) => {
      const recipe = await Recipe.findOneAndUpdate(
        { _id },
        { $inc: { likes: -1 } },
      );
      await User.findOneAndUpdate({ username }, { $pull: { favorites: _id } });
      return recipe;
    },
    deleteUserRecipe: async (parent, { _id }, { Recipe }, info) => {
      const recipe = await Recipe.findOneAndDelete({ _id });
      return recipe;
    },
    signinUser: async (parent, { username, password }, { User }, info) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('User not found.');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid Password');
      }
      return { token: createToken(user, process.env.SECRET, '1d') };
    },
    signupUser: async (
      parent,
      { username, email, password },
      { User },
      info,
    ) => {
      const user = await User.findOne({ username });
      if (user) {
        throw new Error('User already exists');
      }
      const newUser = await new User({
        username,
        email,
        password,
      }).save();
      return { token: createToken(newUser, '1234567890', '1d') };
    },
  },
};
