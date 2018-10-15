import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import './App.css'
import AddBookPage from './pages/AddBookPage';
import MyShelfsPage from './pages/MyShelfsPage';



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
      <BrowserRouter>
        <div>
          <Route exact path='/' render={() => <MyShelfsPage />} />
          <Route path='/search' render={() => <AddBookPage />} />
        </div>
      </BrowserRouter>
    </div>
  )
}

export default BooksApp