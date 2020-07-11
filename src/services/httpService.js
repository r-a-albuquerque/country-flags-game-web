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

function getCountries() {
  try {
    const getCountriesEndPoint = process.env.REACT_APP_COUNTRIES_ENDPOINT || "https://restcountries.eu/rest/v2/all";

    const result = axios.get(getCountriesEndPoint);
    return result;
  } catch (ex) {
    console.error(ex)
    if (ex.response && ex.response.status === 404) {
      console.error("An unexpected error occurrred.");
    }
  }
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  getCountries
};