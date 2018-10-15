import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';
import BookShelf from '../components/BookShelf';
import PubSub from 'pubsub-js';
import { AppChanels, AppEvents } from '../App';

import * as BooksService from '../services/BooksService';

class MyShelfsPage extends Component {
    state = {
        shelfs: {}
    }
    componentDidMount() {
        this.loadShelfs();
    }

    loadShelfs = () => {
        BooksService.shelfsWithBooks().then(shelfs => {
            this.setState(() => ({ shelfs: shelfs }));
        });
    }

    changeShelf = (book, shelf) => {
        const bundle = { bundle: { book } };
        PubSub.publish(AppChanels.BOOK_CHANEL, { type: AppEvents.BOOK_ADDING, bundle });
        BooksService.changeShelf(book, shelf)
            .then(() => {
                PubSub.publish(AppChanels.BOOK_CHANEL, { type: AppEvents.BOOK_ADDED, bundle });
                this.loadShelfs();
            });
    }


    getShelfsList = () => {
        return Object.keys(this.state.shelfs)
    }

    render() {
        const { shelfs } = this.state;
        return (
            <div>
                <div className="ui fixed inverted menu">
                    <div className="ui container">
                        <span className="header item">
                            <Icon name='book' size='big' />
                            MyReads
                        </span>
                    </div>
                </div>
                <div className="list-books">

                    <div className="list-books-content">
                        {
                            this.getShelfsList().map(shelf =>
                                <BookShelf
                                    onAddToShelf={this.changeShelf}
                                    key={shelf}
                                    shelf={shelfs[shelf]} />)
                        }
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