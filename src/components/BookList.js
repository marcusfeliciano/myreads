import React, { Component } from 'react';
import Book from './Book';

class BookList extends Component {

    render() {
        const { collection, onAddToShelf } = this.props;
        return (
            <div className="bookshelf-books">
                <ol className="books-grid">
                    {collection.map(book => (
                        <Book
                            onAddToShelf={onAddToShelf}
                            key={book.id}
                            book={book} />
                    ))}
                </ol>
            </div>
        )
    }

}

export default BookList;