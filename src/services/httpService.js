import axios from "axios";
import { formatCountryName, stableIdForCountry } from "./utils";

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.error(error);
  }

  return Promise.reject(error);
});

function arduino(rightAnswer) {
  try {
    const body = { "rightAnswer": rightAnswer };

    const arduinoBackendEndpoint = process.env.REACT_APP_API_ARDUINO

    if (null === arduinoBackendEndpoint || arduinoBackendEndpoint == undefined) {
      throw new Error("API to connect with arduino is not defined")
    }

    const result = axios.post(arduinoBackendEndpoint, body);

    return result;
  } catch (ex) {
    console.error(ex)
    if (ex.response && ex.response.status === 404) {
      console.error("An unexpected error occurrred.");
    }
  }
}

async function getCountries() {
  try {
    const countriesEndpoint = process.env.REACT_APP_API_COUNTRY;

    if (null === countriesEndpoint || countriesEndpoint == undefined) {
      throw new Error("API to get countries information is not defined")
    }

    const { data } = await axios.get(countriesEndpoint);

    const normalized = (Array.isArray(data) ? data : []).map(raw => {
      // normalize name
      const name = (typeof raw.name === "string")
        ? raw.name
        : raw.name?.common || raw.name?.official || formatCountryName(raw) || null

      // normalize flags (support v2 and v3 shape)
      const png = raw.flags?.png || raw.flag || raw.flagPng || raw.flag_png || ""
      const svg = raw.flags?.svg || raw.flags?.svg || raw.flagSvg || raw.flag_svg || png || ""
      const flags = { png, svg }

      // capitals as array
      const capital = Array.isArray(raw.capital) ? raw.capital : (raw.capital ? [raw.capital] : [])

      const cca2 = raw.cca2 || raw.alpha2Code || null
      const cca3 = raw.cca3 || raw.alpha3Code || null
      const ccn3 = raw.ccn3 || null

      const id = stableIdForCountry({ cca3, ccn3, name })

      return {
        id,
        name,
        flags,
        cca2,
        cca3,
        ccn3,
        capital,
        population: raw.population || null,
        region: raw.region || null,
        raw // keep original payload for reference
      }
    })

    return { data: normalized };
  } catch (ex) {
    if (ex.response && ex.response.status === 404) {
      console.error("An unexpected error occurrred.");
    }
    throw ex;
  }
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  getCountries,
  arduino
};