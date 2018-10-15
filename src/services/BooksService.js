import * as BooksAPI from '../api/BooksAPI';


const provider = () => {
    return BooksAPI;
}

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