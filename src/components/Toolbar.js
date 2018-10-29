import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, Dimmer, Loader,  Icon, Select } from 'semantic-ui-react';


import PropTypes from 'prop-types';

class Toolbar extends Component {
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
        const { selectedBooks, shelfOptions, icon, inExecuteTask, sendCollectionToShelf, toLink } = this.props;
        return (
            <div className="ui menu fixed inverted">
                <div className="ui three column stackable grid container" style={{ margin: 0 }}>
                    <Link to={toLink} className="item three wide column">
                        <Icon name={icon} size='big' />
                        MyReads
                    </Link>
                    {(this.props.selectedBooks.length && (
                        <React.Fragment>
                            <div className="item eight wide column">
                                <h3>{`Total of selected books ${selectedBooks.length}`}</h3>
                            </div>
                            <div className="item five wide column">                                
                                <Select placeholder='Send to...'
                                    options={shelfOptions}
                                    value={this.state.value}
                                    onChange={sendCollectionToShelf} />
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

export default Toolbar;