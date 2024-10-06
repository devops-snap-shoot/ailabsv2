import axios, { AxiosRequestConfig } from 'axios'

const url = /* (window.location.host.includes('demo')) ? process.env.REACT_APP_SERVER_URL_DEMO_AILABS :  */process.env.REACT_APP_SERVER_URL 

export const uploadImage = async (file: any, userId: string, progress: any) => {
    const formData = new FormData()
    formData.append('files', file)
    const config: AxiosRequestConfig = {
        headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': userId
        },
        onUploadProgress: progressEvent => progress(progressEvent)
    }
    const response = await axios.post(url+'/api/images/upload_image', formData, config)
    return response.data
}