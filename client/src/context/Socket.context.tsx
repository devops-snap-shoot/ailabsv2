import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from "socket.io-client";
import { useAuthContext } from './Auth.context';
import { useFilesContext } from './Files.context';

interface SocketType {
    notification: {
        isData: boolean,
        data: any
    },
    emitNotificationToUser: (data: any) => Promise<any>
    listenPDF: (userId: string, getDataPDF: any) => void
    waitAudio: any
    setWaitAudio: any
}

export const SocketContext = createContext<SocketType>({} as SocketType)

export const SocketProvider = (props: any) => {
    const {user} = useAuthContext()
    const {getFiles, fileSelected, setDisabledInput, setFileSelected} = useFilesContext()
    const [fileUpdated, setFileUpdated] = useState<any>()
    const urlLocal = (window.location.host.includes('demo')) ? process.env.REACT_APP_SERVER_URL_DEMO_AILABS : process.env.REACT_APP_SERVER_URL 
    const [notification, setNotification] = useState<{
        isData: boolean,
        data: any
    }>()
    const [socketLocal, setSocketLocal] = useState<Socket>()

    const [waitAudio, setWaitAudio] = useState({
        state: false,
        time: ''
    })

    useEffect(() => {
        if (urlLocal) {
            setSocketLocal(io(urlLocal))
        }
    }, [urlLocal])
    
    /* useEffect(() => {
        if (fileUpdated && fileSelected) {
            console.log(fileUpdated, fileSelected)
            if (fileSelected!.id === fileUpdated.id && !fileUpdated.wait) {
                setDisabledInput(false)
                setFileSelected(fileUpdated)
            }
        }
    }, [fileUpdated, fileSelected]) */


    useEffect(() => {
        if (socketLocal && user) {
            socketLocal!.on(`newPDF${user._id}`, data => {
                console.log(data)
                if (data.data) {
                    setFileUpdated(data.data)
                    new Notification(`Documento ${data.data.name} está listo.`)
                    getFiles()
                }
            })
            socketLocal!.on(`procesando`, data => {
                console.log(data)
                setWaitAudio({
                    state: true,
                    time: data.tiempo
                })
            })
        }
    }, [socketLocal, user])

    const values = {
        notification,
        waitAudio,
        setWaitAudio
    } as SocketType

    return (
        <SocketContext.Provider value={values}>
        {props.children}
        </SocketContext.Provider>
    )
}

export const useSocketContext = () => useContext(SocketContext)