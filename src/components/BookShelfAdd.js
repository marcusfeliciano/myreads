import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';

const values = [
    //{'key':'move', 'value': 'Move to...', 'text': 'Move to...'},
    {'key':'currentlyReading', 'value': 'currentlyReading', 'text': 'Currently Reading'},
    {'key':'wantToRead', 'value': 'wantToRead', 'text': 'Want to Read'},
    {'key':'read', 'value': 'read', 'text': 'Read'}
];
class BookShelfAdd extends Component {
    state = {
        value:''
    }
    componentDidMount = () => {
        const { book } = this.props;
        if(book.hasOwnProperty('shelf')){
            this.setState(() => ({
                value:book.shelf
            })) 
        }
    }
    onChange = (e, { value }) => {
        
        console.log(value);
        this.setState(()=>({
            value : value
        }))
        
        this.props.onAddToShelf(this.props.book, value);
    }
    render() {
        return (
            <div>
                <Dropdown placeholder='Move to...' 
                    fluid 
                    options={values}
                    value={this.state.value} 
                    onChange={this.onChange} />
            </div>
        )
    }
}

export default BookShelfAdd;