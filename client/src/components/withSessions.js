import { useQuery } from '@apollo/client';
import React from 'react';
import { GET_CURRENT_USER } from '../queries';

const withSession = (Component) => (props) => {
  const { loading, data, refetch } = useQuery(GET_CURRENT_USER);

  if (loading) return null;
  return <Component {...props} refetch={refetch} session={data} />;
};

export default withSession;
