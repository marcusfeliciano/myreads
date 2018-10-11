import * as BooksAPI from '../api/BooksAPI';


const provider = () => {
    return BooksAPI;
}

export const shelfsWithBooks = () => {
    return new Promise((resolve, reject) => {
        const shelfs = {
            currentlyReading: {title: 'Currently Reading', books: []},
            wantToRead: {title: 'Want to Read', books: []},
            read: {title: 'Read', books: []},
        };
        provider().getAll().then(books => {
            console.log('recived', books)
            books.forEach(book=>{
                shelfs[book.shelf].books.push(book);
            });
            resolve(shelfs);
        }).catch(err => reject('Can\'t resolve.'));
    })    
}

export const changeShelf = (book, shelf) => {
    return provider().update(book, shelf);
}