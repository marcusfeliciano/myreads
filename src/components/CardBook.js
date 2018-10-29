import React, { Component } from 'react';
import { Card, Image, Checkbox, Grid, Dimmer, Loader } from 'semantic-ui-react';
import BookShelfChooser from './BookShelfChooser';
import PubSub from 'pubsub-js';
import { AppChanels, AppEvents, SHELFS } from '../App';
import PropTypes from 'prop-types';

class CardBook extends Component {

    static propTypes = {
        book: PropTypes.object
    }
    
    bookChanelToken = null;
    bookCollectChanelToken = null;

    
    state = {
        loading: false,
        hasBookSelected: false,
        checked: false
    }

    componentDidMount() {
        this.bookChanelToken = PubSub.subscribe(AppChanels.BOOK_CHANEL, this.subscriber);
        this.bookCollectChanelToken = PubSub.subscribe(AppChanels.BOOK_COLLECT_CHANEL, (chanel, event) => {
            const hasBookSelected = event.bundle.selectedBooks.length > 0;            
            this.setState(() => ({hasBookSelected:hasBookSelected}));
        });
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.bookChanelToken);
        PubSub.unsubscribe(this.bookCollectChanelToken);
        this.publish(false);
    }

    subscribeBookChanel = (chanel, event) => {
        if(event.type !== AppEvents.BOOK_ADDED){
            return;
        }
        this.setState(()=>({checked:false}));
    }

    subscriber = (chanel, event) => {
        if(event.type !== AppEvents.BOOK_ADDED){
            return false;
        }
        this.setState(() => ({ loading: false, defaultChecked: false }));
    }

    selectBook = (event, { checked }) => {
        
        this.setState(()=>({checked:checked}));
        this.publish(checked);
    }

    publish = (checked) => {
        PubSub.publish(AppChanels.BOOK_CHANEL, {
            type: checked ? AppEvents.BOOK_SELECTED : AppEvents.BOOK_UNSELECTED,
            bundle: { book: this.book }
        })
    }

    get book() {        
        return this.props.book;
    }

    get formatedTitle() {
        const title = this.book.title || 'no title';
        const subtitle = this.book.subtitle ? 
            ` - ${this.book.subtitle}`
            : '';
        return `${title}${subtitle}`;
    }

    get bookAuthors() {
        return this.book.hasOwnProperty('authors')
            ? this.book.authors.join(', ')
            : ' - ';
    }
    get image() {
        return this.book.imageLinks.thumbnail;
    }
    get description() {
        const { description } = this.book;
        if (!description) {
            return 'information not found';
        }
        return description.length > 150
            ? `${description.substr(0, 150)}...`
            : description
    }
    get formatedShelf() {        
        return SHELFS.filter(shelf=> shelf.key === this.book.shelf)[0].text
    }
    get hasBookSelected() {
        return this.state.hasBookSelected;
    }
    get loading(){
        return this.state.loading;
    }    

    render() {
        return (
            <Card>
                <Dimmer active={this.loading}>
                    <Loader />
                </Dimmer>
                <Card.Content>
                    <Image floated='left' rounded src={this.image} style={{ width: 128, height: 193 }} />
                    <Card.Header style={{ fontSize: 14 }}>{this.formatedTitle}</Card.Header>
                    <Card.Meta>{this.bookAuthors}</Card.Meta>
                    <span className="ui olive label mini">{this.formatedShelf}</span>
                </Card.Content>
                <Card.Content extra>                    
                    <Grid columns='1'>
                        <Grid.Row>
                            <Grid.Column>
                                {this.description}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Checkbox label='Choose to send...' 
                                    checked={this.state.checked} onChange={this.selectBook} />
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                {!this.hasBookSelected && (<BookShelfChooser book={this.book} />)}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Content>
            </Card>
        );
    }
}

export default CardBook;