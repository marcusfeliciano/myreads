import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

import * as BooksService from '../services/BooksService';
import Search from './Search';
import Book from './Book';

class AddBook extends Component {
    state = {
        search: '',
        isSearching:false,
        results: []
    }

    setResultList = (list) => this.setState((prev) => ({ results: list }));
    setSearchingLoader = (searching) => this.setState((prev) => ({ isSearching: searching }));

    request = (query) => {
        this.setSearchingLoader(true);
        BooksService.search(query)
            .then(books => {
                this.setSearchingLoader(false);
                this.setResultList(books)
            })
            .catch(() => {
                this.setSearchingLoader(false);
                this.setResultList([])
            });
    }

    get isSearching() {
        return this.state.isSearching
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
                    <Loader active={this.isSearching} inline='centered' />
                </div>


                <div className="search-books-results">
                    <Segment>
                        <Dimmer active={this.isSearching}><Loader /></Dimmer>
                        <ol className="books-grid">
                            {this.state.results.map(book =>
                                <Book
                                    onAddToShelf={this.changeShelf}
                                    key={book.id}
                                    book={book} />
                            )}
                        </ol>
                    </Segment>
                </div>

            </div>
        );
    }
}

export default AddBook;