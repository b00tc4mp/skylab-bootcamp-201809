import React from 'react'
import Login from '../Login/Login'



function Landing(props) {
    return <div className="home">
            <div className="search__container">
            <div className="search">
                SEARCH COMP 
            </div>
            </div>
            <div className="result__container"></div>
            <div className="results">
                SEARCH RESULTS
            </div>
        <Login></Login>
    </div>
}

export default Landing