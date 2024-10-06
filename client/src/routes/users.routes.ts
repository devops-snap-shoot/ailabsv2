import axios from 'axios'
import { UserInterface } from '../interfaces/Auth.interface'
const url = /* (window.location.host.includes('demo')) ? process.env.REACT_APP_SERVER_URL_DEMO_AILABS :  */process.env.REACT_APP_SERVER_URL 

const getUsers = async () => {
    const response = await axios.get(url+'/api/users/getUsers')
    return response.data
}

const getUsersByCompany = async (companyId: string) => {
    const response = await axios.get(`${url}/api/users/getUsersByCompany/${companyId}`)
    return response.data
}

const createUser = async (user: UserInterface) => {
    const response = await axios.post(`${url}/api/users/createUser`, user)
    return response.data
}

const editUser = async (user: UserInterface) => {
    console.log(user)
    const response = await axios.post(`${url}/api/users/editUser`, user)
    return response.data
}

const deleteUser = async (_id: string) => {
    const response = await axios.get(`${url}/api/users/deleteUser/${_id}`)
    return response.data
}

const getUserById = async (id: string) => {
    const response = await axios.post(`${url}/api/users/getUserById`, {id: id})
    return response.data
}

export default {
    getUsers,
    getUsersByCompany,
    createUser,
    editUser
}
