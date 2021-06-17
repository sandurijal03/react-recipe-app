import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';

import { SIGN_IN } from '../../queries/index';
import Error from '../Error';

const Signin = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const clearState = () => {
    setUsername('');
    setPassword('');
  };

  const handleSubmit = (e, signinuser) => {
    e.preventDefault();
    signinuser().then(async ({ data }) => {
      console.log(data);
      localStorage.setItem('token', data.signinUser.token);
      await props.refetch();
      clearState();
      props.history.push('/');
    });
  };

  const validateForm = () => {
    const isInvalid = !username || !password;
    return isInvalid;
  };

  const [signinUser, { error, loading }] = useMutation(SIGN_IN, {
    variables: {
      username,
      password,
    },
  });

  return (
    <div className='App'>
      <h2 className='App'>Signin</h2>
      <form
        className='form'
        onSubmit={(event) => handleSubmit(event, signinUser)}
      >
        <input
          type='text'
          name='username'
          placeholder='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='password'
          name='password'
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

export default withRouter(Signin);
