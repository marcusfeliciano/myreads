import React, { Component } from 'react';
import Book from './Book';

class BookList extends Component {

    render() {
        const { collection, onShelfChange } = this.props;
        return (
            <div className="bookshelf-books">
                <ol className="books-grid">
                    {collection.map(book => (
                        <Book
                            onShelfChange={onShelfChange}
                            key={book.id}
                            book={book} />
                    ))}
                </ol>
            </div>
        )
    }

}

export default BookList;