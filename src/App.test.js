import React from 'react';
import ReactDOM from 'react-dom';
import BooksApp from './App';


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BooksApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
