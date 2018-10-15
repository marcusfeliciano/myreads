import React, { Component } from 'react';

class Search extends Component {
    
    state = {
        search:''
    }

    intervalId = null

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
            if(this.intervalId !== null ){
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
            <div className="search-books-input-wrapper">
                <input type="text" value={this.search} onChange={this.onChange} placeholder="Search by title or author" />
            </div>
        );
    }
}

export default Search;