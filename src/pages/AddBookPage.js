import React, { Component } from 'react';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

import * as BooksService from '../services/BooksService';
import Search from '../components/Search';
import CardBook from '../components/CardBook';
import SendCollectToShelf from '../components/SendCollectToShelf';

import { AppChanels, AppEvents } from '../App';
import PubSub from 'pubsub-js';



class AddBookPage extends Component {
    state = {
        search: '',
        isSearching: false,
        selectedBooks: [],
        results: []
    }

    subscribe = null;

    componentDidMount = () => {
        this.subscribe = PubSub.subscribe(AppChanels.SHELF_CHANEL, (chanel, event) => {
            const { bundle } = event;
            this.changeShelf(bundle.book, bundle.shelf);
        });
        
        PubSub.subscribe(AppChanels.BOOK_CHANEL, (chanel, event) => {
            const { book } = event.bundle;
            this.setState((prev) => {
                if (event.type === AppEvents.BOOK_SELECTED) {
                    return ({ selectedBooks: [...prev.selectedBooks, book] });
                }
                return ({ selectedBooks: prev.selectedBooks.filter(b => b.id !== book.id) });

            }, () => {
                PubSub.publish(AppChanels.BOOK_COLLECT_CHANEL, {
                    type: null, bundle: {
                        selectedBooks: this.state.selectedBooks
                    }
                });
            });
        })
    }

    componentWillUnmount = () => {
        PubSub.unsubscribe(this.subscribe);
    }

    setResultList = (list) => {
        this.setState((prev) => ({ results: list }));
    }
    setSearchingLoader = (searching) => {
        this.setState((prev) => ({ isSearching: searching }));
    }

    request = (query) => {
        this.setSearchingLoader(true);
        
        BooksService.search(query)
            .then(books => {
                this.setSearchingLoader(false);
                this.setResultList(books);
            })
            .catch(() => {
                this.setSearchingLoader(false);
                this.setResultList([]);
            });
    }
    

    get isSearching() {
        return this.state.isSearching;
    }
    get hasSelectedBooks () {
        return this.state.selectedBooks.length !== 0;
    }

    changeShelf = (book, shelf) => {
        this.setSearchingLoader(true);
        BooksService.changeShelf(book, shelf)
            .then(() => {
                this.setSearchingLoader(false);
            });
    }

    sendCollectionToShelf = (shelf) => {
        this.setSearchingLoader(true);
        BooksService.addBooksCollectionToShelf(this.state.selectedBooks, shelf)
            .then(()=>this.setSearchingLoader(false));
    }


    render() {

        return (
            <div className="search-books">
                <div className="ui menu fixed inverted">
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