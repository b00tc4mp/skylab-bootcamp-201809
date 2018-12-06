import React, { Component } from 'react'
import logic from '../../logic'


class Photos extends Component {
    state = { photos: []}

    componentDidMount() {
        logic.retrievePhotos(this.props.pinId)
            .then(photos => this.setState({ photos }))
        // TODO error handling!

    }


    render() {
        return <section className="photos__container">
                <p>Tried this Pin? Add a photo to show how it went</p>
                <div className="themes add">
                    <span>Add Photo</span>
                </div>
            </section>
     
    }
}

export default Photos