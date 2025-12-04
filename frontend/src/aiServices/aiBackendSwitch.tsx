import axios from "axios"

const base_url = 'http://127.0.0.1:8000'

const StartBackend = () => {
    return axios.get(`${base_url}/start`)
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.error(error)
        })
}

const RestartBackend = () => {
    return axios.get(`${base_url}/restart`)
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.error(error)
        })
}

const StopBackend = () => {
    return axios.get(`${base_url}/stop`)
        .then(response => {
            console.log(response.data)
        })
        .catch(error => {
            console.error(error)
        })
}

export { StartBackend, RestartBackend, StopBackend}