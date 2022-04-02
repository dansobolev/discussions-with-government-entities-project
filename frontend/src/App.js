import React, { Component } from 'react';
import NavBar from './components/navbar';
import DiscussionName from "./components/discussionName";
import DiscussionMessage from './components/discussionMessage';
import DiscussionInvitation from './components/discussionInvitation';

class App extends Component {
    state = {
        discussionName: 'Тестовая переписка'
    }

    render () {
        return (
            <React.Fragment>
                <NavBar />
                <DiscussionName discussionName={this.state.discussionName} />
                <DiscussionMessage />
                <DiscussionInvitation />
                <DiscussionMessage />
                <DiscussionMessage />
            </React.Fragment>
        )
    }
}

export default App;
