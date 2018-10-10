import React, { Component } from 'react';

class BookCollection extends Component {

    render() {
        const { collectionTitle } = this.props;

        return (
            <div className="list-books-content">
                <div>
                    <div className="bookshelf">
                        <h2 className="bookshelf-title">{ collectionTitle }</h2>
                    </div>
                </div>
            </div>
        );
    }
}

export default BookCollection;