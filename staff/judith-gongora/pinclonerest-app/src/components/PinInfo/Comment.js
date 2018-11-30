import React, { Component } from 'react'
import logic from '../../logic'
import './PinInfo.sass'


class Comment extends Component {
    state = { comment: this.props.comment, user: null }

    componentDidMount() {
        logic.retrieveUserComment(this.props.pinId, this.props.comment.id)
            .then(user => this.setState({ user }))
        // TODO error handling!

    }

    handleCommentChange = event => {
        const comment = event.target.value
        this.setState({ comment })
    }

    render() {
        return this.state.user && <section className="comment__container">
            <div className='user__info-comment' >
                <img src={this.state.user.img}></img>
                <span>{this.state.user.username}</span>
            </div>
            <div className='comment__content'>
                <div>{this.state.comment.content}</div>
                <div className='comment__like'>Like</div>
            </div>



        </section>

    }
}

export default Comment