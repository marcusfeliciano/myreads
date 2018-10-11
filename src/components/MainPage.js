import React, { Component } from 'react';
import BookShelf from './BookShelf';

class MainPage extends Component {
    getShelfsList = () => {
        return Object.keys(this.props.shelfs)
    }
    render() {
        const { shelfs, onShelfChange } = this.props;
        return (
            <div className="list-books">
                <div className="list-books-title">
                    <h1>MyReads</h1>
                </div>
                <div className="list-books-content">
                    <div>
                        {
                            this.getShelfsList().map(shelf => <BookShelf
                                onShelfChange={onShelfChange}
                                key={shelf}
                                shelf={shelfs[shelf]} />)
                        }
                    </div>
                </div>
                <div className="open-search">
                    <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
                </div>
            </div>
        )
    }
}

export default MainPage;