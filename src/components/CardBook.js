import React, { Component } from 'react';
import { Card, Image, Checkbox, Grid, Dimmer, Loader } from 'semantic-ui-react';
import BookShelfChooser from './BookShelfChooser';
import PubSub from 'pubsub-js';
import { AppChanels, AppEvents } from '../App';

class CardBook extends Component {
    subscriberToken = null;    
    state = {
        loading: false,
        hasBookSelected: false
    }

    componentDidMount() {
        this.subscriberToken = PubSub.subscribe(AppChanels.BOOK_CHANEL, this.subscriber);
    }

    componentWillUnmount() {
        PubSub.unsubscribe(this.subscriberToken);
    }

    subscriber = (chanel, event) => {
        const isCurrentBook = this.props.book.id === event.bundle.book.id;
        
        if (!isCurrentBook) {
            //return false;
        }
        const stateFromEventType = {
            [AppEvents.BOOK_ADDING] : { loading: true },
            [AppEvents.BOOK_ADDED] : { loading: false },
            [AppEvents.BOOK_SELECTED] : { hasBookSelected: true },
            [AppEvents.BOOK_UNSELECTED] : { hasBookSelected: false },
        };        
        this.setState(() => (stateFromEventType[event.type]));
    }

    selectBook = (event, { checked }) => {
        PubSub.publish(AppChanels.BOOK_CHANEL, {
            type: checked ? AppEvents.BOOK_SELECTED : AppEvents.BOOK_UNSELECTED,
            bundle: { book: this.book }
        })
    }

    get book() {        
        return this.props.book;
    }

    get formatedTitle() {
        return `${this.book.title} - ${this.book.subtitle}`;
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
                                <Checkbox label='Choose to send...' onChange={this.selectBook} />
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