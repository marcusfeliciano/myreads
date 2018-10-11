import React, { Component } from 'react';
import BookList from './BookList';

class BookShelf extends Component {

    render() {
        const { shelf, onShelfChange } = this.props;

        return (
            <div className="bookshelf">
                <h2 className="bookshelf-title">{shelf.title}</h2>
                <BookList onShelfChange={onShelfChange} collection={shelf.books} />
            </div>
        );
    }
}

export default BookShelf;