import React from 'react';
import { withRouter } from 'react-router-dom';

import { useQuery } from '@apollo/client';
import { GET_RECIPE } from '../../queries';
import Error from '../Error';
import LikeRecipe from './LikeRecipe';

const RecipePage = ({ match }) => {
  const { _id } = match.params;

  const { data, loading, error } = useQuery(GET_RECIPE, {
    variables: { _id },
  });

  if (loading) return <div>Loading....</div>;
  if (error) return <Error />;

  const {
    name,
    category,
    description,
    instructions,
    likes,
    username,
  } = data.getRecipe;

  return (
    <>
      <div className='App' key={_id}>
        <h2>{name}</h2>
        <p>Category: {category}</p>
        <p>Description: {description}</p>
        <p>Instructions: {instructions}</p>
        <p>Likes: {likes}</p>
        <p>Created by: {username}</p>
        <LikeRecipe _id={_id} />
      </div>
      {error && <Error error={error} />}
    </>
  );
};

export default withRouter(RecipePage);
