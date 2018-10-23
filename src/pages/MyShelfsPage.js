import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Loader, Dimmer } from 'semantic-ui-react';
import BookShelf from '../components/BookShelf';
import BookCollectionEvents from '../components/BookCollectionEvents';

import { AppChanels } from '../App';
import PubSub from 'pubsub-js';

import * as BooksService from '../services/BooksService';


class MyShelfsPage extends Component {

    state = {
        shelfs: {},
        inLoading: false,
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

    /**
     * show loading when execute some task
     */
    executeTaskWithLoading = (promise) => {
        this.inLoading(true);
        return new Promise((resolve, reject) => {
            promise.then((result) => {
                this.inLoading(false);
                resolve(result);
            }).catch(err => {
                this.inLoading(false);
                reject(err);
            });
        })

    }

    inLoading = (state) => {
        this.setState(() => ({ inLoading: state }))
    }

    getShelfsList = () => {
        return Object.keys(this.state.shelfs)
    }

    blockShelf = (shelf) => {
        const { selectedBooks } = this.state;
        return selectedBooks.length && selectedBooks[0].shelf !== shelf;
    }

    render() {
        const { shelfs } = this.state;
        return (
            <div>
                <div className="ui menu fixed inverted">
                    <div className="ui three column stackable grid container" style={{ margin: 0 }}>
                        <Link to='/' className="item three wide column">
                            <Icon name='book' size='big' />
                            MyReads
                        </Link>
                        <div className='item ten column right'>
                            <Dimmer active={this.state.inLoading}>
                                <Loader />
                            </Dimmer>
                        </div>
                    </div>

                </div>
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