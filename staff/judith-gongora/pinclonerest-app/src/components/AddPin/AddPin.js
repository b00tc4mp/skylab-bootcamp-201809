import React, { Component } from 'react'
import logic from '../../logic'
import Navbar from '../Navbar/Navbar'
import Boards from './Boards'
import AddBoard from './AddBoard'
import './AddPin.sass'

class AddPin extends Component {
    state = { user: {}, title: '', url: '', board: null, boardId: '', file: null, imgPreview: null, description: '', inputSite: false, boardsSel: false, createBoard: false, errorFile: false, errorBoard: false, errorUrl: false }

    componentDidMount() {
        logic.retrieveUser()
            .then(user => this.setState({ user }))
        // TODO error handling!

    }

    handleSiteOn = () => this.setState({ inputSite: true })
    handleSiteOff = () => this.setState({ inputSite: false })

    handleChangeFile = event => {
        this.setState({ imgPreview: URL.createObjectURL(event.target.files[0]), file: event.target.files[0], errorFile: false })
    }

    handleRemovePreview = () => this.setState({ file: null, imgPreview: null })

    handleTitleChange = event => {
        const title = event.target.value

        this.setState({ title })
    }

    handleUrlChange = event => {
        const url = event.target.value

        this.setState({ url, errorUrl: false })
    }

    handleDescriptionChange = event => {
        const description = event.target.value

        this.setState({ description })
    }

    handleBoardChange = board => {
        this.setState({ board, boardId: board.id, boardsSel: false, errorBoard: false })
    }

    handleBoards = () => this.setState({ boardsSel: true })

    handleClickCreateBoard = () => this.setState({ boardsSel: false, createBoard: true })

    handleClose = () => this.setState({ boardsSel: true, createBoard: false })

    handleCreateBoard = (title, secret) => {
        logic.addBoard(title, secret)
            .then(board => this.setState({ board, createBoard: false, boardId: board.id }))
    }

    handleSubmit = event => {
        const { file, boardId, url, title, description } = this.state
        event.preventDefault()
        if (url.trim()) {
            const regexp = new RegExp('(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$', 'i');
            if (!regexp.test(url)) this.setState({ errorUrl: true })
        }
        if (!file) this.setState({ errorFile: true })
        if (!boardId) this.setState({ errorBoard: true })
        if (file && boardId) this.props.onCreatePin(file, boardId, url, title, description)

    }




    render() {
        return <div className="div__addPin">
            <Navbar onSettings={this.props.onSettings} onHandleProfile={this.props.onHandleProfile} onHome={this.props.onHome} onLogout={this.props.onLogout} />
            <section className="addPin__container">
                <div className='addPin__home'>
                    <a onClick={this.props.onHome} >
                        <svg height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img"><title></title><path d="M17.28 24c-.57 0-1.14-.22-1.58-.66L4.5 12 15.7.66a2.21 2.21 0 0 1 3.15 0c.87.88.87 2.3 0 3.18L10.79 12l8.06 8.16c.87.88.87 2.3 0 3.18-.44.44-1 .66-1.57.66"></path></svg>
                        <span>Home</span>
                    </a>
                </div>
                <section className='add__container'>
                    <div>
                        <div className='container1'>
                            {!this.state.boardsSel && !this.state.createBoard && <button className="button-add" type="submit" onClick={this.handleSubmit} >
                                <svg height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                                    <path d="M18 13.5c0-2.22-1.21-4.15-3-5.19V2.45A2.5 2.5 0 0 0 17 0H7a2.5 2.5 0 0 0 2 2.45v5.86c-1.79 1.04-3 2.97-3 5.19h5v8.46L12 24l1-2.04V13.5h5z"></path>
                                </svg>
                                Save
                            </button>}
                        </div>
                    </div>
                    <div className='container2'>
                        <div className='container__left'>
                            {!this.state.file ? <div>
                                <input id='file-form' className='input__file' type='file' onChange={this.handleChangeFile} required />
                                <label for='file-form'>
                                    <div className={!this.state.errorFile ? 'add__photo' : 'add__photo error'}>
                                        <i className="fas fa-camera fa-2x"></i>
                                        Drag and Drop or click to upload
                                    </div>
                                </label>
                            </div> :
                                <div className='preview__container'>
                                    <img className='photo__preview' src={this.state.imgPreview}></img>
                                    <div onClick={this.handleRemovePreview} className='icon-x'>
                                        <svg height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                                            <path d="M15.18 12l7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z"></path>
                                        </svg>
                                    </div>
                                </div>}


                            {!this.state.inputSite && !this.state.file && <div className='button__site' onClick={this.handleSiteOn} >Save from site</div>}
                            {this.state.inputSite && !this.state.file && <div className='input__site'>
                                <input className='input-site' type="text" placeholder="Enter Website" onChange={this.handleSiteChange} onBlur={this.handleSiteOff} autoFocus />
                                <div className='arrow__site'>
                                    <svg height="20" width="20" viewBox="0 0 24 24" aria-label="Submit" role="img">
                                        <title>Submit</title>
                                        <path d="M6.72 24c.57 0 1.14-.22 1.57-.66L19.5 12 8.29.66c-.86-.88-2.27-.88-3.14 0-.87.88-.87 2.3 0 3.18L13.21 12l-8.06 8.16c-.87.88-.87 2.3 0 3.18.43.44 1 .66 1.57.66"></path>
                                    </svg>
                                </div>
                            </div>}

                        </div>
                        {!this.state.boardsSel && !this.state.createBoard && <div className='container__rigth'>
                            <input className='input-title' type="text" placeholder="Add a title" onChange={this.handleTitleChange} required />
                            <div className='user__info-add'>
                                <div className='user' onClick=''>
                                    <img src={this.state.user.img} ></img>
                                    <div>
                                        <p className='username'>{this.state.user.username} </p>
                                        <p>{this.state.user.followers ? this.state.user.followers : 0} followers</p>
                                    </div>
                                </div>
                            </div>

                            <input className='description' type="textarea" maxLength='500' placeholder="Say more about this Pin" onChange={this.handleDescriptionChange} />

                            <div className='boards'>
                                <input className={!this.state.errorUrl ? 'input-url' : 'input-url error'} type="text" placeholder="Add the url this pin links to" onChange={this.handleUrlChange} />
                                <div className={!this.state.errorBoard ? 'select' : 'select error'}>{!this.state.board ? <span>Choose a board (required)</span> : <span>{this.state.board.title}</span>}
                                    <svg onClick={this.handleBoards} height="12" width="12" viewBox="0 0 24 24" aria-label="Selecciona un tablero en el que quieras guardar Pines" role="img">
                                        <title>Selecciona un tablero en el que quieras guardar Pines</title><path d="M12 19.5L.66 8.29c-.88-.86-.88-2.27 0-3.14.88-.87 2.3-.87 3.18 0L12 13.21l8.16-8.06c.88-.87 2.3-.87 3.18 0 .88.87.88 2.28 0 3.14L12 19.5z"></path>
                                    </svg>
                                </div>
                            </div>

                        </div>}

                        {this.state.boardsSel && !this.state.createBoard && <div className='container__rigth-boards'> <Boards handleSelectBoard={this.handleBoardChange} onCreateBoard={this.handleClickCreateBoard} /> </div>}
                        {this.state.createBoard && !this.state.boardsSel && <div className='container__rigth-boards'> <AddBoard handleSelectBoard={this.handleBoardChange} onCreateBoard={this.handleCreateBoard} onClose={this.handleClose} /> </div>}

                    </div>
                </section>
            </section>
        </div >
    }
}

export default AddPin