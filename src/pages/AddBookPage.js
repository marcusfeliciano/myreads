import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dimmer, Loader, Segment, Icon } from 'semantic-ui-react';

import * as BooksService from '../services/BooksService';
import Search from '../components/Search';
import CardBook from '../components/CardBook';
import SendCollectToShelf from '../components/SendCollectToShelf';
import BookCollectionEvents from '../components/BookCollectionEvents';

import { AppChanels } from '../App';
import PubSub from 'pubsub-js';


class AddBookPage extends Component {

    bookCollectionToken = null;

    state = {
        search: '',
        isSearching: false,
        selectedBooks: [],
        results: []
    }

    componentDidMount = () => {
        this.subscribeBookCollectionChanel();
    }

    subscribeBookCollectionChanel = () => {
        this.bookCollectionToken = PubSub.subscribe(AppChanels.BOOK_COLLECT_CHANEL, (chanel, event) => {
            this.setState(() => ({ selectedBooks: event.bundle.selectedBooks }))
        });
    }

    componentWillUnmount = () => {
        PubSub.unsubscribe(this.bookCollectionToken);
    }

    setResultList = (list) => {
        this.setState((prev) => ({ results: list }));
    }
    setSearchingLoader = (searching) => {
        this.setState((prev) => ({ isSearching: searching }));
    }

    request = (query) => {
        this.executeTaskWithLoading(BooksService.search(query))
            .then(books => this.setResultList(books))
            .catch(() => this.setResultList([]));
    }


    get isSearching() {
        return this.state.isSearching;
    }
    get hasSelectedBooks() {
        return this.state.selectedBooks.length !== 0;
    }

    changeShelf = (book, shelf) => {
        this.executeTaskWithLoading(BooksService.changeShelf(book, shelf));
    }

    sendCollectionToShelf = (shelf) => {
        this.executeTaskWithLoading(BooksService.addBooksCollectionToShelf(this.state.selectedBooks, shelf));
    }

    /**
     * show loading when execute some task
     */
    executeTaskWithLoading = (promise) => {
        this.setSearchingLoader(true);
        return new Promise((resolve, reject) => {
            promise.then((result) => {
                this.setSearchingLoader(false);
                resolve(result);
            }).catch(err => {
                this.setSearchingLoader(false);
                reject(err);
            });
        })

    }


    render() {

        return (
            <div className="search-books">
                <div className="ui menu fixed inverted">
                    <div className="ui three column stackable grid container" style={{ margin: 0 }}>
                        <Link to='/' className="item three wide column">
                            <Icon name='book' size='big' />
                            MyReads
                        </Link>
                        {
                        (!this.hasSelectedBooks && (
                            <Search loading={this.state.isSearching} onSearch={(query) => this.request(query)} />
                        ))
                        }
                        {
                            (this.hasSelectedBooks && (
                                <SendCollectToShelf
                                    onSelectShelf={this.sendCollectionToShelf}
                                    selectedBooks={this.state.selectedBooks} />
                            ))
                        }                        
                    </div>
                   
                </div>

                <div className="search-books-results">
                    <Segment>
                        <Dimmer active={this.isSearching}>
                            <Loader />
                        </Dimmer>
                        <BookCollectionEvents changeShelf={this.changeShelf}>
                            <ol className="books-grid">
                                {this.state.results.map(book =>
                                    <li key={book.id}>
                                        <CardBook
                                            book={book} />
                                    </li>
                                )}
                            </ol>
                        </BookCollectionEvents>
                    </Segment>
                </div>

            </div>
        );
    }
}


export default AddBookPage;