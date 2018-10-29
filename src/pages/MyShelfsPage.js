import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import BookShelf from '../components/BookShelf';
import BookCollectionEvents from '../components/BookCollectionEvents';
import MyShelfsToolbar from '../components/MyShelfsToolbar';

import { AppChanels } from '../App';
import PubSub from 'pubsub-js';

import * as BooksService from '../services/BooksService';


class MyShelfsPage extends Component {

    bookCollectionToken = null;

    state = {
        selectedBooks: []
    }

    componentWillMount() {
        this.subscribeBookCollectionChanel();
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.bookCollectionToken);
    }

    subscribeBookCollectionChanel = () => {
        this.bookCollectionToken = PubSub.subscribe(AppChanels.BOOK_COLLECT_CHANEL, (chanel, event) => {
          this.setState(() => ({ selectedBooks: event.bundle.selectedBooks }))
        });
      }

    get selectedBooks() {
        return this.state.selectedBooks;
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

    get getShelfsList() {
        return Object.keys(this.props.shelfs)
    }

    blockShelf = (shelf) => {
        const { selectedBooks } = this.state;
        return (selectedBooks.length && selectedBooks[0].shelf !== shelf) || this.props.inExecuteTask;
    }
    

    render() {
        const { shelfs, inExecuteTask, changeShelf, sendCollectionToShelf } = this.props;
        
        return (
            <div>
                <MyShelfsToolbar
                    inExecuteTask={inExecuteTask} 
                    selectedBooks={this.selectedBooks}
                    listToShelf={this.listToShelf}
                    sendCollectionToShelf={(e, {value})=> sendCollectionToShelf(this.state.selectedBooks, value)} />
                <div className="list-books">
                    <div className="list-books-content">
                        <BookCollectionEvents changeShelf={changeShelf}>
                            {
                                this.getShelfsList.map(shelf =>
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