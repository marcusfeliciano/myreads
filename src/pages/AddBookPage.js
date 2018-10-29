import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Dimmer, Loader, Segment } from 'semantic-ui-react';

import CardBook from '../components/CardBook';
import BookCollectionEvents from '../components/BookCollectionEvents';
import AddBookToolbar from '../components/AddBookToolbar';

import { AppChanels } from '../App';
import PubSub from 'pubsub-js';


class AddBookPage extends Component {

    bookCollectionToken = null;

    state = {
        search: '',
        selectedBooks: []
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

    sendCollectionToShelf = (event, { value }) => {
        this.props.sendCollectionToShelf(this.state.selectedBooks, value);
        this.props.history.push('/');
        this.props.searchBooks('');
    }

    changeShelf = (book, shelf) => {
        this.props.changeShelf(book, shelf);
        this.props.history.push('/');
        this.props.searchBooks('');
    }

    formatedID(book) {        
        return [book.id, '-', book.shelf].join('');
    }

    get hasSelectedBooks() {
        return this.state.selectedBooks.length !== 0;
    }

    get bookSearchResultWithShelf() {
        
        const { bookSearchResult, shelfs } = this.props;
        return bookSearchResult.map( book => {            
            var shelfBook = 'none';
            Object.keys(shelfs).forEach(shelf => {
                shelfs[shelf].books.forEach(shelfBookObject => {                    
                    if (shelfBookObject.id === book.id) {
                        shelfBook = shelf;                        
                    }
                });
            });
            return Object.assign({shelf:shelfBook}, book);
        });
    }

    render() {
        const { inExecuteTask, bookSearchResult, searchBooks } = this.props;
        const { selectedBooks } = this.state;
        return (
            <div className="search-books">
                <AddBookToolbar
                    inExecuteTask={inExecuteTask}
                    onSearch={searchBooks}
                    sendCollectionToShelf={this.sendCollectionToShelf}
                    selectedBooks={selectedBooks}
                />

                <div className="search-books-results">
                    {(bookSearchResult.length !== 0 && (
                        <Segment>
                            <Dimmer active={inExecuteTask}>
                                <Loader />
                            </Dimmer>
                            <BookCollectionEvents changeShelf={this.changeShelf}>
                                <ol className="books-grid">
                                    {this.bookSearchResultWithShelf.map(book =>
                                        <li key={this.formatedID(book)}>
                                            <CardBook book={book} />
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