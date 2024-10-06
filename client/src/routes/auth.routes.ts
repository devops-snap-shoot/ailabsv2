import axios from 'axios'

const url = /* (window.location.host.includes('demo')) ? process.env.REACT_APP_SERVER_URL_DEMO_AILABS :  */process.env.REACT_APP_SERVER_URL 

const login = async (email: string, password: string, subdomain: string) => {
    const response = await axios.post(url+'/api/login', {email: email, password: password, subdomain: (subdomain.includes('localhost')) ? 'app' : subdomain})
    return response.data
}

const initForgotPassword = async (email: string, subdomain: string, logo: string, iconPage: string) => {
    const response = await axios.post(url+'/api/forgot-password', {email, subdomain, logo, iconPage})
    return response.data
}

const restorePassword = async (password: string, token: string) => {
    const response = await axios.post(url+'/api/reset-password', {password: password, token: token})
    return response.data
}

const verifyToken = async (token: string) => {
    const response = await axios.get(`${url}/api/verify-token/${token}`)
    return response.data
}

const verifyUserToken = async (token: string) => {
    const response = await axios.post(`${url}/api/verify`, {token: token})
    return response.data
}

export default {
    login,
    initForgotPassword,
    restorePassword,
    verifyToken,
    verifyUserToken
}