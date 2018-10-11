import React, { Component } from 'react';

class BookShelfChanger extends Component {
    state = {
        value:''
    }
    onChange = (event) => {
        const value = event.target.value;
        this.setState(()=>({
            value : value
        }))
        
        this.props.onShelfChange(this.props.book, value);
    }
    render() {
        return (
            <div className="book-shelf-changer">
                <select onChange={this.onChange} value={this.state.value}>
                    <option value="move" disabled>Move to...</option>
                    <option value="currentlyReading">Currently Reading</option>
                    <option value="wantToRead">Want to Read</option>
                    <option value="read">Read</option>
                    <option value="none">None</option>
                </select>
            </div>
        )
    }
}

export default BookShelfChanger;