import { Component } from 'react';
import highlightText from '../utils';

class DiscussionInvitation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inviter: props.data.inviter,
            participant: props.data.participant,
        }
    }

    render() {
        return (
            <div>
                <div className="mt-4 mb-4 cont p-2 text-center">
                    {highlightText(this.state.inviter.login)} добавил {highlightText(this.state.participant.login)}
                </div>
            </div>
        )
    }
}

export default DiscussionInvitation;
