import React from 'react';
import { useMutation } from '@apollo/client';
import { withRouter } from 'react-router-dom';

import Error from '../Error';
import { GET_ALL_RECIPES, ADD_RECIPE, GET_USER_RECIPES } from '../../queries';
import useForm from '../../lib/useForm';
import withAuth from '../withAuth';

const AddRecipe = ({ session, history }) => {
  const { inputs, handleChange, clearForm } = useForm({
    name: '',
    description: '',
    instructions: '',
    category: 'Breakfast',
    username: session.getCurrentUser.username,
    imageUrl: '',
  });

  const updateCache = (cache, { data: { addRecipe } }) => {
    const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });
    cache.writeQuery({
      query: GET_ALL_RECIPES,
      data: {
        getAllRecipes: getAllRecipes.concat([addRecipe]),
      },
    });
  };

  const [addRecipe, { error, loading }] = useMutation(ADD_RECIPE, {
    variables: inputs,
    update: updateCache,
    refetchQueries: () => [
      {
        query: GET_USER_RECIPES,
        variables: { username: session.getCurrentUser.username },
      },
    ],
  });

  const handleSubmit = (e, addRecipe) => {
    e.preventDefault();
    addRecipe().then(() => {
      clearForm();
      history.push('/');
    });
  };

  const validateForm = () => {
    const { name, description, category, instructions } = inputs;
    const isInvalid = !name || !description || !category || !instructions;
    return isInvalid;
  };

  return (
    <div className='App'>
      <h2 className='App'>Add Recipe</h2>
      <form className='form' onSubmit={(e) => handleSubmit(e, addRecipe)}>
        <input
          type='text'
          name='name'
          value={inputs.name}
          onChange={handleChange}
          placeholder='Recipe name'
        />

        <input
          type='text'
          name='imageUrl'
          value={inputs.imageUrl}
          onChange={handleChange}
          placeholder='Recipe image'
        />

        <select name='category' onChange={handleChange} value={inputs.category}>
          <option value='Breakfast'>Breakfast</option>
          <option value='Lunch'>Lunch</option>
          <option value='Snack'>Snack</option>
          <option value='Dinner'>Dinner</option>
        </select>
        <input
          type='text'
          name='description'
          description={inputs.description}
          onChange={handleChange}
          placeholder='add description'
        />
        <textarea
          name='instructions'
          value={inputs.instructions}
          onChange={handleChange}
          placeholder='add instructions'
        />
        <button
          type='submit'
          className='button-primary'
          disabled={loading || validateForm()}
        >
          Add Recipe
        </button>
      </form>
      {error && <Error error={error} />}
    </div>
  );
};

export default withAuth((session) => session && session.getCurrentUser)(
  withRouter(AddRecipe),
);
