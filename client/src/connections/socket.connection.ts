import { io } from "socket.io-client";

const socket = io()

const testConnectionSocket = () => {
    console.log('Pureba de Socket')
    /* socket.on(`isConnected`, () => { */
        /* socket.emit('isConnected',{messagge: 'Hello!!'}) */
    /* }) */
}

const listenPDF = (userId: string, getDataPDF: any) => {
    socket.on(`newPDF${userId}`, data => {
        console.log(data)
        if (data.data) {
            getDataPDF(data)
        }
    })
}

const listenIfIAisOperating = (setWaitingButtonLoad: any) => {
    socket.on(`isOperating`, data => {
        console.log(data)
        setWaitingButtonLoad(true)
    })
}

const listenIfIAisNotOperating = (setWaitingButtonLoad: any) => {
    socket.on(`isNotOperating`, data => {
        console.log(data)
        setWaitingButtonLoad(false)
    })
}

const getFilesIProcess = (setFileNumber: any, setIdFileInProcess: any) => {
    socket.on(`actualizationFilesInProcess`, data => {
        console.log(data)
        setFileNumber(data.totalInProcess)
        setIdFileInProcess(data.idFile)
    })
}

export default {
    testConnectionSocket,
    listenPDF,
    listenIfIAisOperating,
    listenIfIAisNotOperating,
    getFilesIProcess
}