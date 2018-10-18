import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

import * as BooksService from '../services/BooksService';
import Search from '../components/Search';
import CardBook from '../components/CardBook';
import BookShelfChooser from '../components/BookShelfChooser';

import { AppChanels, AppEvents } from '../App';
import PubSub from 'pubsub-js';


class AddBookPage extends Component {
    state = {
        search: '',
        isSearching: false,
        selectedBooks:[],
        results: []
    }

    subscribe = null;

    componentDidMount = () => {
        this.subscribe = PubSub.subscribe(AppChanels.SHELF_CHANEL, (chanel, event) => {
            const { bundle } = event;
            this.changeShelf(bundle.book, bundle.shelf);
        });
        PubSub.subscribe(AppChanels.BOOK_CHANEL,(chanel, event) => {
            const { book } = event.bundle;
            this.setState((prev) => {
                if(event.type === AppEvents.BOOK_SELECTED){
                    if(!prev.selectedBooks.includes(book.id)){
                        return ({selectedBooks:[...prev.selectedBooks, book.id]});
                    }
                    return ({selectedBooks:[...prev.selectedBooks]});
                }
                return ({selectedBooks:prev.selectedBooks.filter( b => b !== book.id)});
                
            }, () => {
                PubSub.publish(AppChanels.BOOK_COLLECT_CHANEL, {type:null, bundle : {
                    selectedBooks: this.state.selectedBooks
                }});
            });
        })
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
                    {(this.state.selectedBooks.length === 0 && (
                        <Search onSearch={(query) => this.request(query)} />))} 
                    {(this.state.selectedBooks.length !== 0 && (
                        <div>
                            <BookShelfChooser shelf={null} book={null} />
                        </div>
                        ))} 
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