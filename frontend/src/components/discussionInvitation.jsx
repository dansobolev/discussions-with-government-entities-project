import { Component } from 'react';
import highlightText from '../utils';

class DiscussionInvitation extends Component {
    state = {
        inviter: '@oleg',
        participant: '@egor',
    }

    render() {
        return (
            <div>
                <div className="mt-4 mb-4 cont p-2 text-center">
                    {highlightText(this.state.inviter)} добавил {highlightText(this.state.participant)}
                </div>
            </div>
        )
    }
}

export default DiscussionInvitation;
