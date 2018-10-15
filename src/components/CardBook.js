import React, { Component } from 'react';
import { Card, Image, Checkbox, Grid, Dimmer, Loader } from 'semantic-ui-react';
import BookShelfChooser from './BookShelfChooser';
import PubSub from 'pubsub-js';
import { AppChanels, AppEvents } from '../App';

class CardBook extends Component {
    subscribe = null;
    subscribeBookSelection = null;
    state = {
        loading: false,
        hasBookSelected:false
    }

    subscriber = (chanel, event) => {
        const isCurrentBook = this.props.book.id === event.bundle.book.id;
        var state = null;
        if (!isCurrentBook) {
            //return false;
        }
        switch(event.type) {
            case AppEvents.BOOK_ADDING:
                state = { loading: true };
            break;
            case AppEvents.BOOK_ADDED:
                state = { loading: false };
            break;
            case AppEvents.BOOK_SELECTED:
                state = { hasBookSelected: true };
            break;
            case AppEvents.BOOK_UNSELECTED:
                state = { hasBookSelected: false };
            break;
        }
        this.setState(() => (state));

        
    }

    componentDidMount() {
        this.subscribe = PubSub.subscribe(AppChanels.BOOK_CHANEL, this.subscriber);
        this.subscribeBookSelection = PubSub.subscribe(AppChanels.BOOK_SELECTION, (chanel, event) => {
            console.log(event);
            this.setState(() => ({
                hasBookSelected:event.type === AppEvents.BOOK_SELECTED ? true : false
            }));
        });
    }
    componentWillUnmount() {
        PubSub.unsubscribe(this.subscribe);
        PubSub.unsubscribe(this.subscribeBookSelection);
    }

    get book() {
        const { book } = this.props;
        return book;
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
            return ' no information found ';
        }
        return description.length > 150
            ? `${description.substr(0, 150)}...`
            : description
    }

    setLoading = (loading) => {
        this.setState(() => ({ loading: loading }));
    }

    selectBook = (event, {checked}) => {
        console.log(checked)
        PubSub.publish(AppChanels.BOOK_CHANEL, {
            type:checked?AppEvents.BOOK_SELECTED:AppEvents.BOOK_UNSELECTED,
            bundle:{book:this.book}
        })
    }

    render() {
        const { onAddToShelf } = this.props;

        return (
            <Card>
                <Dimmer active={this.state.loading}>
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
                                {!this.state.hasBookSelected && (<BookShelfChooser book={this.book} />)}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Content>
            </Card>
        );
    }
}

export default CardBook;