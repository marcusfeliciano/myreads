import React from 'react';
import { Route } from 'react-router-dom';

import './App.css'
import AddBook from './components/AddBook';
import Shelfs from './components/Shelfs';



export const AppChanels = {
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

const BooksApp = () => {
  return (
    <div className="app">
      <Route exact path='/' render={() => <Shelfs />} />
      <Route path='/search' render={() => <AddBook />} />
    </div>
  )
}

export default BooksApp