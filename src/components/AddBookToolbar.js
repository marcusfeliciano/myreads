import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, Dimmer, Loader,  Icon, Dropdown } from 'semantic-ui-react';
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
        return (
            <div className="ui menu fixed inverted">
                <div className="ui three column stackable grid container" style={{ margin: 0 }}>
                    <Link to='/' className="item three wide column">
                        <Icon name='book' size='big' />
                        MyReads
                    </Link>
                    {(!this.props.selectedBooks.length && (
                        <React.Fragment>
                            <div className="item nine wide column">
                                <Input
                                    size='big'
                                    loading={this.props.inExecuteTask}
                                    value={this.search}
                                    onChange={this.onChangeText}
                                    placeholder="Search by title or author" />
                            </div>
                            <div className="item three wide column">
                                <Dimmer active={this.inExecuteTask}>
                                    <Loader  />
                                </Dimmer>
                            </div>
                        </React.Fragment>
                    ))}
                    {(this.props.selectedBooks.length && (
                        <React.Fragment>
                            <div className="item eight wide column">
                                <h3>{`Total of selected books ${this.props.selectedBooks.length}`}</h3>
                            </div>
                            <div className="item five wide column">
                                Send to
                                <Dropdown placeholder='Move to...'
                                    options={BooksService.SHELF_LIST}
                                    value={this.state.value}
                                    onChange={this.onChange} />
                            </div>
                        </React.Fragment>
                    ))}
                </div>

            </div>
        );
    }
}

export default AddBookToolbar;