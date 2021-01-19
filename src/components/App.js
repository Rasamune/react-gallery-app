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

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      query: "",
      photos: [],
      catPhotos: [],
      dogPhotos: [],
      computerPhotos: [],
      loading: true
    };
  } 

  componentDidMount() {
    this.performSearch('cats');
    this.performSearch('dogs');
    this.performSearch('computers');
    this.performSearch();
  }

  performSearch = (query = 'default') => {
    fetch(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${query}&per_page=24&format=json&nojsoncallback=?`)
      .then(response => response.json())
      .then(responseData => {
        if (query === 'cats') {
          this.setState({ catPhotos: responseData.photos.photo });
        } else if (query === 'dogs') {
          this.setState({ dogPhotos: responseData.photos.photo });
        } else if (query === 'computers') {
          this.setState({ computerPhotos: responseData.photos.photo });
        } else {
          this.setState({ photos: responseData.photos.photo });
        }
        this.setState({ query })
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
          <Switch>
            <Route path="/cats" render={ () => <PhotoContainer photos={this.state.catPhotos} /> }/>
            <Route path="/dogs" render={ () => <PhotoContainer photos={this.state.dogPhotos} /> }/>
            <Route path="/computers" render={ () => <PhotoContainer photos={this.state.computerPhotos} /> }/>
            <Route path="/search" render={ () => <PhotoContainer photos={this.state.photos} search={this.performSearch} query={this.state.query}/> }/>
          </Switch>  
        </div>
      </BrowserRouter>
    );
  }
}