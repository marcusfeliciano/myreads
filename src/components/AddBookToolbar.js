import React, { Component } from 'react';
import { Input, Select } from 'semantic-ui-react';
import Toolbar from './Toolbar';

import * as BooksService from '../services/BooksService';
import PropTypes from 'prop-types';

class AddBookToolbar extends Component {
    static propTypes = {
        inExecuteTask: PropTypes.bool,
        onSearch: PropTypes.func,
        selectedBooks: PropTypes.array
    }

    intervalId = null;

    state = {
        search: ''
    }

    get selectPlaceholder() {
        return `Total of selected books ${this.props.selectedBooks.length}. Send to...`;
    }

    get search() {
        return this.state.search;
    }
    /**
     * clear search and return to main page
     */
    returnLink = (event, history) => {
        event.preventDefault();
        this.props.onSearch('');
        history.push('/');
    }

    onChangeText = (event) => {

        const { value } = event.target;
        this.setState(() => ({ search: value }), () => {
            const { search } = this.state;
            if (search.trim().length < 3) {
                this.props.onSearch('');
                return;
            }
            if (this.intervalId !== null) {
                clearInterval(this.intervalId);
                this.intervalId = null;
            }
            this.intervalId = setTimeout(() => {
                this.props.onSearch(search.trim());
            }, 800)

        });
    }

    render() {
        const { inExecuteTask, selectedBooks } = this.props;
        return (
            <Toolbar onIconClick={this.returnLink} icon='angle left' inExecuteTask={inExecuteTask} >                
                {(selectedBooks.length === 0 && (
                    <Input                        
                        fluid
                        value={this.search}
                        onChange={this.onChangeText}
                        placeholder="Search by title or author" />
                ))}
                {(selectedBooks.length !== 0 && (                                    
                        <Select placeholder={this.selectPlaceholder}
                            fluid
                            closeOnChange
                            options={BooksService.SHELF_LIST}
                            value={this.state.value}
                            onChange={this.props.sendCollectionToShelf} />
                ))}
            </Toolbar>
        );
    }
}

export default AddBookToolbar;