import axios from "axios"

const url = /* (window.location.host.includes('demo')) ? process.env.REACT_APP_SERVER_URL_DEMO_AILABS :  */process.env.REACT_APP_SERVER_URL 

export const getFilesByUserId = async (userId: string) => {
    const response = await axios.post(url+'/api/files/getFilesByUserId', {userId: userId})
    return response.data
}

export const getFilesByCompany = async (companyId: string) => {
    const response = await axios.post(url+'/api/files/getFilesByCompany', {companyId})
    return response.data
}

export const getFileByFileID = async (id: string) => {
    const response = await axios.get(url+`/api/files/getFileByFileID/${id}`)
    return response.data
}

export const getAllFiles = async () => {
    const response = await axios.get(url+'/api/files/getFiles')
    return response.data
}

export const updateFileById = async (fileData: any, userId: string) => {
    const config = {
        headers: { 
            'Authorization': userId
        },
    }
    const response = await axios.post(url+'/api/files/updateFileById', {fileData: fileData}, config)
    return response.data
}

export const deleteFile = async (fileData: any, userId: string) => {
    try {
        const config = {
            headers: { 
                'Authorization': userId
            },
        }
        const response = await axios.post(url+'/api/files/deleteFile', {fileData: fileData}, config)
        return response.data
    } catch (error) {
        return error
    }
}