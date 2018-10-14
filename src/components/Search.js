import React, { Component } from 'react';

class Search extends Component {
    
    state = {
        search:''
    }
    

    get search() {
        return this.state.search;
    }
    
    onChange = (event) => {

        const { value } = event.target;
        this.setState(()=> ({ search: value }), () => {
            const{ search } = this.state;
            if(search.trim().length < 3){
                return;
            }
            this.props.onSearch(search.trim());
        });
    }

    render() {
        return (
            <div className="search-books-input-wrapper">
                <input type="text" value={this.search} onChange={this.onChange} placeholder="Search by title or author" />
            </div>
        );
    }
}

export default Search;