import axios from 'axios'
const url = /* (window.location.host.includes('demo')) ? process.env.REACT_APP_SERVER_URL_DEMO_AILABS :  */process.env.REACT_APP_SERVER_URL 

const getAllRoles = async () => {
    const response = await axios.get(url+'/api/roles/getRoles')
    return response.data
}

const getRolesByCompany = async (companyId: any) => {
    const response = await axios.get(`${url}/api/roles/getRolesById/organization/${companyId._id}`)
    return response.data
}

export default {
    getAllRoles,
    getRolesByCompany
}