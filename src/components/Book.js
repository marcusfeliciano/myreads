import React, { Component } from 'react';
import BookShelfChanger from './BookShelfChanger';

class Book extends Component {
    get book(){
        const {book} = this.props;
        return book;
    }

    get formatedTitle() {
        return `${this.book.title} - ${this.book.subtitle}`;
    }

    get bookAuthors() {
        return this.book.authors.join(', ');
    }
    
    get image() {
        return this.book.imageLinks.thumbnail;
    }

    render() { 
        const {onShelfChange} = this.props;
        return (
            <li>
                <div className="book">
                    <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url("${this.image}")` }}></div>
                        <BookShelfChanger book={this.book} onShelfChange={onShelfChange} />
                    </div>
                    <div className="book-title">{this.formatedTitle}</div>
                    <div className="book-authors">{this.bookAuthors}</div>
                </div>
            </li>
        );
    }
}

export default Book;