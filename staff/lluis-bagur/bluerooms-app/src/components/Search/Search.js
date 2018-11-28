import React from 'react'
import {Component} from 'react';
import { withRouter, Route } from 'react-router-dom';
import './Search.css'
import logic from '../../logic'

class Search extends Component {

  state = { query: "", loggedIn: false }

  handleCityChange = event => {
    const query = event.target.value

    this.setState({ query })
  }

  handleSubmit = event => {
    event.preventDefault()

    const {query} = this.state
    
     this.props.history.push(`/rentals/search/${query}`)
}



  render() {
    return <div id="booking" className="section">
      <div className="section-center">
        <div className="container">
          <div className="row">
            <div className="booking-form">
              <form onSubmit={this.handleSubmit}>
                <div className="row">
                  <div className="col-md-7">
                    <div className="form-group">
                      <span className="form-label">City:</span>
                      <input className="form-control" type="text" defaultValue={this.props.query && this.props.query} placeholder="City..." onChange={this.handleCityChange}></input>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-btn">
                      <button className="submit-btn">Show Rentals</button>
                    </div>
                  </div>
                </div>
                {/* <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Check in:</span>
                      <input className="form-control" type="date" required onChange={this.handleStartAtChange}></input>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <span className="form-label">Check out:</span>
                      <input className="form-control" type="date" required onChange={this.handleEndAtChange}></input>
                    </div>
                  </div>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div >


  }
}


export default withRouter(Search)