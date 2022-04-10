import { Component } from 'react';
import doc_logo from '../images/document_icon.svg';
import highlightText from '../utils';


function Image({ fileName }) {
    return <img className="p-1" src={fileName} width="45" height="45"/>;
}

class DiscussionMessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: props.data.author.login,
            commentText: props.data.comment_text,
            commentDate: props.data.created_at,
            commentImages: [],
        }
    }

    componentDidMount() {
        const pic_url = 'https://picsum.photos/25/25';
        const pic_array = Array(getRandomInt(3)).fill(pic_url);
        this.setState({ commentImages: pic_array })
    }

    render () {
        const mainBlockStyles = {
            border: "1px solid #cecece",
            borderRadius: "10px",
        }

        return (
            <div>
                <div className="mt-4 mb-4 cont p-3" style={mainBlockStyles}>
                    <div className="discussion-user-name">
                        <a className="text-decoration-none" href="#">{this.state.userName}</a>
                    </div>
                    <div className="cont-inside">
                        {highlightText(this.state.commentText)}
                    </div>
                    <div className="d-flex justify-content-between cont-inside">
                        <div className="d-flex">
                            <div>
                                <img src={doc_logo} width="45" height="45" alt="" />
                            </div>
                            <div style={{maxWidth: '70px'}}>
                                <a className="link-secondary" href="#" style={{fontSize: 'small'}}>
                                    Оригинал документа
                                </a>
                            </div>
                            <div>
                                {this.state.commentImages.map((el) => {
                                    return <Image fileName={el} />;
                                })}
                            </div>
                        </div>
                        <div style={{paddingTop: '4%'}}>
                            <div>
                                {this.state.commentDate}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DiscussionMessage;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
