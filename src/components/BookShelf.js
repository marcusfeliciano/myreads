import React, { Component } from 'react';
import BookList from './BookList';

class BookShelf extends Component {

    render() {
        const { shelf, onAddToShelf } = this.props;

        return (
            <div className="bookshelf">
                <h2 className="bookshelf-title">{shelf.title}</h2>
                <BookList onAddToShelf={onAddToShelf} collection={shelf.books} />
            </div>
        );
    }
}

export default BookShelf;