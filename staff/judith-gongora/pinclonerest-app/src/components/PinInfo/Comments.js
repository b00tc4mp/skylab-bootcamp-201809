import React, { Component } from 'react'
import logic from '../../logic'


class Comments extends Component {
    state = { comments: this.props.comments, comment:''}

    componentDidMount() {
        logic.retrieveComments(this.props.pinId)
            .then(comments => this.setState({ comments }))
        // TODO error handling!

    }

    handleCommentChange = event => {
        const comment = event.target.value

        this.setState({ comment })
    }

    handleKeyDown = event => {

        if(event.keyCode == 13 && event.shiftKey == false) {
            this.handleSubmit(event)
        }

    }

    handleSubmit = event => {
        
        event.preventDefault()
        this.props.onAddComment(this.state.comment)

    }


    render() {
        return <section className="comment__container">
                {!this.state.comments && <p>Share feedback, ask a question or give a high five</p>}
                {/* {this.state.comments.map(comment => ) */}
                <form>
                <textarea placeholder="Add coment" onChange={this.handleCommentChange} onKeyDown={this.handleKeyDown} />
                </form>
            </section>
     
    }
}

export default Comments