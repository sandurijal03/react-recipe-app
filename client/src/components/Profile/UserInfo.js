import React from 'react';
import { Link } from 'react-router-dom';

const formatDate = (date) => {
  const newDate = new Date(date).toLocaleDateString();
  const newTime = new Date(date).toLocaleTimeString();
  return `${newDate} at ${newTime}`;
};

const UserInfo = ({ session }) => {
  const { username, joinDate, email, favorites } = session.getCurrentUser;
  console.log(session.getCurrentUser);
  return (
    <div>
      <h3>User Info</h3>
      <p>Username: {username}</p>
      <p>Email: {email}</p>
      <p>Join Date: {formatDate(+joinDate)}</p>

      <ul>
        <h3>{username}'s favourites</h3>
        {favorites.map((favorite) => (
          <li key={favorite._id}>
            <Link to={`/recipes/${favorite._id}`}>{favorite.name}</Link>
          </li>
        ))}
        {!session.getCurrentUser.favorites.length && (
          <p>
            <strong>You have not favorites currently. Go add somes</strong>
          </p>
        )}
      </ul>
    </div>
  );
};

export default UserInfo;
