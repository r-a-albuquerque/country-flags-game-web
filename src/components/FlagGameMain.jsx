import React, { Component, Fragment } from "react";
import { toast } from "react-toastify";
import http from "../services/httpService"
import { uniqueRandomArray } from "../services/utils"
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

    async componentDidMount() {
        // get all countries from remote API
        const { data: countries } = await http.getCountries();
        this.setState({ countries: countries })

        this.selectCountries();

        this.resetTimer()

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
        const rnd = Math.round(Math.random() * 4);

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

            } else if (timeLeft == 5) {
                // notify :(
                // toast.warning(`Hurry up!`)
            }
            this.setState({ timeLeft: timeLeft })
        }, 1000)
    }

    onCountrySelect = (country) => {
        // current sorted country
        const { sortedCountry } = this.state

        if (sortedCountry.name === country.name) {
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
        if (this.ARDUINO)
            console.log("call arduino API")
    }

    render() {

        const { randomAnswers, sortedCountry, timeLeft, rightAnswers, wrongAnswers } = { ...this.state };

        return (
            <React.Fragment>
                <div className="card">
                    <div className="card-body">
                        <div className="row" id="score">
                            <div class="card col-sm m-1">
                                <div class="card-body">
                                    <h5 class="card-title">Score (right/wrong)</h5>
                                    <p class="card-text">{rightAnswers} / {wrongAnswers}</p>
                                </div>
                            </div>
                            <div class="card col-sm m-1">
                                <div class="card-body">
                                    <h5 class="card-title">Timeleft (seconds)</h5>
                                    <p class="card-text">{timeLeft}</p>
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
                            <img src={sortedCountry.flag} style={{ "height": "10rem", "border": "solid black 1px" }}></img>
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
            </React.Fragment>
        )
    }
}

export default FlagGameMain;