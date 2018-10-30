import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import './App.css'
import AddBookPage from './pages/AddBookPage';
import MyShelfsPage from './pages/MyShelfsPage';
import * as BooksService from './services/BooksService';
import PubSub from 'pubsub-js';

export const AppChanels = {
  BOOK_COLLECT_CHANEL: 'BOOK_COLLECT_CHANEL',
  BOOK_CHANEL: 'BOOK_CHANEL',
  SHELF_CHANEL: 'SHELF_CHANEL'
}

export const AppEvents = {
  BOOK_ADDING: 1,
  BOOK_ADDED: 2,
  BOOK_SELECTED: 3,
  BOOK_UNSELECTED: 4,
  SHELF_CHOOSED: 5
}

export const SHELFS = [  
  {'key':'none', 'value': 'none', 'text': 'None'},
  {'key':'currentlyReading', 'value': 'currentlyReading', 'text': 'Currently Reading'},
  {'key':'wantToRead', 'value': 'wantToRead', 'text': 'Want to Read'},
  {'key':'read', 'value': 'read', 'text': 'Read'}
];

class BooksApp extends Component {

  state = {
    shelfs: [],
    bookSearchResult: [],
    inExecuteTask: false
  }

  componentWillMount = () => {    
    this.loadShelfs();
  }

  

  loadShelfs = () => {
    this.executeTaskWithLoading(BooksService.shelfsWithBooks()).then((shelfs) => {
      this.setState(() => ({ shelfs: shelfs }))
    });
  }

  searchBooks = (query) => {
    if(query === ''){
        this.bookSearchResult = [];
        return;
    }
    this.executeTaskWithLoading(BooksService.search(query))
        .then(books => this.bookSearchResult = books)
        .catch(() => this.bookSearchResult = []);
  }

  changeShelf = (book, shelf) => {
    this.executeTaskWithLoading(BooksService.changeShelf(book, shelf))
      .then(() => this.loadShelfs());
  }

  /**
   * Send a collection of books to one shelf
   */
  sendCollectionToShelf = (selectedBooks, shelf) => {

    this.executeTaskWithLoading(BooksService.addBooksCollectionToShelf(selectedBooks, shelf))
      .then(() => {
        this.publishThatBooksHasBeenAdded();
        this.loadShelfs();
      });
  }

  publishThatBooksHasBeenAdded = () => {
    PubSub.publish(AppChanels.BOOK_CHANEL, {
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

  get inExecuteTask() {
    return this.state.inExecuteTask;
  }

  set inExecuteTask(state) {
    this.setState(() => ({ inExecuteTask: state }));
  }
  get bookSearchResult() {
    return this.state.bookSearchResult;
  }
  set bookSearchResult(list) {
    this.setState((prev) => ({ bookSearchResult: list }));
  }

  render() {
    const { shelfs } = this.state;    
    return (
      <div className="app">
        <BrowserRouter>
          <div>
            <Route exact path='/' render={() => 
              <MyShelfsPage
                shelfs={shelfs}
                inExecuteTask={this.inExecuteTask}
                changeShelf={this.changeShelf}
                sendCollectionToShelf={this.sendCollectionToShelf} />} />
            <Route path='/search' render={() => 
              <AddBookPage
                changeShelf={this.changeShelf}
                bookSearchResult={this.bookSearchResult}
                sendCollectionToShelf={this.sendCollectionToShelf}
                searchBooks={this.searchBooks}
                inExecuteTask={this.inExecuteTask} 
                shelfs={shelfs} />} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default BooksApp