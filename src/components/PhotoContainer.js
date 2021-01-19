import React, { Component } from 'react';
import { withRouter } from 'react-router';

import NotFound from './NotFound';
import Photo from './Photo';

class PhotoContainer extends Component {
    render() {
        // If this is a /search/ path
        let path = this.props.location.pathname;
        if (path.includes('/search/')) {
            // Remove the "/search/" part from the path
            path = path.slice(8);
            /* If the path does not match the query, do another search of the path
               This is to ensure that the search is refreshed when navigating the history */
            if (path !== this.props.query) {
                this.props.search(path);
            }
        }
        
        const results = this.props.photos;
        let photos;
        // If photos are not empty
        if (results.length > 0) {
            // Add a Photo component for each photo in results
            photos = results.map(photo => {
                const url = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
                return <Photo url={url} key={photo.id}/>
            });
        } else {
            // If no results, then add the NotFound component
            photos = <NotFound />
        }

        return (
            <div className="photo-container">
                <h2>Results for '<span className="title">{ this.props.title }</span>'</h2>
                <ul>
                    {/* Display the photos */}
                    { photos }
                </ul>
            </div>
        );
    }
}

export default withRouter(PhotoContainer);