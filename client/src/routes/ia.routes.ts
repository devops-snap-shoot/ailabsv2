import axios, { AxiosRequestConfig } from 'axios'

const url = /* (window.location.host.includes('demo')) ? process.env.REACT_APP_SERVER_URL_DEMO_AILABS :  */process.env.REACT_APP_SERVER_URL 

export const uploadFile = async (file: File, userId: string, idFile: number, progress: any) => {
    const formData = new FormData()
    formData.append('files', file, file.name)
    formData.append('idFile', idFile.toString())
    formData.append('fileName', file.name)
    const config: AxiosRequestConfig = {
        headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': userId
        },
        onUploadProgress: progressEvent => progress(progressEvent, file.name, idFile)
    }
    const response = await axios.post(url+'/api/ia/upload_pdf', formData, config)
    return response.data
}

export const chat = async (message: string, userId: string, cache: any, idFile?: number, nameAvatar?: string, optimized?: string) => {
    const config = {
        headers: { 
            'Authorization': userId
        },
    }

    /* console.log({message: message, idFile: idFile.toString()}) */
    const response = await axios.post(url+'/api/ia/gemini-chat', {message: message, userId, cache/* , idFile: idFile.toString(), nameAvatar, optimized */}, config)
    console.log(response.data)
    return response.data
}

export const getAllMessages = async (userId: string) => {
    const response = await axios.get(url+`/api/ia/getAllMessages/${userId}`)
    console.log(response.data)
    return response.data
}

export const createNewContextAvatar = async (userId: string) => {
    const response = await axios.get(url+`/api/ia/createIaContext/${userId}`)
    console.log(response.data)
    return response.data
}

export const deleteFile = async (userId: string, idFile: number, nameFile: string) => {
    const config = {
        headers: {
            'Authorization': userId
        }
    }
    const response = await axios.post(url+'/api/ia/delete_pdf', {idFile: idFile.toString(), nameFile: nameFile}, config)
    return response.data
}

function containsSpecialChars(str: string) {
    const newString = str.replaceAll('ñ', '\u00f1').replaceAll('Ñ', '\u00d1')
    return newString;
  }

  function replaceAll(sentence: string, regx: any, replaceBy: string) {
    return sentence.replace(regx, replaceBy);
}