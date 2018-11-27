import React, { Component } from 'react'
import logic from '../../logic'
import Navbar from '../Navbar/Navbar'
import Board from './Board'
import Pin from './Pin'
import './Profile.css'

class Profile extends Component {
    state = { user: '', pins: [], boards: [], tries: [], boardsSel: true, pinsSel: false, triesSel: false }

    componentDidMount() {
        Promise.all([logic.retrieveUser(),logic.listBoards(),logic.listUserPins()])
            .then(([user, boards, pins]) => {
                this.setState({ user, boards, pins })
            })

        // TODO error handling!

    }

    handleBoards = () => this.setState({ boardsSel: true, pinsSel: false, triesSel: false })

    handlePins = () => this.setState({ boardsSel: false, pinsSel: true, triesSel: false })

    handleTries = () => this.setState({ boardsSel: false, pinsSel: false, triesSel: true })




    render() {
        return <div className="div__profile">
            <Navbar onHome={this.props.onHome} onLogout={this.props.onLogout} />
            <div className='container__user'>
                <div className='user__profile'>
                    <h2>{this.state.user.username}</h2>
                    <p>{this.state.user.followers} followers · {this.state.user.following} following</p>
                </div>
                <img className='user__photo' src={this.state.user.img}></img>
            </div>
            <div className='navProfile'>
                <div className={this.state.boardsSel ? 'nav-title check' : 'nav-title'}>
                    <a onClick={this.handleBoards} >Boards</a>
                </div>
                <div className={this.state.pinsSel ? 'nav-title check' : 'nav-title'}>
                    <a onClick={this.handlePins} >Pins</a>
                </div>
                <div className={this.state.triesSel ? 'nav-title check' : 'nav-title'}>
                    <a onClick={this.handleTries} >Tries</a>
                </div>
            </div>
            {this.state.boardsSel && <section className="container__user-boards">
                {this.state.boards.map(board => <Board key={board.id} id={board.id} board={board} />)}
            </section>}
            <section className="pins__container">
                {this.state.pins.map(pin => <Pin key={pin.id} id={pin.id} pin={pin} />)}
            </section>
            {/* <section className="container__user-tries">
                {this.state.tries.map(tries => <Tries key={tries.id} id={tries.id} tries={tries} />)}
            </section> */}
        </div>
    }
}

export default Profile
