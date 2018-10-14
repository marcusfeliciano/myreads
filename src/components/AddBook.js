import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import * as BooksService from '../services/BooksService';
import Search from './Search';
import Book from './Book';

class AddBook extends Component {
    state = {
        search: '',
        results: []
    }

    setResultList = (list) => this.setState((prev) => ({ results: list }))

    request = (query) => {
        BooksService.search(query)
            .then(books => this.setResultList(books))
            .catch(() => this.setResultList([]));
    }

    changeShelf = (book, shelf) => 
        BooksService.changeShelf(book, shelf)
            .then();


    render() {

        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link to='/' className="close-search">Close</Link>
                    <Search onSearch={(query) => this.request(query)} />
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {this.state.results.map(book =>
                            <Book
                                key={book.id}
                                book={book}>
                                <BookShelfAdd book={this.book} onAddToShelf={ this.changeShelf } />
                            </Book>
                        )}
                    </ol>
                </div>
            </div>
        );
    }
}

export default AddBook;