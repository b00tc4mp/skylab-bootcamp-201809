import React, { Component } from 'react'
import './EditRentals.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import logic from '../../logic'
import { withRouter } from "react-router";
import GoogleMapReact from 'google-map-react';

class EditRentals extends Component {
  state = { rental: {}, loggedIn: false }
    
  componentDidMount(){
      this.setState({ modal: this.props.showModal }) //...SHOW MODAL/POPUP

      logic.listRentalByRentalId(this.props.id)//...RETRIVE RENTAL ID
            .then(rental => {  
            this.setState({rental})
          })
  }
  

toggle = () => {
    this.props.onShowHideModal() // ... CLOSE MODAL / POPUP
  }

handleTitleChange = event => {
    const title = event.target.value
    this.state.rental.title = title
    this.setState({ rental:this.state.rental }, ()=>{
    })
  }


handleCityChange = event => {
  const city = event.target.value
  this.state.rental.city = city
  this.setState({ rental:this.state.rental }, ()=>{
  })
}


handleStreetChange = event => {
  const street = event.target.value
  this.state.rental.street = street
  this.setState({ rental:this.state.rental }, ()=>{
  })
}

handleCategoryChange = event => {
  const category = event.target.value
  this.state.rental.category = category
  this.setState({ rental:this.state.rental }, ()=>{
  })
}

handleDescribeChange = event => {
  const description = event.target.value
  this.state.rental.description = description
  this.setState({ rental:this.state.rental }, ()=>{
  })
}

handleBedroomsChange = event => {
  const bedrooms = parseInt(event.target.value)
  this.state.rental.bedrooms = bedrooms
  this.setState({ rental:this.state.rental }, ()=>{
  })
}

handleSharedChange = event => {
  let shared = event.target.value
  if(shared === "true"){
    shared=true
  }
  else{
    shared= false
  }
  this.state.rental.shared = shared
  this.setState({ rental:this.state.rental }, ()=>{
  })
}

handleDailyRateChange = event => {
  const dailyRate = parseInt(event.target.value,10)
  this.state.rental.dailyRate = dailyRate
  this.setState({ dailyRate })
}

handleSubmit = event => {
        event.preventDefault()

        const { title, city, street, category, image, bedrooms, shared, description, dailyRate } = this.state.rental

        this.handleEditRental(title, city, street, category, image, bedrooms, shared, description, dailyRate)
    }

handleEditRental = (title, city, street, category, image, bedrooms, shared, description, dailyRate) => {
try {
    logic.editRental(this.state.rental.id,title, city, street, category, image, bedrooms, shared, description, dailyRate)
        .then(() => {
            this.setState({ error: null })
            this.props.onShowHideModal()
        })
        .catch(err => this.setState({ error: err.message }))
} catch (err) {
    this.setState({ error: err.message })
}
}

    setMapInstance = ({ map, maps }) => {

      this.map = map
      this.mapsApi = maps
      this.map.markers = []
      // if (this.state.form_data)
      //     this.handleMapClick({ x: 0, y: 0, lat: this.state.form_data.latitude, lng: this.state.form_data.longitude, event: null })
    }

    handleMapClick = ({ x, y, lat, lng, event }) => {

      this.map.markers.forEach(marker => {
          marker.setMap(null)
      })
    
      this.setState({ latitude: lat, longitude: lng  })
      let marker = new this.mapsApi.Marker({
          position: { lat: lat, lng: lng },
          map: this.map,
          // icon: require('../../assets/img/hive.ico')
      });
      this.map.markers.push(marker)
  }

  geocodeAddress = ()=> {
    let geocoder = new this.mapsApi.Geocoder()
    this.map.markers.forEach(marker => {
      marker.setMap(null)
  })
    var address = this.state.street
    geocoder.geocode({'address': address}, (results, status) =>{
      if (status === 'OK') {
        this.map.setCenter(results[0].geometry.location);
        var marker = new this.mapsApi.Marker({
          map: this.map,
          position: results[0].geometry.location
        });
        this.map.markers.push(marker)
      } else {
        // alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
  

  render() {
    return <div>
      <Modal isOpen={this.state.modal} toggle={this.toggle} className="register-Rental">
        <ModalHeader toggle={this.toggle}>EDIT</ModalHeader>
        <ModalBody>
          <section className="map">
          <GoogleMapReact
              defaultCenter={{ lat: 28.4, lng: -16.3 }}
              defaultZoom={12}
              bootstrapURLKeys={{ key: "AIzaSyD2T4oMLr7caT6MwUYZI0N_6u65KBZ97jk", language: 'es', region: 'es' }}
              //onClick={this.handleMapClick}
              onGoogleApiLoaded={this.setMapInstance}>
          </GoogleMapReact>
          </section>
          <form className="form__addRentals" onSubmit={this.handleSubmit}>
            <div className="form__dates">
              <input className="input__form" type="text" defaultValue={this.state.rental.title} onC onChange={this.handleTitleChange} />
              <input className="input__form" type="text" defaultValue={this.state.rental.city} onChange={this.handleCityChange} />
              <input className="input__form" type="text" defaultValue={this.state.rental.street} onChange={this.handleStreetChange} />
              <button className="btn_form" onClick={this.geocodeAddress}>Search adress</button>
             
              <textarea  className="input__form"  onChange={this.handleDescribeChange} value={this.state.rental.description}></textarea>
              <select className="input__form" onChange={this.handleCategoryChange}>
                <option type='button' selected="selected" value={this.state.rental.category} onClick={this.handleCategoryChange}>{this.state.rental.category}</option>
                <option type='button' value="Couples" onClick={this.handleCategoryChange}>Couples</option>
                <option type='button' value="Adventure" onClick={this.handleCategoryChange}>Adventure</option>
                <option type='button' value="Relax" onClick={this.handleCategoryChange}>Relax</option>
                <option type='button' value="Groups" onClick={this.handleCategoryChange}>Groups</option>
                <option type='button' value="summer" onClick={this.handleCategoryChange}>summer</option>
                <option type='button' value="Only adults" onClick={this.handleCategoryChange}>Only adults</option>
                <option type='button' value="Family" onClick={this.handleCategoryChange}>Family</option>
              </select>
              <select className="input__form" onChange={this.handleBedroomsChange}>
                <option type='button' selected="selected" value={this.state.rental.bedrooms} onClick={this.handleCategoryChange}>{this.state.rental.bedrooms}</option>
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
              <input className="input__form" type="text" defaultValue={this.state.rental.dailyRate} onChange={this.handleDailyRateChange} />

              <button className="btn_form" type="submit">Send</button>
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

export default withRouter(EditRentals)