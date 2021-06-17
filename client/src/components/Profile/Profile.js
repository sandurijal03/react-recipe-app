import React from 'react';
import withAuth from '../withAuth';
import UserInfo from './UserInfo';
import UserRecipes from './UserRecipes';

const Profile = ({ session }) => {
  return (
    <div className='App'>
      <UserInfo session={session} />
      <UserRecipes username={session.getCurrentUser.username} />
    </div>
  );
};

export default withAuth((session) => session && session.getCurrentUser)(
  Profile,
);
