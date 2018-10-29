import React, { Component } from 'react';

import { Input, Dimmer, Loader, Select } from 'semantic-ui-react';
import IconToolbar from './toolbar/IconToolbar';
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

    get search() {
        return this.state.search;
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
        const {inExecuteTask} = this.props;
        return (
            <div className="ui menu fixed inverted">
                <div className="ui three column stackable grid container" style={{ margin: 0 }}>
                    <IconToolbar 
                        toLink='/'
                        icon='angle left' />
                    {(this.props.selectedBooks.length && (
                        <React.Fragment>
                            <div className="item eight wide column">
                                <h3>{`Total of selected books ${this.props.selectedBooks.length}`}</h3>
                            </div>
                            <div className="item five wide column">                                
                                <Select placeholder='Send to...'
                                    options={BooksService.SHELF_LIST}
                                    value={this.state.value}
                                    onChange={this.props.sendCollectionToShelf} />
                            </div>
                        </React.Fragment>
                    ))}
                    {(!this.props.selectedBooks.length && (
                        <React.Fragment>
                            <div className="item nine wide column">
                                <Input
                                    size='big'
                                    loading={inExecuteTask}
                                    value={this.search}
                                    onChange={this.onChangeText}
                                    placeholder="Search by title or author" />
                            </div>
                            <div className="item three wide column">
                                <Dimmer active={inExecuteTask}>
                                    <Loader  />
                                </Dimmer>
                            </div>
                        </React.Fragment>
                    ))}                    
                </div>

            </div>
        );
    }
}

export default AddBookToolbar;