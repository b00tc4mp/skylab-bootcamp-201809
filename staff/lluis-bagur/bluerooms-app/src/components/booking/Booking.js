import React from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { ToastContainer, toast } from 'react-toastify';
import { BookingModal } from './BookingModal';
import './Booking.css'
import logic from '../../logic'
import * as moment from 'moment';
import Register from '../Register/Register'


class Booking extends React.Component {

  constructor() {
    super();

    this.bookedOutDates = [];
    this.dateRef = React.createRef();

    this.state = {
      rental: [],
      bookingsNum: [],
      proposedBooking: {
        startAt: '',
        endAt: '',
        guests: ''
      },
      modal: {
        open: false
      },
      errors: [],
      showRegister:false
    }

    this.checkInvalidDates = this.checkInvalidDates.bind(this);
    this.handleApply = this.handleApply.bind(this);
    this.cancelConfirmation = this.cancelConfirmation.bind(this);
    this.reserveRental = this.reserveRental.bind(this);
  }



  componentWillReceiveProps(props) {

    // if(props.rental.id ){
    //   logic.retriveRental(this.props.id)
    //         .then(rental => { this.setState({ rental }) })
    // }

    const rental = props.rental
    const guests = props.rental.bedrooms
    let bookingsNum = 0
    if(props.rental.bookings) bookingsNum = props.rental.bookings.length
      debugger
   

    this.setState({
      bookingsNum, rental, proposedBooking: {
        ...this.state.proposedBooking,
        guests: guests
      }
    }, () => this.getBookedOutDates())
  }

  getBookedOutDates() {
    debugger
    const bookings = this.state.rental.bookings;
    if (bookings && bookings.length > 0) {
      bookings.forEach(booking => {
        const dateRange = this.getRangeOfDates(booking.startAt, booking.endAt, 'Y/MM/DD');
        this.bookedOutDates.push(...dateRange);
      });
    }
  }

  getRangeOfDates = (startAt, endAt, dateFormat = 'Y/MM/DD') => {
    const tempDates = [];
    const mEndAt = moment(endAt);
    let mStartAt = moment(startAt);

    while (mStartAt < mEndAt) {
      tempDates.push(mStartAt.format(dateFormat));
      mStartAt = mStartAt.add(1, 'day');
    }

    tempDates.push(mEndAt.format(dateFormat));

    return tempDates;
  }

  checkInvalidDates(date) {
    return this.bookedOutDates.includes(date.format('Y/MM/DD')) || date.diff(moment(), 'days') < 0;
  }

  handleApply(event, picker) {
    const startAt = picker.startDate.format('Y/MM/DD');
    const endAt = picker.endDate.format('Y/MM/DD');

    this.dateRef.current.value = startAt + ' to ' + endAt;

    this.setState({

      proposedBooking: {
        ...this.state.proposedBooking,
        startAt,
        endAt
      }
    });
  }

  selectGuests(event) {
    this.setState({
      proposedBooking: {
        ...this.state.proposedBooking,
        guests: parseInt(event.target.value, 10)
      }
    })
  }

  cancelConfirmation() {
    this.setState({
      modal: {
        open: false
      }
    })
  }

  addNewBookedOutDates(booking) {
    debugger
    const dateRange = this.getRangeOfDates(booking.startAt, booking.endAt);
    this.bookedOutDates.push(...dateRange);
  }

  resetData() {
    this.dateRef.current.value = '';

    this.setState({ proposedBooking: { guests: '' } });
  }

  confirmProposedData() {
    debugger
    const { startAt, endAt } = this.state.proposedBooking;
    const days = this.getRangeOfDates(startAt, endAt).length - 1;
    const { rental } = this.props;

    this.setState({
      proposedBooking: {
        ...this.state.proposedBooking,
        days,
        totalPrice: days * rental.dailyRate,
        rental
      },
      modal: {
        open: true
      }
    });
  }

  reserveRental() {
    debugger
    logic.createBooking(this.state.proposedBooking).then(
      (booking) => {

        this.addNewBookedOutDates(booking);
        this.cancelConfirmation();
        this.resetData();
        toast.success('Booking has been succesfuly created! Enjoy.');
      },
      (errors) => {
        this.setState({ errors });
      })
  }


  toggleModalRegister(){
    this.setState({ showRegister: !this.state.showRegister })
}

  render() {
    const { startAt, endAt, guests } = this.state.proposedBooking;

    return (
      <div className='booking'>
      <ToastContainer position="top-center"/>
        <h3 className='booking-price'>$ {this.state.rental.dailyRate} <span className='booking-per-night'>per night</span></h3>
        <hr></hr>

       {!this.props.isLoggedIn &&  <div className='btn btn-bwm btn-confirm btn-block' onClick={() => this.toggleModalRegister()}>
          Login to book place.
    </div> }
    <Register showModal={this.state.showRegister} onShowHideModal={() => this.toggleModalRegister()} handleLoggedIn={this.props.handleLoggedIn} onGoBack={this.handleGoBack}/>



        <React.Fragment>
          <div className='form-group'>
            <label htmlFor='dates'>Dates</label>
            <DateRangePicker onApply={this.handleApply}
              isInvalidDate={this.checkInvalidDates}
              opens='left'
              containerStyles={{ display: 'block' }}>
              <input ref={this.dateRef} id='dates' type='text' className='form-control'></input>
            </DateRangePicker>
          </div>
          <div className='form-group'>
            <label htmlFor='guests'>Guests</label>
            <input 
              value={guests}
              type='number'
              className='form-control'
              id='guests'
              aria-describedby='guests'
              placeholder=''>
            </input>
          </div>
          {!!this.props.isLoggedIn && this.state.rental.view && <button disabled={!startAt || !endAt} onClick={() => this.confirmProposedData()} className='btn btn-bwm btn-confirm btn-block'>Reserve place now</button>}
          {!this.state.rental.view && <button disabled={!startAt || !endAt} className='btn btn-bwm btn-confirm btn-block'>this place are disabled</button>}

        </React.Fragment>

        <hr></hr>
        <p className='booking-note-title'>People are interested into this house</p>
        <p className='booking-note-text'>
          {this.state.bookingsNum} people have booked this apartment.
        </p>
        <BookingModal open={this.state.modal.open}
          closeModal={this.cancelConfirmation}
          confirmModal={this.reserveRental}
          booking={this.state.proposedBooking}
          errors={this.state.errors}
          rentalPrice={this.state.rental.dailyRate} />
      </div>
    )
  }
}



export default Booking




