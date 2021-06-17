import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import withSession from './components/withSessions';
import Navbar from './components/Navbar';
import Search from './components/Recipe/Search';
import AddRecipe from './components/Recipe/AddRecipe';
import Profile from './components/Profile/Profile';
import RecipePage from './components/Recipe/RecipePage';

const httpLink = new HttpLink({ uri: 'http://localhost:3001/graphql' });

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const Root = ({ refetch, session }) => (
  <Router>
    <>
      <Navbar session={session} />
      <Switch>
        <Route exact path='/' component={App} />
        <Route exact path='/search' component={Search} />
        <Route
          exact
          path='/signin'
          render={() => <Signin refetch={refetch} />}
        />
        <Route
          exact
          path='/signup'
          render={() => <Signup refetch={refetch} />}
        />
        <Route
          path='/recipe/add'
          render={() => <AddRecipe session={session} refetch={refetch} />}
        />
        <Route path='/recipes/:_id' component={RecipePage} />

        <Route path='/profile' render={() => <Profile session={session} />} />

        <Redirect to='/' />
      </Switch>
    </>
  </Router>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RootWithSession />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
