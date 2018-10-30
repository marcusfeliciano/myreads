import * as BooksAPI from '../api/BooksAPI';


const provider = () => {
    return BooksAPI;
}
export const SHELF_LIST = [
    //{'key':'move', 'value': 'Move to...', 'text': 'Move to...'},
    {key:'select', value: 'select', text: 'Select...', 'disabled':true},
    {key:'currentlyReading', value: 'currentlyReading', text: 'Currently Reading'},
    {key:'wantToRead', value: 'wantToRead', text: 'Want to Read'},
    {key:'read', value: 'read', text: 'Read'}
];

export const shelfsWithBooks = () => {
    return new Promise((resolve, reject) => {
        const shelfs = {
            currentlyReading: { title: 'Currently Reading', books: [] },
            wantToRead: { title: 'Want to Read', books: [] },
            read: { title: 'Read', books: [] },
        };
        provider().getAll().then(books => {
            books.forEach(book => {
                shelfs[book.shelf].books.push(book);
            });
            resolve(shelfs);
        }).catch(err => reject('Can\'t resolve.'));
    })
}

export const changeShelf = (book, shelf) => {
    return provider().update(book, shelf);
}

export const addBooksCollectionToShelf = (books, shelf) => {
    return provider().updateCollection(books, shelf);
}

export const search = (term) => {    

    const promise = new Promise((resolve, reject) => {
        provider().search(term).then((result) => {
            const books = result.hasOwnProperty('error')
                ? []
                : result;
            resolve(books)
        })
            .catch(err => {
                console.log('erro ao recuperar', err)
                reject([])
            });
    });
    
    return promise;
}