import React, { Component } from "react";

class CountryOption extends Component {
    render() { 
        const {country, handleSelect} = {...this.props};

        return (
            <div onClick={() => handleSelect(country)} className="col-sm btn btn-primary m-2 d-flex justify-content-center align-items-center" style={{"height": "10rem" }}>{country.name}</div>
        ) 
    }
}

export default CountryOption;