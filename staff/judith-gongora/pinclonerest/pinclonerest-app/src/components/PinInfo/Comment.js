import React, { Component } from 'react'
import logic from '../../logic'
import './PinInfo.sass'


class Comment extends Component {
    state = { comment: this.props.comment, user: null, liked: false }

    componentDidMount() {
        this.retrieveComment(this.props.comment, this.props.pinId)
        // TODO error handling!
    }

    componentWillReceiveProps(props) {
        this.setState({comment: props.comment})
        this.retrieveComment(props.comment, props.pinId)
    }

    retrieveComment (comment, pinId){
        Promise.all([logic.retrieveUserComment(pinId, comment.id), logic.isLiked(comment)])
        .then(([user, liked]) => this.setState({ user, liked }))
        
    }

    handleCommentChange = event => {
        const comment = event.target.value
        this.setState({ comment })
    }

    handleLike = () => this.props.onLike(this.state.comment.id)


    render() {
        return this.state.user && <section className="comment__container">
            <div className='user__info-comment'>
                <img src={this.state.user.img}></img>
                <span>{this.state.user.username}</span>
            </div>
            <div className='comment__content'>
                <div>{this.state.comment.content}</div>
                <div className='comment__like'>
                <span className={this.state.liked ? 'liked' : 'like'} onClick={this.handleLike}>{this.state.liked ? 'Liked  ' : 'Like'}</span>
                {this.state.comment.likes.length> 0 && <span className='likes' >{this.state.comment.likes.length} likes</span>}
                </div>
            </div>



        </section>

    }
}

export default Comment