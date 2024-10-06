import { createContext, useContext, useEffect, useState } from "react";
import { FilesData } from "../interfaces/Files.interface";
import { useMessagesContext } from "./Messages.context";
import { getAllFiles, getFileByFileID, getFilesByCompany, getFilesByUserId, updateFileById } from "../routes/files.routes";
import { useAuthContext } from "./Auth.context";
import { useHistory } from "react-router";

interface FilesType {
    files: FilesData[]
    setFiles: React.Dispatch<React.SetStateAction<FilesData[]>>
    getFiles: () => void
    setIdFile: React.Dispatch<React.SetStateAction<number>>
    idFile: number
    fileSelected?: FilesData
    setFileSelected: React.Dispatch<React.SetStateAction<FilesData | undefined>>
    updateFileSelected: (fileSelected: FilesData) => Promise<void>
    waitingLoad: boolean
    setWaitingLoad: React.Dispatch<React.SetStateAction<boolean>>
    waitingButtonLoad: boolean
    setWaitWhileMessage: React.Dispatch<React.SetStateAction<boolean>>
    waitWhileMessage: boolean
    totalFilesInProcess: number
    idFileInProcess: string
    setDisabledInput: React.Dispatch<React.SetStateAction<boolean>>
    disabledInput: boolean
    findFileByNumberID: (id: string) => void
}


export const FilesContext = createContext<FilesType>({} as FilesType)

export const FilesProvider = (props: any) => {
    const {userId, isAuth, user, userInvited, setEnableNavbar, companyId} = useAuthContext()
    const {messages} = useMessagesContext()
    const [files, setFiles] = useState<FilesData[]>([])
    const [idFile, setIdFile] = useState<number>(0)
    const [fileSelected, setFileSelected] = useState<FilesData>()
    const [waitingLoad, setWaitingLoad] = useState(true)
    const [waitingButtonLoad, setWaitingButtonLoad] = useState(true)
    const [waitWhileMessage, setWaitWhileMessage] = useState(false)
    const [totalFilesInProcess, setTotalFilesInProcess] = useState(0)
    const [idFileInProcess, setIdFileInProcess] = useState('')
    const [disabledInput, setDisabledInput] = useState(true)

    const history = useHistory()

    useEffect(() => {
        console.log('*****************************CANTIDAD DE ELEMENTOS EN REVISIÓN: ', totalFilesInProcess)
        console.log('*****************************ARCHIVO EN REVISIÓN: ', idFileInProcess)
    },[totalFilesInProcess, idFileInProcess])

    useEffect(() => {
        console.log(files)
        if (files.length > 0) {
            setFileSelected(files[0])
        }
    }, [files])

    useEffect(() => {
        if (fileSelected) {
            console.log(fileSelected)
            const fileToSend = {
                id: fileSelected.id,
                messages: fileSelected.messages,
                name: fileSelected.name,
                state: fileSelected.state,
                userId: fileSelected.userId,
                wait: fileSelected.wait
            } as FilesData
            setWaitingLoad(fileToSend.wait)
        }
    }, [fileSelected])

    useEffect(() => {
        if (messages)
        if (messages.length > 0 && fileSelected) {
            const fileSelectedCache = fileSelected
            fileSelectedCache.messages = messages
        }
    }, [messages])

    const findFileByNumberID = async (id: string) => {
        const response = await getFileByFileID(id)
        console.log(response)
        if (response.avatar) {
            if (response.avatar.doc) {
                setFileSelected(response.avatar.doc)
            }
        } else {
            setEnableNavbar(false)
            alert('Token no se reconoce.')
            history.replace('/login')
        }
    }

    const updateFileSelected = async (fileSelectedData: FilesData) => {
        setWaitingLoad(true)
        try {
            const response = await updateFileById(fileSelectedData, fileSelectedData.userId[0]._id)
            if (response) {
                getFiles()
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (isAuth && user) {
            getFiles()
            
        }
    },[isAuth, user])

    useEffect(() => {
        if (userInvited) {
            findFileByNumberID(userInvited.chatId)
        }
    }, [userInvited])

    const getFiles = async () => {
        if (user) {
            if (user.roles && user.roles[0].name==='SuperAdmin') {
                const response = await getAllFiles()
                console.log(response)
                if (response.files) {
                    setFileSelected(response.files[0])
                    if (response.files.length > 0) {
                        let waitCache = false
                        response.files.forEach((file: any) => {
                            if (file.wait) {
                                waitCache = false
                            }
                        })
                        setWaitingButtonLoad(waitCache)
                        setFiles(response.files)
                    } else {
                        setWaitingButtonLoad(false)
                        setFiles([])
                    }
                } else {
                    setWaitingButtonLoad(false)
                    setFiles([])
                }
            } else {
                if (companyId.length > 0) {
                    const response = await getFilesByCompany(companyId)
                    console.log(response)
                    if (response.files) {
                        if (response.files.length > 0) {
                            let waitCache = false
                            response.files.forEach((file: any) => {
                                if (file.wait) {
                                    waitCache = false
                                }
                            })
                            setWaitingButtonLoad(waitCache)
                            setFiles(response.files)
                        } else {
                            setWaitingButtonLoad(false)
                            setFiles([])
                        }
                    } else {
                        setWaitingButtonLoad(false)
                        setFiles([])
                    }
                }
                
            }
        }
    }


    const value = {
        files,
        setFiles,
        getFiles,
        setIdFile,
        idFile,
        fileSelected,
        setFileSelected,
        updateFileSelected,
        waitingLoad,
        setWaitingLoad,
        waitingButtonLoad,
        setWaitWhileMessage,
        waitWhileMessage,
        totalFilesInProcess,
        idFileInProcess,
        disabledInput,
        setDisabledInput,
        findFileByNumberID
    }

    return (
        <FilesContext.Provider value={value} >
            
            {props.children}
        </FilesContext.Provider>
    )
}

export const useFilesContext = () => useContext(FilesContext)