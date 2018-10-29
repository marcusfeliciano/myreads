import React, { Component } from 'react';

import { Dimmer, Loader, Select } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import IconToolbar from './toolbar/IconToolbar';

class MyShelfsToolbar extends Component {
    static propTypes = {
        selectedBooks: PropTypes.array,
        listToShelf:  PropTypes.array,
        sendCollectionToShelf: PropTypes.func,
        inExecuteTask: PropTypes.bool
    }

    state = {
        toShelfValue: ''
    }
    render() {
        return (
            <div className="ui menu fixed inverted">
                <div className="ui three column stackable grid container" style={{ margin: 0 }}>
                    <IconToolbar 
                        toLink='/'
                        icon='book' />
                    
                    {(this.props.selectedBooks.length && (
                        <React.Fragment>
                            <div className="item eight wide column">
                                <h3>{`Total of selected books ${this.props.selectedBooks.length}`}</h3>
                            </div>
                            <div className="item five wide column">                                
                                <Select placeholder='Move to...'
                                    options={this.props.listToShelf}
                                    value={this.state.toShelfValue}
                                    onChange={this.props.sendCollectionToShelf} />
                            </div>
                        </React.Fragment>
                    ))}
                    {(!this.props.selectedBooks.length && (
                        <div className='item ten column right'>
                            <Dimmer active={this.props.inExecuteTask}>
                                <Loader />
                            </Dimmer>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default MyShelfsToolbar;