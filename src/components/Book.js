import React, { Component } from 'react';
import { Card, Image, Button, Grid, Segment, Dimmer, Loader } from 'semantic-ui-react';
import BookShelfAdd from './BookShelfAdd';
import PubSub from 'pubsub-js';
import { AppChanels, AppEvents } from '../App';

class Book extends Component {
    subscribe = null;
    state = {
        loading: false
    }

    subscriber = (chanel, event) => {
        const isCurrentBook = this.props.book.id === event.book.id;

        if (!isCurrentBook) {
            return false;
        }

        if (event.type === AppEvents.BOOK_ADDING) {
            this.setState(() => ({ loading: true }));
        } else {
            this.setState(() => ({ loading: false }));
        }
    }

    componentDidMount() {
        this.subscribe = PubSub.subscribe(AppChanels.BOOK_CHANEL, this.subscriber);
    }
    componentWillUnmount() {
        PubSub.unsubscribe(this.subscribe);
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

    render() {
        const { onAddToShelf } = this.props;

        return (
            <li>


                <Card >
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
                                    <Button size='mini' primary fluid content='Details' />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <BookShelfAdd book={this.book} onAddToShelf={onAddToShelf} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Card.Content>
                </Card>


            </li>
        );
    }
}

export default Book;