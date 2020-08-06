import React, { Component } from 'react'
import logic from '../../logic'
import './Follow.sass'

class Follow extends Component {
    state = { user: null, followers: [], followings: [] }

    componentDidMount() {

        Promise.all([logic.listFollowers(), logic.listFollowings(), logic.retrieveUser()])
       .then(([followers, followings, user])=>this.setState({user, followings, followers}))
    }
    // TODO error handling!


    render() {
        return this.state.user && <div className="div__follow">
            <div className='container__user'>
                <div className='user__profile'>
                    <h2>{this.state.user.username}</h2>
                    <p>{this.state.user.followers} followers · {this.state.user.following} following</p>
                </div>
                <img className='user__photo' src={this.state.user.img}></img>
            </div>
            <div className='container__follow' >
                <div className='followers-profile'>
                    <ul>
                        {this.state.followings.map(user => <li onClick={()=>this.props.onHandleOtherProfile(user.username)} ><img src={user.img} ></img>{user.username}</li>)}
                    </ul>
                </div>
                <div>
                    <ul>
                        {this.state.followers.map(user => <li onClick={()=>this.props.onHandleOtherProfile(user.username)} ><img src={user.img} ></img>{user.username}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    }
}

export default Follow