import React, { Component } from "react";
import { toast } from "react-toastify";
import http from "../services/httpService"
import { uniqueRandomArray, random } from "../services/utils"
import CountryOption from "./CountryOption"

class FlagGameMain extends Component {

    DEFAULT_TIMER_VALUE = 15;
    ARDUINO = process.env.ARDUINO || false;

    // store timer function
    timer = {}

    state = {
        countries: {},
        sortedCountry: {},
        randomAnswers: [],
        rightAnswers: 0,
        wrongAnswers: 0,
        timeLeft: this.DEFAULT_TIMER_VALUE,

    }

    componentDidMount = async () => {
        try {

            // get all countries from remote API
            const { data: countries } = await http.getCountries();
            this.setState({ countries: countries })

            this.selectCountries();

            this.resetTimer()
        } catch (error) {
            throw error;
        }
    }

    selectCountries = () => {

        // 1 - select 5 countries to show options
        // 1.1 - get complete country list
        const { countries } = this.state;

        // 1.2 - create an alleatory array to create answer option
        const randomUniqueArray = uniqueRandomArray(5, 0, countries.length - 1)

        // 1.3 - create an array with sorted countries
        let randomAnswers = [];
        for (let index = 0; index < randomUniqueArray.length; index++) {
            const country = countries[randomUniqueArray[index]];

            randomAnswers.push(country);
        }

        // 1.4 - save state
        this.setState({ randomAnswers: randomAnswers });

        // 2. - select a random country to show flag

        // 2.1 - random number between 0..4, 
        const rnd = random();

        // 2.2 - get a single country on selected country list
        const sortedCountry = randomAnswers[rnd]

        // 2.3 - save state
        this.setState({ sortedCountry: sortedCountry });

    }

    // reset timer after time has left or choose an option
    resetTimer = () => {
        // reset current timer
        clearInterval(this.timer);
        this.setState({ timeLeft: this.DEFAULT_TIMER_VALUE })

        //define a new time
        this.timer = setInterval(() => {
            let timeLeft = this.state.timeLeft - 1;
            if (timeLeft === 0) {
                // reset timer to default value
                timeLeft = this.DEFAULT_TIMER_VALUE;

                // if time limit is reached, WRONG
                this.setState({ wrongAnswers: this.state.wrongAnswers + 1 })

                this.selectCountries();

                // notify :(
                toast.error(`Time is over :-(`)

            } else if (timeLeft === 5) {
                // notify :(
                // toast.warning(`Hurry up!`)
            }
            this.setState({ timeLeft: timeLeft })
        }, 1000)
    }

    onCountrySelect = async (country) => {
        // current sorted country
        const { sortedCountry } = this.state

        const isTheRightAnswer = sortedCountry.name === country.name ? true : false;

        if (isTheRightAnswer) {
            this.setState({ rightAnswers: this.state.rightAnswers + 1 })
            toast.info(`Well Done! ${country.name} is the right Answer`)

        } else {
            this.setState({ wrongAnswers: this.state.wrongAnswers + 1 })
            toast.error(`Wrong Answer :-(. The correct one was ${sortedCountry.name} `)
        }

        // reset timer
        this.resetTimer()

        // select another flag and other answers options
        this.selectCountries();

        // call arduino API
        if (process.env.REACT_APP_ARDUINO || false) {
            const { data: result } = await http.arduino(isTheRightAnswer)
            console.log(`result arduino ${result.code}`)

        }
    }

    render() {

        const { randomAnswers, sortedCountry, timeLeft, rightAnswers, wrongAnswers } = { ...this.state };

        return (
            <React.Fragment>
                {!sortedCountry && !sortedCountry.flag && (
                    <div className="alert alert-danger justify-content-center" role="alert">
                        Something went wrong :-(
                    </div>
                )}
                {sortedCountry && sortedCountry.flag && (
                    <div>
                        <div className="card">
                            <div className="card-body">
                                <div className="row" id="score">
                                    <div className="card col-sm m-1">
                                        <div className="card-body">
                                            <h5 className="card-title">Score (right/wrong)</h5>
                                            <p className="card-text">{rightAnswers} / {wrongAnswers}</p>
                                        </div>
                                    </div>
                                    <div className="card col-sm m-1">
                                        <div className="card-body">
                                            <h5 className="card-title">Timeleft (seconds)</h5>
                                            <p className="card-text">{timeLeft}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card mt-2">
                            <div className="card-body">
                                <div className="row justify-content-center" id="countryFlag">
                                    <style>{`
                                div#countryFlags {
                                    border: 1px solid gray;
                                    padding: 5px;
                                    margin-bottom: 5px
                                }
                            `}</style>
                                    <img src={sortedCountry.flag} style={{ "height": "10rem", "border": "solid black 1px" }} alt="flag"></img>
                                </div>
                            </div>
                        </div>
                        <div className="card mt-2">
                            <div className="card-body">

                                <div className="row d-flex justify-content-center" id="countriesOptions">
                                    {randomAnswers.map((country, index) =>
                                        <CountryOption country={country} handleSelect={() => this.onCountrySelect(country)} key={index} />
                                    )}
                                    <style>{`
                            div#countriesOptionss {
                                border: 1px solid gray;
                                padding: 5px;
                                margin-bottom: 5px
                            }
                        `}</style>
                                </div>
                            </div>
                        </div>
                        <div className="mt-3">Source code available at Github <i className="fa fa-github">:<a href="https://github.com/rarruda-albuquerque/" target="_github">https://github.com/rarruda-albuquerque/</a></i></div>
                    </div>
                )}
            </React.Fragment>
        )
    }
}

export default FlagGameMain;