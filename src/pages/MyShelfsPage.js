import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Loader, Dimmer, Dropdown } from 'semantic-ui-react';
import BookShelf from '../components/BookShelf';
import BookCollectionEvents from '../components/BookCollectionEvents';
import MyShelfsToolBar from '../components/MyShelfsToolBar';

import { AppChanels, AppEvents } from '../App';
import PubSub from 'pubsub-js';

import * as BooksService from '../services/BooksService';


class MyShelfsPage extends Component {

    state = {
        shelfs: {},
        inExecuteTask: false,
        selectedBooks: [],
    }

    componentDidMount() {
        this.loadShelfs();
        this.subscribeBookCollectionChanel();
    }
    componentWillUnmount() {
        PubSub.unsubscribe(this.bookCollectionToken);
    }

    loadShelfs = () => {
        this.executeTaskWithLoading(BooksService.shelfsWithBooks())
            .then(shelfs => this.setState(() => ({ shelfs: shelfs }))
            );
    }

    subscribeBookCollectionChanel = () => {
        this.bookCollectionToken = PubSub.subscribe(AppChanels.BOOK_COLLECT_CHANEL, (chanel, event) => {
            this.setState(() => ({ selectedBooks: event.bundle.selectedBooks }))
        });
    }

    changeShelf = (book, shelf) => {
        this.executeTaskWithLoading(BooksService.changeShelf(book, shelf))
            .then(() => this.loadShelfs());
    }

    sendCollectionToShelf = (e, { value }) => {
        this.executeTaskWithLoading(BooksService.addBooksCollectionToShelf(this.state.selectedBooks, value))
            .then(() => {
                this.publishThatBooksHasBeenAdded();
                this.loadShelfs();
            });
    }

    publishThatBooksHasBeenAdded = () => {
        PubSub.publish(AppChanels.BOOK_CHANEL,{
            type: AppEvents.BOOK_ADDED, bundle: {}
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
        })

    }
    get selectedBooks() {
        return this.state.selectedBooks;
    }
    get inExecuteTask() {
        return this.state.inExecuteTask;
    }

    get hasSelectedBooks() {
        return this.state.selectedBooks.length !== 0;
    }
 
    get listToShelf() {
        if(!this.hasSelectedBooks) {
            return [];
        }
        const shelf = this.state.selectedBooks[0].shelf;
        return BooksService.SHELF_LIST.filter(i => i.value !== shelf);
    }

    set inExecuteTask(state){
        this.setState(() => ({ inExecuteTask: state }))
    }

    getShelfsList = () => {
        return Object.keys(this.state.shelfs)
    }

    blockShelf = (shelf) => {
        const { selectedBooks } = this.state;
        return (selectedBooks.length && selectedBooks[0].shelf !== shelf) || this.inExecuteTask;
    }
    

    render() {
        const { shelfs } = this.state;
        return (
            <div>
                <MyShelfsToolBar
                    inExecuteTask={this.inExecuteTask} 
                    selectedBooks={this.selectedBooks}
                    listToShelf={this.listToShelf}
                    sendCollectionToShelf={this.sendCollectionToShelf} />
                <div className="list-books">
                    <div className="list-books-content">
                        <BookCollectionEvents changeShelf={this.changeShelf}>
                            {
                                this.getShelfsList().map(shelf =>
                                    <BookShelf
                                        blocked={this.blockShelf(shelf)}
                                        key={shelf}
                                        shelf={shelfs[shelf]} />)
                            }
                        </BookCollectionEvents>
                    </div>
                    <div className="open-search">
                        <Button circular
                            primary
                            size='huge'
                            icon='plus'
                            as={Link} to='/search' />
                    </div>
                </div>
            </div>
        )
    }
}

export default MyShelfsPage;