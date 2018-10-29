import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

const IconToolbar = (props) => {
    return (
        <Link to={props.toLink} className="item three wide column">
            <Icon name={props.icon} size='big' />
            MyReads
        </Link>
    )
}

export default IconToolbar;