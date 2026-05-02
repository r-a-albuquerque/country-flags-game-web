import React from "react";
import { formatCountryName } from "../services/utils"

const CountryOption = ({ country, handleSelect }) => {
    const name = formatCountryName(country)
    return (
        <div onClick={() => handleSelect(country)} className="col-sm btn btn-primary m-2 d-flex justify-content-center align-items-center" style={{ "height": "10rem" }}>
            {name}
        </div>
    )
}

export default CountryOption;