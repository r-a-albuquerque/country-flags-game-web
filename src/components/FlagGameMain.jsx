import React, { Component } from "react";
import { toast } from "react-toastify";
import http from "../services/httpService"
import { pickRandomOptions, formatCountryName } from "../services/utils"
import CountryOption from "./CountryOption"

class FlagGameMain extends Component {

    DEFAULT_TIMER_VALUE = 15;

    timer = null
    _isMounted = false

    state = {
        countries: [],
        sortedCountry: null,
        randomAnswers: [],
        rightAnswers: 0,
        wrongAnswers: 0,
        timeLeft: this.DEFAULT_TIMER_VALUE,

    }

    // use formatCountryName from utils instead of an inline helper

    componentDidMount = async () => {
        this._isMounted = true
        try {
            // get all countries from remote API
            const { data: countries } = await http.getCountries();
            if (!this._isMounted) return
            this.setState({ countries }, () => {
                this.selectCountries();
                this.resetTimer()
            })
        } catch (error) {
            throw error;
        }
    }

    selectCountries = () => {
        const { countries } = this.state;
        const { options, selectedIndex } = pickRandomOptions(countries, 5)

        const sortedCountry = options.length > 0 ? options[selectedIndex] : null

        this.setState({ randomAnswers: options, sortedCountry })
    }

    // reset timer after time has left or choose an option
    resetTimer = () => {
        clearInterval(this.timer);
        this.setState({ timeLeft: this.DEFAULT_TIMER_VALUE })

        this.timer = setInterval(() => {
            this.setState(prev => {
                let nextTime = prev.timeLeft - 1
                if (nextTime === 0) {
                    nextTime = this.DEFAULT_TIMER_VALUE
                    toast.error(`Time is over :-(`)
                    this.selectCountries()
                    return { timeLeft: nextTime, wrongAnswers: prev.wrongAnswers + 1 }
                }
                return { timeLeft: nextTime }
            })
        }, 1000)
    }

    onCountrySelect = async (country) => {
        // current sorted country
        const { sortedCountry } = this.state

        const sortedCountryName = formatCountryName(sortedCountry)
        const selectedCountryName = formatCountryName(country)

        const isTheRightAnswer = sortedCountryName === selectedCountryName

        if (isTheRightAnswer) {
            this.setState(prev => ({ rightAnswers: prev.rightAnswers + 1 }))
            toast.info(`Well Done! ${selectedCountryName} is the right Answer`)

        } else {
            this.setState(prev => ({ wrongAnswers: prev.wrongAnswers + 1 }))
            toast.error(`Wrong Answer :-(. The correct one was ${sortedCountryName} `)
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
                {!sortedCountry || !sortedCountry.flags || !sortedCountry.flags.png ? (
                    <div className="alert alert-danger justify-content-center" role="alert">
                        Something went wrong :-(
                    </div>
                ) : null}
                {sortedCountry && sortedCountry.flags && (
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
                                    <img src={sortedCountry.flags.png} style={{ "height": "10rem", "border": "solid black 1px" }} alt="flag"></img>
                                </div>
                            </div>
                        </div>
                        <div className="card mt-2">
                            <div className="card-body">

                                <div className="row d-flex justify-content-center" id="countriesOptions">
                                    {randomAnswers.map((country, index) =>
                                        <CountryOption country={country} handleSelect={() => this.onCountrySelect(country)} key={country.id || index} />
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