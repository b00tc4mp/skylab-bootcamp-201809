import React from 'react'
import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Search.css'
import { ToastContainer, toast } from 'react-toastify';

class Search extends Component {

  state = { query: "", loggedIn: false }

  handleCityChange = event => {
    const query = event.target.value

    this.setState({ query })
  }

  handleSubmit = event => {
    event.preventDefault()

    const { query } = this.state
    if (query === "") {
      toast.error('Please, write something...');
    }
    else {
      this.props.history.push(`/rentals/search/${query}`)
    }

  }



  render() {
    return <div id="booking" className="section">
      <ToastContainer position="top-center" />

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
            </form>
          </div>
        </div>
      </div>

    </div >


  }
}


export default withRouter(Search)