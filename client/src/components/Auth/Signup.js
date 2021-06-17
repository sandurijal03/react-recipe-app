import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import { SIGN_UP } from '../../queries/index';
import Error from '../Error';

const Signup = (props) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const clearState = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
  };

  const handleSubmit = (e, signupuser) => {
    e.preventDefault();
    signupuser().then(async ({ data }) => {
      localStorage.setItem('token', data.signupUser.token);
      await props.refetch();
      clearState();
      props.history.push('/');
    });
  };

  const validateForm = () => {
    const isInvalid =
      !username || !email || !password || password !== passwordConfirmation;
    return isInvalid;
  };

  const [signupUser, { error, loading }] = useMutation(SIGN_UP, {
    variables: {
      username,
      email,
      password,
    },
  });

  return (
    <div className='App'>
      <h2 className='App'>Signup</h2>
      <form
        className='form'
        onSubmit={(event) => handleSubmit(event, signupUser)}
      >
        <input
          type='text'
          name='username'
          placeholder='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='email'
          name='email'
          value={email}
          placeholder='email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          name='password'
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type='password'
          name='passwordConfirmation'
          placeholder='confirm password'
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        <button
          type='submit'
          className='button-primary'
          disabled={loading || validateForm()}
        >
          Submit
        </button>
        {error && <Error message={error.message} />}
      </form>
    </div>
  );
};

export default withRouter(Signup);
