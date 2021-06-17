const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
// const jwt = require('jsonwebtoken');
const cors = require('cors');

const User = require('./models/User');
const Recipe = require('./models/Recipe');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const isAuth = require('./middlewares/is-auth');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(isAuth);

const server = new ApolloServer({
  resolvers,
  typeDefs,
  playground: {
    endpoint: '/graphql',
  },
  context: ({ req: { currentUser } }) => {
    return {
      currentUser,
      Recipe,
      User,
    };
  },
});

server.applyMiddleware({ app });

mongoose
  .connect(`${process.env.MONGO_URI}/${process.env.MONGO_DB_COLLECTION}`, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('database connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server is running on  localhost:${process.env.PORT}`),
    );
  })
  .catch((err) =>
    console.log(
      'Failed to connect to the database please check url or connctions',
    ),
  );
