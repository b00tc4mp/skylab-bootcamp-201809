import React from 'react';
import { withRouter } from 'react-router-dom';
import './Search.css'

class RentalSearchInput extends React.Component {

  constructor() {
    super();

    this.searchInput = React.createRef();
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  }

  handleSearch() {
    const { history } = this.props;
    const city = this.searchInput.current.value;

    city ? history.push(`/rentals/${city}/homes`) : history.push('/rentals');
  }


  render() {
    return<div id="booking" class="section">
      <div class="section-center">
        <div class="container">
          <div class="row">
            <div class="booking-form">
              <form>
                <div class="row">
                  <div class="col-md-6">
                    <div class="form-group">
                      <span class="form-label">City:</span>
                      <input class="form-control" type="text" placeholder="City..."></input>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-3">
                    <div class="form-group">
                      <span class="form-label">Check in:</span>
                      <input class="form-control" type="date" required></input>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="form-group">
                      <span class="form-label">Check out:</span>
                      <input class="form-control" type="date" required></input>
                    </div>
                  </div>
                  <div class="col-md-2">
                    <div class="form-group">
                      <span class="form-label">Guests:</span>
                      <select class="form-control">
                        <option>1</option>
                        <option>2</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                      </select>
                      <span class="select-arrow"></span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="form-checkbox">
                    <span class="form-label">Shared:</span>
                    <label for="Yes">
                      <input type="radio" id="Yes" name="Yes"></input>
                      <span></span>Yes
        </label>
                    <label for="No">
                      <input type="radio" id="No" name="No"></input>
                      <span></span>No
        </label>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-3">
                    <div class="form-btn">
                      <button class="submit-btn">Show Rentals</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div >


  }
}


export default withRouter(RentalSearchInput)