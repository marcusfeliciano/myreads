import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BookShelf from './BookShelf';

import * as BooksService from '../services/BooksService';

class Shelfs extends Component {
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
        BooksService.changeShelf(book, shelf)
            .then(() => this.loadShelfs());
    }


    getShelfsList = () => {
        return Object.keys(this.state.shelfs)
    }

    render() {
        const { shelfs } = this.state;
        return (
            <div className="list-books">
                <div className="list-books-title">
                    <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                    <div>
                        {
                            this.getShelfsList().map(shelf => <BookShelf
                                onAddToShelf={this.changeShelf}
                                key={shelf}
                                shelf={shelfs[shelf]} />)
                        }
                    </div>
                </div>
                <div className="open-search">
                    <Link to='/search'>Add a book</Link>
                </div>
            </div>
        )
    }
}

export default Shelfs;