import React from 'react';
import CardBook from './CardBook';
import PropTypes from 'prop-types';

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

BookList.propTypes = {
    collection: PropTypes.array
}

export default BookList;