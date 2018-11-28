import React, { Component } from 'react'
import { withRouter, Route } from 'react-router-dom';
import './Landing.css'
import Search from '../Search/Search'
import SearchResults from '../SearchResults/SearchResults'
import AllRentals from '../AllRentals/AllRentals'

class Landing extends Component {
    state = { }



    render() {
        return <div className="home">
            <div className="search__container">
            <Route exact path="/" render={() =><Search isLoggedIn={this.state.loggedIn}/>}/>
            </div>
            <Route exact path="/" render={() =><AllRentals isLoggedIn={this.state.loggedIn}/>}/>
                 {/* <Route exact path="/rentals/search/:query" render={() => <SearchResults  />} /> */}
        </div>


    }

}

export default withRouter(Landing)