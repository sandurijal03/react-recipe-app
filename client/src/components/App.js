import './App.css';

import { GET_ALL_RECIPES } from '../queries';
import { useQuery } from '@apollo/client';
import RecipeItem from './Recipe/RecipeItem';

const App = () => {
  const { data, loading, error } = useQuery(GET_ALL_RECIPES);

  if (loading) return <div>Loading....</div>;
  if (error) return <div>Error</div>;

  return data.getAllRecipes.map((recipe) => (
    <ul key={recipe._id} className='App'>
      <RecipeItem {...recipe} key={recipe._id} />
    </ul>
  ));
};

export default App;
