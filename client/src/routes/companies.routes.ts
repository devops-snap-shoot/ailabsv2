import axios from 'axios'

const url = /* (window.location.host.includes('demo')) ? process.env.REACT_APP_SERVER_URL_DEMO_AILABS :  */process.env.REACT_APP_SERVER_URL 

const getCompanies = async () => {
    const response = await axios.get(url+'/api/organization/getOrganizations')
    return response.data
}

export default {
    getCompanies
}