import React, { Component } from 'react'
import logic from '../../logic'
import Comment from './Comment'


class Comments extends Component {
    state = { comments: this.props.comments, comment: '', commentsLimit: this.props.comments.length < 2 ? this.props.comments.length : 2 }

    componentDidMount() {
        this.retrieveComments(this.props.pinId)

        // TODO error handling!

    }

    componentWillReceiveProps(props) {
        this.retrieveComments(props.pinId)

        
        // TODO error handling!
    }

    retrieveComments(pinId) {
        logic.retrieveComments(pinId)
            .then(comments => this.setState({ comments, comment: '', commentsLimit: this.props.comments.length < 2 ? this.props.comments.length : 2 }))
    }

    handleCommentChange = event => {
        const comment = event.target.value

        this.setState({ comment })
    }

    handleKeyDown = event => {

        if (event.keyCode == 13 && event.shiftKey == false) {
            this.handleSubmit(event)
        }
    }

    handleSubmit = event => {
        event.preventDefault()
        this.props.onAddComment(this.state.comment)
    }

    getComments = () => {
        let comments = []

        for (let i = 0; i < this.state.commentsLimit; i++) {
            comments.push(<Comment key={this.state.comments[i].id} id={this.state.comments[i].id} comment={this.state.comments[i]} pinId={this.props.pinId} onLike={this.props.onLike} />)
        }

        return comments
    }

    showMoreComments = () => {
        if((this.state.comments.length-this.state.commentsLimit) < 2) this.setState({commentsLimit: this.state.commentsLimit+1})
        else this.setState({commentsLimit: this.state.commentsLimit+2})
    }


    render() {
        return <section className="comment__container">
            {!this.state.comments && <p>Share feedback, ask a question or give a high five</p>}
            {this.getComments()}
            {this.state.comments.length > 2 && this.state.comments.length-this.state.commentsLimit > 0 && <div>
                <p onClick={this.showMoreComments} >{this.state.comments.length-this.state.commentsLimit} comments</p>
            </div>}
            <form>
                <textarea placeholder="Add coment" onChange={this.handleCommentChange} onKeyDown={this.handleKeyDown} value={this.state.comment} />
            </form>
        </section>

    }
}

export default Comments