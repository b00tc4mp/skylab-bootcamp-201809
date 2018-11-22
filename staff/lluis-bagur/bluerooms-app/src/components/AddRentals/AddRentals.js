import React, { Component } from 'react'
import './AddRentals.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import logic from '../../logic'
import { withRouter } from "react-router";


class AddRentals extends Component {
  state = { title: "", city: "", street: "", category: "", description:"", bedrooms: "", shared:"false", image: "none", dailyRate:"", loggedIn: false }

  componentWillReceiveProps(props) {
    this.setState({ modal: props.showModal })
  }

  toggle = () => {
    this.props.onShowHideModal()
  }

  handleTitleChange = event => {
    const title = event.target.value

    this.setState({ title })
}

handleCityChange = event => {
  const city = event.target.value
  this.setState({ city })
}

handleStreetChange = event => {
  const street = event.target.value

  this.setState({ street })
}

handleCategoryChange = event => {
  const category = event.target.value

  this.setState({ category })
}

handleDescribeChange = event => {
  const description = event.target.value

  this.setState({ description })
}

handleBedroomsChange = event => {
  const bedrooms = event.target.value

  this.setState({ bedrooms })
}

handleSharedChange = event => {
  const shared = event.target.value

  this.setState({ shared })
}

handlePraceChange = event => {
  const dailyRate = event.target.value

  this.setState({ dailyRate })
}

handleSubmit = event => {
        event.preventDefault()

        const { title, city, street, category, image, bedrooms, shared, description, dailyRate } = this.state
        debugger

        this.handleAddRental(title, city, street, category, image, bedrooms, shared, description, dailyRate)
        debugger
    }

    handleAddRental = (title, city, street, category, image, bedrooms, shared, description, dailyRate) => {
    try {
        logic.addRentals(title, city, street, category, image, bedrooms, shared, description, dailyRate)
            .then(() => {
                this.setState({ error: null })
                debugger
                this.props.toggle()
            })
            .catch(err => this.setState({ error: err.message }))
    } catch (err) {
        this.setState({ error: err.message })
    }
}
  

  render() {
    return <div>
      <Modal isOpen={this.state.modal} toggle={this.toggle} className="register-hive">
        <ModalHeader toggle={this.toggle}>Add a new rental</ModalHeader>
        <ModalBody>
          <form className="form__addRentals" onSubmit={this.handleSubmit}>
            <div className="form__dates">
              <input className="input__form" type="text" placeholder="Title..." onChange={this.handleTitleChange} />
              <input className="input__form" type="text" placeholder="City..." onChange={this.handleCityChange} />
              <input className="input__form" type="text" placeholder="Adress..." onChange={this.handleStreetChange} />
              <textarea className="input__form" type="text" placeholder="Description..." onChange={this.handleDescribeChange} />
              <select className="input__form" onChange={this.handleCategoryChange}>
                <option type='text' >Select category</option>
                <option type='button' value="Couples" onClick={this.handleCategoryChange}>Couples</option>
                <option type='button' value="Adventure" onClick={this.handleCategoryChange}>Adventure</option>
                <option type='button' value="Relax" onClick={this.handleCategoryChange}>Relax</option>
                <option type='button' value="Groups" onClick={this.handleCategoryChange}>Groups</option>
                <option type='button' value="summer" onClick={this.handleCategoryChange}>summer</option>
                <option type='button' value="Only adults" onClick={this.handleCategoryChange}>Only adults</option>
                <option type='button' value="Family" onClick={this.handleCategoryChange}>Family</option>
              </select>
              <select className="input__form" onChange={this.handleBedroomsChange}>
                <option type='text' >Guests</option>
                <option type='button' value={1} onClick={this.handleBedroomsChange}>1</option>
                <option type='button' value={2} onClick={this.handleBedroomsChange}>2</option>
                <option type='button' value={3} onClick={this.handleBedroomsChange}>3</option>
                <option type='button' value={4} onClick={this.handleBedroomsChange}>4</option>
                <option type='button' value={5} onClick={this.handleBedroomsChange}>5</option>
                <option type='button' value={6} onClick={this.handleBedroomsChange}>6</option>
                <option type='button' value={7} onClick={this.handleBedroomsChange}>7</option>
                <option type='button' value={8} onClick={this.handleBedroomsChange}>8</option>
                <option type='button' value={9} onClick={this.handleBedroomsChange}>9</option>
                <option type='button' value={10} onClick={this.handleBedroomsChange}>10</option>
                <option type='button' value={11} onClick={this.handleBedroomsChange}>11</option>
                <option type='button' value={12} onClick={this.handleBedroomsChange}>12</option>
                <option type='button' value={13}  onClick={this.handleBedroomsChange}>13</option>
                <option type='button' value={14}  onClick={this.handleBedroomsChange}>14</option>
              </select>
              <select className="input__form" onChange={this.handleSharedChange}>
                <option type='text' >Shared</option>
                <option type='button' value = {true} onClick={this.handleSharedChange}>yes</option>
                <option type='button' value={false} onClick={this.handleSharedChange}>no</option>
              </select>
              <input className="input__form" type="text" placeholder="Daily Price..." onChange={this.handlePriceChange} />


              UPLOAD AN IMAGE

              <button className="btn_form" type="submit">Add</button>
            </div>
          </form>

        </ModalBody>
        <ModalFooter>
          <button onClick={this.toggle}>Close</button>
        </ModalFooter>
      </Modal>
    </div>


  }
}

export default withRouter(AddRentals)