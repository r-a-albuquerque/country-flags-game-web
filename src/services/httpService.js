import axios from "axios";

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

function getCountries() {
  try {
    const countriesEndpoint = process.env.REACT_APP_API_COUNTRY;

    if (null === countriesEndpoint || countriesEndpoint == undefined) {
      throw new Error("API to get countries information is not defined")
    }

    const result = axios.get(countriesEndpoint);
    return result;
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