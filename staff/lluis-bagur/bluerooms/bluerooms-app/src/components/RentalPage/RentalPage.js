import React, { Component } from 'react'
import logic from '../../logic'
import GoogleMapReact from 'google-map-react';
import { RentalDetailInfo } from './RentalDetailInfo/RentalDetailInfo';
import Booking from '../booking/Booking'
import './RentalPage.css'



class RentalPage extends Component {

    state = {
        rental: [],
    }

    componentDidMount() {
        logic.retriveRental(this.props.id)
            .then(rental => { this.setState({ rental }) })
    }


    //MAP FUNCTIONS

    setMapInstance = ({ map, maps }) => {
        this.map = map
        this.mapsApi = maps
        this.map.markers = []
        this.geocodeAddress()
        // if (this.state.form_data)
        //     this.handleMapClick({ x: 0, y: 0, lat: this.state.form_data.latitude, lng: this.state.form_data.longitude, event: null })
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
        var address = (this.state.rental.street + " " + this.state.rental.city)

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
        return <div className="rental__page">
            <div className="rental__page__top">
                <div className="rental__fotos">
                    <img className='card-img-top' src={this.state.rental.image} alt=''></img>
                </div>
                </div>
                <div className='details-section'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <RentalDetailInfo rental={this.state.rental} />
                        </div>
                        <div className='col-md-4'>
                            <Booking rental={this.state.rental} id={this.props.id} isLoggedIn={this.props.isLoggedIn} />
                        </div>
                    </div>
                    <div className="rental__map">
                        <section className="map">
                            <GoogleMapReact
                                defaultCenter={{ lat: 28.4, lng: -16.3 }}
                                defaultZoom={14}
                                bootstrapURLKeys={{ key: "AIzaSyD2T4oMLr7caT6MwUYZI0N_6u65KBZ97jk", language: 'es', region: 'es' }}
                                //onClick={this.handleMapClick}
                                onGoogleApiLoaded={this.setMapInstance}>
                            </GoogleMapReact>
                        </section>
                    </div>
                </div>

                <div className="rental__page__footer">
                </div>

            </div>

            }
        }
        
export default RentalPage