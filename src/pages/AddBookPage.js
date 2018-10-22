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

    shelfChanelToken = null;
    bookChanel = null;

    componentDidMount = () => {
        this.shelfChanelToken = PubSub.subscribe(AppChanels.SHELF_CHANEL, (chanel, event) => {
            const { bundle } = event;
            this.changeShelf(bundle.book, bundle.shelf);
        });
        
        this.bookChanel = PubSub.subscribe(AppChanels.BOOK_CHANEL, (chanel, event) => {
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
        PubSub.unsubscribe(this.shelfChanelToken);
        PubSub.unsubscribe(this.bookChanel);
        
    }

    setResultList = (list) => {
        this.setState((prev) => ({ results: list }));
    }
    setSearchingLoader = (searching) => {
        this.setState((prev) => ({ isSearching: searching }));
    }

    request = (query) => {
        this.executeTaskWithLoading(BooksService.search(query))
            .then(books => this.setResultList(books) )
            .catch(() => this.setResultList([]) );
    }
    

    get isSearching() {
        return this.state.isSearching;
    }
    get hasSelectedBooks () {
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
            promise.then((result)=>{
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