import '../css/index.css';

import Search from './Search';
import Nav from './Nav';
import PhotoContainer from './PhotoContainer';

function App() {
  return (
    <div className="container">
      <Search />
      <Nav />
      <PhotoContainer />  
    </div>
  );
}

export default App;
