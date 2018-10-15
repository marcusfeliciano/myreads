import React from 'react';
import CardBook from './CardBook';

const BookList = (props) => {
    return (
        <div className="bookshelf-books">
            <ol className="books-grid">
                {props.collection.map(book => (
                    <li key={book.id}>
                        <CardBook
                            book={book} />
                    </li>
                ))}
            </ol>
        </div>
    );


}

export default BookList;