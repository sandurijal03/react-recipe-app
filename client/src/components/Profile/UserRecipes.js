import React from 'react';
import { useQuery, useMutation } from '@apollo/client';

import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER,
} from '../../queries';
import Error from '../Error';
import { Link } from 'react-router-dom';

const UserRecipes = ({ username }) => {
  const { data: queryData, loading, error } = useQuery(GET_USER_RECIPES, {
    variables: {
      username,
    },
  });

  const updateCache = (cache, { data: { deleteUserRecipe } }) => {
    const { getUserRecipes } = cache.readQuery({
      query: GET_USER_RECIPES,
    });

    const filteredItem = getUserRecipes.filter(
      (recipe) => recipe._id !== deleteUserRecipe._id,
    );

    cache.writeQuery({
      query: GET_USER_RECIPES,
      data: {
        getUserRecipes: filteredItem,
      },
    });
  };

  const refetch = () => [
    { query: GET_ALL_RECIPES },
    { query: GET_CURRENT_USER },
  ];

  const [deleteUserRecipe] = useMutation(DELETE_USER_RECIPE, {
    update: updateCache,
    refetchQueries: refetch,
  });

  if (loading) return <p>Loading</p>;
  if (error) return <Error error={error} />;

  return (
    <ul>
      <h3>User Recipes</h3>
      {!queryData.getUserRecipes.length && (
        <p>
          <strong>You have not added any recipes yet.</strong>
        </p>
      )}
      {queryData.getUserRecipes.map(({ name, likes, _id }) => (
        <li key={_id}>
          <Link to={`/recipes/${_id}`}>
            <p>{name}</p>
          </Link>
          <p style={{ marginBottom: '0' }}>Likes: {likes}</p>
          <p
            className='delete-button'
            onClick={async (e) => {
              e.preventDefault();
              const confirmDelete = window.confirm(
                'Are you sure you want to delele this recipe?',
              );
              if (confirmDelete) {
                (
                  await deleteUserRecipe({
                    variables: { _id },
                  })
                )();
              }
            }}
          >
            X
          </p>
        </li>
      ))}
    </ul>
  );
};

export default UserRecipes;
