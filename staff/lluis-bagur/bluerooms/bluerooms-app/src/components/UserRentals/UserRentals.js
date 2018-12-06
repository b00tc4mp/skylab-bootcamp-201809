import React, { Component } from 'react'
import logic from '../logic'
import RentalCard from './Component/RentalCard'


class UserRentals extends Component {
    state = {
        error: '',
        Fav: [],
        flag: true

    }

    handleSearch = this.handleSearch.bind(this)

    handleSearch() {
        try {
            logic.listFavourites()
                .then(Fav => this.setState({ Fav }))
                .catch(err => this.setState({ error: err.message }))
        }
        catch (err) {
            this.setState({ error: err.message })
        }
        this.setState({ flag: false })
    }
        


    render() {
        return <div className="contain">
            {this.state.flag && this.handleSearch()}
            {this.state.Fav[0] && <div className="row">
                <h4>Your rental list</h4>
                <div className="row__inner">
                    {this.state.Fav.map((film) => {
                        return <RentalCard title={film.title} description={film.overview} release={film.release_date} imgRoute={film.urlImage} id={film.id} onCardClick={this.handleCardClick} key={film.id}/>
                    })}
                </div>
            </div>}
        </div>

    }
}

export default UserRentals