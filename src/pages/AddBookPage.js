import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

import * as BooksService from '../services/BooksService';
import Search from '../components/Search';
import CardBook from '../components/CardBook';

import { AppChanels, AppEvents } from '../App';
import PubSub from 'pubsub-js';


class AddBookPage extends Component {
    state = {
        search: '',
        isSearching: false,
        results: []
    }

    subscribe = null;

    componentDidMount = () => {
        this.subscribe = PubSub.subscribe(AppChanels.SHELF_CHANEL, (chanel, event) => {
            const { bundle } = event;
            this.changeShelf(bundle.book, bundle.shelf);
        });
    }

    componentWillUnmount = () => {
        PubSub.unsubscribe(this.subscribe);
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

    changeShelf = (book, shelf) => {
        PubSub.publish(AppChanels.BOOK_CHANEL, { type: AppEvents.BOOK_ADDING, book });
        BooksService.changeShelf(book, shelf)
            .then(() => {
                PubSub.publish(AppChanels.BOOK_CHANEL, { type: AppEvents.BOOK_ADDED, book });
            });
    }


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
                        <Dimmer active={this.isSearching}>
                            <Loader />
                        </Dimmer>
                        <ol className="books-grid">
                            {this.state.results.map(book =>
                                <li key={book.id}>
                                    <CardBook
                                        book={book} />
                                </li>
                            )}
                        </ol>
                    </Segment>
                </div>

            </div>
        );
    }
}

export default AddBookPage;