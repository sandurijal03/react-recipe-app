import { gql } from '@apollo/client';

export const GET_RECIPE = gql`
  query getRecipe($_id: ID!) {
    getRecipe(_id: $_id) {
      name
      category
      description
      category
      username
      likes
    }
  }
`;

export const GET_ALL_RECIPES = gql`
  query {
    getAllRecipes {
      _id
      name
      category
    }
  }
`;

export const ADD_RECIPE = gql`
  mutation(
    $name: String!
    $description: String!
    $category: String!
    $instructions: String!
    $username: String
    $imageUrl: String!
  ) {
    addRecipe(
      name: $name
      description: $description
      category: $category
      instructions: $instructions
      username: $username
      imageUrl: $imageUrl
    ) {
      name
      category
      description
      instructions
      createdDate
      likes
      username
      imageUrl
    }
  }
`;

export const SEARCH_RECIPES = gql`
  query($searchTerm: String) {
    searchRecipes(searchTerm: $searchTerm) {
      _id
      name
      category
      likes
    }
  }
`;

export const GET_USER_RECIPES = gql`
  query($username: String!) {
    getUserRecipes(username: $username) {
      _id
      name
      likes
    }
  }
`;

export const DELETE_USER_RECIPE = gql`
  mutation($_id: ID) {
    deleteUserRecipe(_id: $_id) {
      name
      category
    }
  }
`;

export const LIKE_RECIPE = gql`
  mutation($_id: ID!, $username: String!) {
    likeRecipe(_id: $_id, username: $username) {
      name
      likes
    }
  }
`;

export const UNLIKE_RECIPE = gql`
  mutation($_id: ID!, $username: String!) {
    unlikeRecipe(_id: $_id, username: $username) {
      name
      likes
    }
  }
`;

// ***********************************************

export const SIGN_UP = gql`
  mutation SIGN_UP($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

export const SIGN_IN = gql`
  mutation SIGN_IN($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query GET_CURRENT_USER {
    getCurrentUser {
      username
      joinDate
      email
      favorites {
        _id
        name
      }
    }
  }
`;
