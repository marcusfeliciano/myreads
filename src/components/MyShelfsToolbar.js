import React, { Component } from 'react';
import { Select } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Toolbar from './Toolbar';

class MyShelfsToolbar extends Component {
    static propTypes = {
        selectedBooks: PropTypes.array,
        listToShelf: PropTypes.array,
        sendCollectionToShelf: PropTypes.func,
        inExecuteTask: PropTypes.bool
    }

    state = {
        toShelfValue: ''
    }

    get selectPlaceholder() {
        return `Total of selected books ${this.props.selectedBooks.length}. Send to...`;
    }
    sendCollectionToShelf = (e, {value}) => {
        this.setState(() => ({
            toShelfValue: value
        }), () => {
            this.props.sendCollectionToShelf(this.props.selectedBooks, value);
        });
        
    }

    render() {
        return (
            <Toolbar onIconClick={(e)=>{e.preventDefault()}} icon='book' inExecuteTask={this.props.inExecuteTask}>
                {(this.props.selectedBooks.length && (
                    <Select placeholder={this.selectPlaceholder}
                        fluid                        
                        closeOnChange
                        options={this.props.listToShelf}
                        value={this.state.toShelfValue}
                        onChange={this.sendCollectionToShelf} />                    
                ))}
            </Toolbar>
        );
    }
}

export default MyShelfsToolbar;