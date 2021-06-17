import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { GET_RECIPE, LIKE_RECIPE, UNLIKE_RECIPE } from '../../queries';

import withSession from '../withSessions';

const LikeRecipe = ({ session, _id, refetch }) => {
  const [username, setUsername] = useState('');
  const [liked, setLiked] = useState(false);

  const updateLike = (cache, { data: { likeRecipe } }) => {
    const { getRecipe } = cache.readQuery({
      query: GET_RECIPE,
      variables: { _id },
    });

    console.log(likeRecipe);

    cache.writeQuery({
      query: GET_RECIPE,
      variables: { _id },
      data: {
        getRecipe: { ...getRecipe, likes: likeRecipe.likes + 1 },
      },
    });
  };

  const [likeRecipe, { data }] = useMutation(LIKE_RECIPE, {
    variables: {
      _id,
      username,
    },
    update: updateLike,
  });

  console.log('data', data);

  const updateUnlike = (cache, { data: { unlikeRecipe } }) => {
    const { getRecipe } = cache.readQuery({
      query: GET_RECIPE,
      variables: { _id },
    });
    cache.writeQuery({
      query: GET_RECIPE,
      variables: { _id },
      data: {
        getRecipe: { ...getRecipe, likes: unlikeRecipe.likes - 1 },
      },
    });
  };

  const [unlikeRecipe] = useMutation(UNLIKE_RECIPE, {
    variables: {
      _id,
      username,
    },
    update: updateUnlike,
  });

  useEffect(() => {
    if (session.getCurrentUser) {
      const { username, favorites } = session.getCurrentUser;

      const prevLiked =
        favorites.findIndex((favorite) => favorite._id === _id) > -1;
      setUsername(username);
      setLiked(prevLiked);
    }
  }, [session.getCurrentUser, _id]);

  const handleLike = (likeRecipe, unlikeRecipe) => {
    if (liked) {
      likeRecipe().then(async ({ data }) => {
        await refetch();
      });
    } else {
      // unlike recipe
      unlikeRecipe().then(async ({ data }) => {
        await refetch();
      });
    }
  };

  return (
    username && (
      <button
        className='button-primary'
        // onClick={() => handleClick(likeRecipe, unlikeRecipe)}
        onClick={() => {
          setLiked((prev) => !prev);
          handleLike(likeRecipe, unlikeRecipe);
        }}
      >
        {liked ? 'Unlike' : 'Like'}
      </button>
    )
  );
};

export default withSession(LikeRecipe);
