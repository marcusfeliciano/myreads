import React from 'react';
import { Segment, Dimmer } from 'semantic-ui-react';

import BookList from './BookList';

const BookShelf = (props) => {

    return (
        <div className="bookshelf">
            <Segment>
                <Dimmer active={props.blocked || false} inverted>
                </Dimmer>
                <h2 className="bookshelf-title">{props.shelf.title}</h2>
                <BookList collection={props.shelf.books} />
            </Segment>
        </div>
    );
}

export default BookShelf;