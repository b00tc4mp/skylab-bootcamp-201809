import React, { Component } from 'react'
import './AddRentals.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import logic from '../../logic'
import { withRouter } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import GoogleMapReact from 'google-map-react';

class AddRentals extends Component {
  state = { title: "", city: "", street: "", category: "", description: "", bedrooms: "", shared: false, latitude: "", longitude: "", image: "none", dailyRate: "", loggedIn: false, file: null, imgPreview: null, errorFile: false }

  // componentWillReceiveProps(props) {
  //     if (props.isUpdate){
  //       //this.setState({title:props.data.title, city:props.data.city}, ()=>{
  //        //this.geocodeAddress()
  //       //})
  //     }else{
  //       this.setState({ modal: props.showModal })  
  //     }

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

    this.setState({ street }, () => {


    })
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
    const bedrooms = parseInt(event.target.value)

    this.setState({ bedrooms })
  }

  handleSharedChange = event => {
    let shared = event.target.value
    if (shared === "true") {
      shared = true
    }
    else {
      shared = false
    }

    this.setState({ shared })
  }

  handleDailyRateChange = event => {
    const dailyRate = parseInt(event.target.value, 10)
    this.setState({ dailyRate })
  }
  handleChangeFile = event => {
    this.setState({ imgPreview: URL.createObjectURL(event.target.files[0]), file: event.target.files[0], errorFile: false })
}

  handleRemovePreview = () => this.setState({ file: null, imgPreview: null })

  handleSubmit = event => {
    event.preventDefault()

    const { title, file, city, street, category, bedrooms, shared, description, dailyRate } = this.state

    if (!file) this.setState({ errorFile: true })

    

    if (file) this.handleAddRental(title, file, city, street, category, bedrooms, shared, description, dailyRate)

  }

  handleAddRental = (title, file, city, street, category, bedrooms, shared, description, dailyRate) => {
    try {
      
      logic.addRentals(title, file, city, street, category, bedrooms, shared, description, dailyRate)
        .then(() => {
          this.setState({ error: null })
          this.props.onShowHideModal()
        })
        .catch(err => {
          this.setState({ error: err.message }, () => toast.warn(this.state.error))
      })
    }catch (err) {
      this.setState({ error: err.message }, () => toast.warn(this.state.error))
    }
  }

  setMapInstance = ({ map, maps }) => {

    this.map = map
    this.mapsApi = maps
    this.map.markers = []
    }

  handleMapClick = ({ x, y, lat, lng, event }) => {

    this.map.markers.forEach(marker => {
      marker.setMap(null)
    })

    this.setState({ latitude: lat, longitude: lng })
    let marker = new this.mapsApi.Marker({
      position: { lat: lat, lng: lng },
      map: this.map,
      // icon: require('../../assets/img/hive.ico')
    });
    this.map.markers.push(marker)
  }

  geocodeAddress = () => {
    let geocoder = new this.mapsApi.Geocoder()
    this.map.markers.forEach(marker => {
      marker.setMap(null)
    })
    var address = this.state.street
    geocoder.geocode({ 'address': address }, (results, status) => {
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
        <ToastContainer position="top-center" />
      <Modal isOpen={this.state.modal} toggle={this.toggle} className="register-Rental">
        <ModalHeader toggle={this.toggle}>Add a new rental</ModalHeader>
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
              <input className="input__form" type="text" placeholder="Title..." onChange={this.handleTitleChange} />
              <input className="input__form" type="text" placeholder="City..." onChange={this.handleCityChange} />
              <input className="input__form" type="text" placeholder="Adress..." onChange={this.handleStreetChange} />
              <button className="btn_form" onClick={this.geocodeAddress}>Search adress</button>

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
                <option type='button' value={13} onClick={this.handleBedroomsChange}>13</option>
                <option type='button' value={14} onClick={this.handleBedroomsChange}>14</option>
              </select>
              <select className="input__form" onChange={this.handleSharedChange}>
                <option type='text' >Shared</option>
                <option type='button' value={true} onClick={this.handleSharedChange}>yes</option>
                <option type='button' value={false} onClick={this.handleSharedChange}>no</option>
              </select>
              <input className="input__form" type="text" placeholder="Daily Price..." onChange={this.handleDailyRateChange} />


            <div className="image__form">
            {!this.state.imgPreview &&<div>
                <input id='file-form' className='input__file' type='file' onChange={this.handleChangeFile} required />
                <label for='file-form'>
                  <div className={!this.state.errorFile ? 'add__photo' : 'add__photo error'}>
                    <i className="fas fa-camera fa-2x"></i>
                   Click to upload
                  </div>
                </label>
              </div>}

                {this.state.imgPreview && <div className='preview__container'>
                <img className='photo__preview' src={this.state.imgPreview}></img>
                <div onClick={this.handleRemovePreview} className='icon_x'>
                  <svg height="20" width="20" viewBox="0 0 24 24" aria-hidden="true" aria-label="" role="img">
                    <path d="M15.18 12l7.16-7.16c.88-.88.88-2.3 0-3.18-.88-.88-2.3-.88-3.18 0L12 8.82 4.84 1.66c-.88-.88-2.3-.88-3.18 0-.88.88-.88 2.3 0 3.18L8.82 12l-7.16 7.16c-.88.88-.88 2.3 0 3.18.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66L12 15.18l7.16 7.16c.44.44 1.01.66 1.59.66.58 0 1.15-.22 1.59-.66.88-.88.88-2.3 0-3.18L15.18 12z"></path>
                  </svg>
                </div>
              </div>}
              </div>

              <button className="btn_form" type="submit">Create a Rental</button>
            </div>
          </form>

        </ModalBody>
        <ModalFooter>
          <button className="close__btn" onClick={this.toggle}>Close</button>
        </ModalFooter>
      </Modal>
    </div>


  }
}

export default withRouter(AddRentals)