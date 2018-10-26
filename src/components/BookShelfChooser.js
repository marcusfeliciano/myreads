import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react';
import PubSub from 'pubsub-js';
import { AppChanels, AppEvents } from '../App';

const values = [
    //{'key':'move', 'value': 'Move to...', 'text': 'Move to...'},
    {'key':'currentlyReading', 'value': 'currentlyReading', 'text': 'Currently Reading'},
    {'key':'wantToRead', 'value': 'wantToRead', 'text': 'Want to Read'},
    {'key':'read', 'value': 'read', 'text': 'Read'}
];
class BookShelfChooser extends Component {
    bookChanelToken = null
    state = {
        value:''
    }
    componentDidMount = () => {
        const { book } = this.props;
        if(book && book.hasOwnProperty('shelf')){
            this.setState(() => ({
                value:book.shelf
            })) 
        }
        this.bookChanelToken = PubSub.subscribe(AppChanels.BOOK_CHANEL, this.subscribeBookChanel)
    }

    componentWillUnmount = () => {
        PubSub.unsubscribe(this.bookChanelToken);
    }

    subscribeBookChanel = (chanel, event) => {
        if(event.type !== AppEvents.BOOK_ADDED){
            return;
        }
        this.setState(()=>({value:''}));
    }

    getEventBundle = ( shelf ) => {
        const { book } = this.props;
        return  {
            type: AppEvents.SHELF_CHOOSED, 
            bundle: { shelf, book }
        };
    }

    onChange = (e, { value }) => {
        this.setState(()=>({
            value : value
        }))
        
        PubSub.publish(AppChanels.SHELF_CHANEL, this.getEventBundle(value));
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

export default BookShelfChooser;