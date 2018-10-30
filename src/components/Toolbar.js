import React from 'react';
import { withRouter } from 'react-router-dom';
import { Dimmer, Loader, Icon } from 'semantic-ui-react';

import PropTypes from 'prop-types';

const Toolbar = (props) => {
    const { icon, inExecuteTask, onIconClick, children, history } = props;
    return (
        <div className="ui menu fixed inverted">
            <div className="ui three column stackable doubling grid container" style={{ margin: 0 }}>
                <button onClick={ (event) => onIconClick(event, history) } className="item three wide column link-button">
                    <Icon name={icon} size='big' />
                    MyReads
                </button>
                <div className="column eleven wide">
                    {children}
                </div>
                <div className='column two wide'>
                    <Dimmer active={inExecuteTask}>
                        <Loader />
                    </Dimmer>
                </div>
            </div>
        </div>
    );    
}
Toolbar.propTypes = {
    inExecuteTask: PropTypes.bool.isRequired,    
    icon: PropTypes.string.isRequired,
    onIconClick: PropTypes.func.isRequired
}
export default withRouter(Toolbar);