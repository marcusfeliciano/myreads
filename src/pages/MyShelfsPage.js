import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Dimmer, Loader, Segment } from 'semantic-ui-react';
import BookShelf from '../components/BookShelf';
import PubSub from 'pubsub-js';
import { AppChanels } from '../App';

import * as BooksService from '../services/BooksService';

class MyShelfsPage extends Component {
    subscribe  = null
    state = {
        shelfs: {},
        inLoading: false
    }
    componentDidMount() {
        this.loadShelfs();
        this.subscribe = PubSub.subscribe(AppChanels.SHELF_CHANEL, (chanel, event) => {
            this.changeShelf(event.bundle.book, event.bundle.shelf);
        })
    }
    componentWillUnmount() {
        PubSub.unsubscribe(this.subscribe);
    }

    loadShelfs = () => {
        this.inLoading(true);
        BooksService.shelfsWithBooks().then(shelfs => {
            this.inLoading(false);
            this.setState(() => ({ shelfs: shelfs }));
        });
    }

    changeShelf = (book, shelf) => {
        this.inLoading(true);
        BooksService.changeShelf(book, shelf)
            .then(() => {
                this.inLoading(false);
                this.loadShelfs();
            });
    }

    inLoading = (state) => {
        this.setState(() => ({ inLoading: state }))
    }

    getShelfsList = () => {
        return Object.keys(this.state.shelfs)
    }

    render() {
        const { shelfs } = this.state;
        return (
            <div>
                <div className="ui menu fixed inverted">
                    <div className="ui three column stackable grid container"  style={{margin:0}}>
                        <Link to='/' className="item three wide column">
                            <Icon name='book' size='big' />
                            MyReads
                        </Link>
                    </div>
                </div>
                <div className="list-books">
                    <Segment>
                        <Dimmer active={this.state.inLoading}>
                            <Loader />
                        </Dimmer>

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
                    </Segment>
                </div>
            </div>
        )
    }
}

export default MyShelfsPage;