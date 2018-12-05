import React, { Component } from 'react'
import Merge from './Merge'
import logic from '../../logic'
import './Profile.sass'


class EditBoard extends Component {
    state = { board: this.props.board, title: this.props.board.title, description: this.props.board.description, category: this.props.board.category, secret: this.props.board.secret, merge: false }

    handleTitleChange = event => {
        const title = event.target.value
        this.setState({ title })
    }

    handleDescriptionChange = event => {
        const description = event.target.value
        this.setState({ description })
    }

    handleCategoryChange = event => {
        const category = event.target.value
        this.setState({ category })
    }

    handleCheckChange = () => {
        if (this.state.secret === false) this.setState({ secret: true })
        else this.setState({ secret: false })
    }

    handleOpenMerge = () => {
        this.setState({ merge: true })
    }

    handleMerge = () => {
        this.setState({ merge: true })

    }

    handleCloseMerge = () => {
        this.setState({ merge: false })

    }

    handleMergeBoards = board => {
        logic.mergeBoards(this.props.board.id, board)
            .then(() => this.props.onHandleCloseMerge())
    }

    handleDelete = () => {
        this.props.onDeleteBoard(this.props.board.id)
    }

    handleEditBoard = () => {
        this.props.onEditBoard(this.props.board.id, this.state.title, this.state.secret, this.state.description, this.state.category)
    }

    render() {
        return <section className="popup__editBoard">
            {this.state.merge && <Merge onCloseMerge={this.handleCloseMerge} onHandleMergeBoards={this.handleMergeBoards} boardId={this.props.board.id} />}
            <div className='container__editBoard'>
                <div className='editBoard__head'>
                    <div className='editBoard__title'><h2>Edit your Board</h2></div>
                    <div className='editBoard__close' >
                        <svg onClick={this.props.onCloseEditBoard} height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                            <path d="M15.18 12l7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z"></path>
                        </svg>
                    </div>
                </div>
                <div className='container__editBoard-info'>
                    <div className='title__board' onChange={this.handleInput} >
                        <p>Name</p>
                        <input type='text' className='input' onChange={this.handleTitleChange} defaultValue={this.state.title}></input>
                    </div>
                    <div className='description__board-profile' onChange={this.handleDescriptionChange} >
                        <p>Description</p>
                        <textarea defaultValue={this.state.description} ></textarea>
                    </div>
                    <div className='category__board' onChange={this.handleInput} >
                        <p>Category</p>
                        <select onChange={this.handleCategoryChange} >
                            <option value={!this.state.category ? '' : this.state.category} selected>{!this.state.category ? 'What kind of board is it?' : this.state.category}</option>
                            <option value="animalspets">Animals and pets</option>
                            <option value="architecture">Architecture</option>
                            <option value="art">Art</option>
                            <option value="carsmotorcycles">Cars and Motorcycles</option>
                            <option value="education">Education</option>
                            <option value="design">Design</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="fooddrink">Food and Drink</option>
                        </select>
                    </div>
                    <div className='container__check-editBoard'>
                        <span>Secret</span>
                        <div className={!this.state.secret ? 'container__secret' : 'container__secret-checked'}>
                            <input className='secret' type='checkbox' onChange={this.handleCheckChange}></input>
                            <div className={!this.state.secret ? 'checkbox' : 'checkbox-checked'}></div>
                        </div>
                    </div>
                </div>

                <div className='footer__editBoard'>
                    <div className='container__buttons'>
                        <div className='button-bottom__editBoard' onClick={this.handleDelete} >Delete</div>
                        <div className='button-bottom__editBoard space' onClick={this.handleMerge} >Merge</div>
                    </div>
                    <div className='container__buttons'>
                        <div className='button-bottom__editBoard' onClick={this.props.onCloseEditBoard}>Cancel</div>
                        <div className='button-bottom__editBoard red' onClick={this.handleEditBoard}>Save</div>
                    </div>
                </div>
            </div>
        </section >
    }
}

export default EditBoard