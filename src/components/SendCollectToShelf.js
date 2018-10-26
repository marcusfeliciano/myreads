import React, { Component } from 'react';
import { Icon, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import * as BooksService from '../services/BooksService';


class SendCollectToShelf extends Component {
    state = {
        value : ''
    }

    onChange = (e, { value }) => {
        this.setState(() => ({
            value:value
        }));
        this.props.onSelectShelf(value);
    }
    render() {
        const { selectedBooks } = this.props;
        return (
            <React.Fragment>
                <div className="item eight wide column">
                    <h3>{`Total of selected books ${selectedBooks.length}`}</h3>
                </div>
                <div className="item five wide column">
                    Send to
                    <Dropdown placeholder='Move to...'
                        options={BooksService.SHELF_LIST}
                        value={this.state.value} 
                        onChange={this.onChange} />
                </div>
            </React.Fragment>
        );
    }
}

export default SendCollectToShelf;