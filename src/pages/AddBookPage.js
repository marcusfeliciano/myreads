import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

import * as BooksService from '../services/BooksService';
import CardBook from '../components/CardBook';
import BookCollectionEvents from '../components/BookCollectionEvents';
import AddBookToolbar from '../components/AddBookToolbar';

import { AppChanels } from '../App';
import PubSub from 'pubsub-js';


class AddBookPage extends Component {

    bookCollectionToken = null;

    state = {
        search: '',
        inExecuteTask: false,
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
    set inExecuteTask(inExecuteTask) {
        this.setState((prev) => ({ inExecuteTask: inExecuteTask }));
    }

    request = (query) => {
        this.executeTaskWithLoading(BooksService.search(query))
            .then(books => this.setResultList(books))
            .catch(() => this.setResultList([]));
    }


    get inExecuteTask() {
        return this.state.inExecuteTask;
    }
    get hasSelectedBooks() {
        return this.state.selectedBooks.length !== 0;
    }

    changeShelf = (book, shelf) => {
        this.executeTaskWithLoading(BooksService.changeShelf(book, shelf))
            .then(() => {
                this.props.history.push('/');
            });
    }

    sendCollectionToShelf = (shelf) => {
        this.executeTaskWithLoading(BooksService.addBooksCollectionToShelf(this.state.selectedBooks, shelf))
            .then(() => {
                this.props.history.push('/');
            });
    }

    /**
     * show loading when execute some task
     */
    executeTaskWithLoading = (promise) => {
        this.inExecuteTask = true;
        return new Promise((resolve, reject) => {
            promise.then((result) => {
                this.inExecuteTask = false;
                resolve(result);
            }).catch(err => {
                this.inExecuteTask = false;
                reject(err);
            });
        });

    }


    render() {

        return (
            <div className="search-books">
                <AddBookToolbar
                    inExecuteTask={this.state.inExecuteTask} 
                    onSearch={this.request}
                    selectedBooks={this.state.selectedBooks}
                 />
               
                <div className="search-books-results">
                    {(this.state.results.length !== 0 && (
                    <Segment>
                        <Dimmer active={this.inExecuteTask}>
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
                    ))}
                </div>

            </div>
        );
    }
}


export default withRouter(AddBookPage);