import React from 'react'
import './Landing.css'
import Search from '../Search/Search'
import RentalList from '../RentalList/RentalList'



class Landing extends React.Component {


    render() {
        return <div className="home">
            <div className="search__container">
                <div className="search">
                    <Search />
                </div>
            </div>
            <div className="result__container">
            </div>
            <div className="results">
                <div className='container'>
                    <RentalList/>
                </div>

            </div>

        </div>
    }

}

export default Landing