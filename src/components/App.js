import React, { Component } from 'react';
import '../css/index.css';
import apiKey from '../config.js';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom'; 

// App Components
import Search from './Search';
import Nav from './Nav';
import PhotoContainer from './PhotoContainer';
import NotFound404 from './NotFound404';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      query: "",
      title: "",
      photos: [],
      catPhotos: [],
      dogPhotos: [],
      computerPhotos: [],
      loading: true
    };
  } 

  componentDidMount() {
    // Perform initial searches when component mounts (page loads)
    this.performSearch('cats');
    this.performSearch('dogs');
    this.performSearch('computers');
    this.performSearch();
  }

  performSearch = (query = 'Welcome') => {
    // Set state to loading while fetching the photos
    this.setState({ loading: true });
    // Fetch photos from flickr API
    fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${query}&per_page=24&format=json&nojsoncallback=?`)
      .then(response => response.json())
      .then(responseData => {
        // Save the main category photos in their respective states
        if (query === 'cats') {
          this.setState({ catPhotos: responseData.photos.photo });
        } else if (query === 'dogs') {
          this.setState({ dogPhotos: responseData.photos.photo });
        } else if (query === 'computers') {
          this.setState({ computerPhotos: responseData.photos.photo });
        } else {
          // Save search category photos in the 'photos' state
          this.setState({ photos: responseData.photos.photo });
        }
        // Save the current query so that we can check it against the search results later
        this.setState({ query });
        // Save the query as the title of each page
        this.setState({ title: query });
        // Photos have loaded, so set loading to false
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log('Error fetching and parsing data', error);
      });
  }

  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <Search onSearch={this.performSearch}/>
          <Nav />
          {
            // If state is loading, show the loading... else show routes
            (this.state.loading)
            ? <h2 className="title">Loading...</h2>
            :
            <Switch>
              <Route exact path="/" render={ () => <PhotoContainer photos={this.state.photos} title={'Welcome'}/> }/>
              <Route path="/cats" render={ () => <PhotoContainer photos={this.state.catPhotos} title='cats'/> }/>
              <Route path="/dogs" render={ () => <PhotoContainer photos={this.state.dogPhotos} title='dogs' /> }/>
              <Route path="/computers" render={ () => <PhotoContainer photos={this.state.computerPhotos} title='computers' /> }/>
              <Route path="/search" render={ () => 
                /* Search route needs additional props in order to keep track of
                   search results when the user navigates through the page history */
                <PhotoContainer 
                  photos={this.state.photos} 
                  search={this.performSearch} 
                  query={this.state.query}
                  title={this.state.title} 
                /> 
              }/>
              <Route component={NotFound404}/>
            </Switch>  
          }
        </div>
      </BrowserRouter>
    );
  }
}