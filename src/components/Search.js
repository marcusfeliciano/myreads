import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Input } from 'semantic-ui-react';
class Search extends Component {

    state = {
        search: ''
    }

    intervalId = null

    get search() {
        return this.state.search;
    }

    onChange = (event) => {

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
            <div className="ui three column stackable grid container" style={{ margin: 0 }}>
                <Link to='/' className="item three wide column">
                    <Icon name='book' size='big' />
                    MyReads
                </Link>
                <div className="item ten wide column">
                    <Input
                        size='big'
                        loading={this.props.loading}
                        value={this.search}
                        onChange={this.onChange}
                        placeholder="Search by title or author" />

                </div>
            </div>
        );
    }
}

export default Search;