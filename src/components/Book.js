import React, { Component } from 'react';
import BookShelfAdd from './BookShelfAdd';

class Book extends Component {
    get book(){
        const {book} = this.props;
        return book;
    }

    get formatedTitle() {
        return `${this.book.title} - ${this.book.subtitle}`;
    }

    get bookAuthors() {
        return this.book.hasOwnProperty('authors')
        ? this.book.authors.join(', ')
        : ' - ';

    }
    
    get image() {
        return this.book.imageLinks.thumbnail;
    }

    render() { 
        const { onAddToShelf } = this.props;
        return (
            <li>
                <div className="book">
                    <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url("${this.image}")` }}></div>
                        <BookShelfAdd book={this.book} onAddToShelf={ onAddToShelf } />
                    </div>
                    <div className="book-title">{this.formatedTitle}</div>
                    <div className="book-authors">{this.bookAuthors}</div>
                </div>
            </li>
        );
    }
}

export default Book;