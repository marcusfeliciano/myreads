import React from 'react';
import BookList from './BookList';

const BookShelf = (props) => {

    return (
        <div className="bookshelf">
            <h2 className="bookshelf-title">{props.shelf.title}</h2>
            <BookList collection={props.shelf.books} />
        </div>
    );
}

export default BookShelf;