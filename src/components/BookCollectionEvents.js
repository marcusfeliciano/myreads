import React, { Component } from 'react';
import { AppChanels, AppEvents } from '../App';
import PubSub from 'pubsub-js';

class BookCollectionEvents extends Component {

    shelfChangeToken  = null;
    bookChanelToken = null;
    state = {
        selectedBooks: [],
    }

    componentDidMount() {        
        this.subscribeShelfChanel();
        this.subscribeBookChanel();
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.shelfChangeToken);
        PubSub.unsubscribe(this.bookChanelToken);
    }

    subscribeShelfChanel = () => {
        this.shelfChangeToken = PubSub.subscribe(AppChanels.SHELF_CHANEL, (chanel, event) => {
            this.props.changeShelf(event.bundle.book, event.bundle.shelf);
        });
    }

    subscribeBookChanel = () => {
        this.bookChanelToken = PubSub.subscribe(AppChanels.BOOK_CHANEL, (chanel, event) => {
            const { book } = event.bundle;
            if (event.type === AppEvents.BOOK_SELECTED) {
                this.addBookToSelection(book);
            } else if(event.type === AppEvents.BOOK_UNSELECTED) {
                this.removeBookFromSelection(book);
            }            
        });
    }

    addBookToSelection = (book) => {
        this.setState((prev) =>
            ({ selectedBooks: [...prev.selectedBooks, book] })
        , this.publishThatSelectedsBookChanged);
    }    

    removeBookFromSelection = (book) => {
        this.setState((prev) => 
            ({ selectedBooks: prev.selectedBooks.filter(b => b.id !== book.id) })
        , this.publishThatSelectedsBookChanged);
    }

    publishThatSelectedsBookChanged = () => {
        PubSub.publish(AppChanels.BOOK_COLLECT_CHANEL, {
            type: null, bundle: {
                selectedBooks: this.state.selectedBooks
            }
        });        
    }

    render() {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        )
    }
}

export default BookCollectionEvents;