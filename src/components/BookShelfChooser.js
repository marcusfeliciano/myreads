import React, { Component } from 'react';
import { Dropdown, Select } from 'semantic-ui-react';
import PubSub from 'pubsub-js';
import { AppChanels, AppEvents, SHELFS } from '../App';
import PropTypes from 'prop-types';


class BookShelfChooser extends Component {
    
    static propTypes = {
        book: PropTypes.object
    }

    bookChanelToken = null
    state = {
        value:''
    }
    componentDidMount = () => {
        const { book } = this.props;
        const shelf = book && book.hasOwnProperty('shelf') 
        ? book.shelf
        : 'none';
        this.setState(() => ({value:shelf})) 
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

        this.setState((prev)=>({
            value : value
        }))
        if(value !== this.state.value){
            PubSub.publish(AppChanels.SHELF_CHANEL, this.getEventBundle(value));
        }
    }
    
    render() {
        return (
            <div>
                <Select placeholder='Move to...' 
                    fluid 
                    options={SHELFS}
                    value={this.state.value} 
                    onChange={this.onChange} />
            </div>
        )
    }
}

export default BookShelfChooser;