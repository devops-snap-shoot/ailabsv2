import { IonButton, IonButtons, IonCheckbox, IonCol, IonContent, IonGrid, IonIcon, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/react"
/* import { useFilesContext } from "../../../context/Files.context" */
import { useEffect, useRef, useState } from "react"
/* import { UserInterface } from "../../../interfaces/Auth.interface" */
import { personAdd, trash } from "ionicons/icons"
/* import { useUsersContext } from "../../../context/Users.context"
import { FilesData } from "../../../interfaces/Files.interface"
import { AddUserToFileModal } from "../../Modal/AddUserToFile.modal"
import { deleteFile } from "../../../routes/files.routes" */
import { t } from "i18next"
import { useAuthContext } from "../../context/Auth.context"
import { useUsersContext } from "../../context/Users.context"
import { useFilesContext } from "../../context/Files.context"
import { FilesData } from "../../interfaces/Files.interface"
import { UserInterface } from "../../interfaces/Auth.interface"
import { deleteFile } from "../../routes/files.routes"
import { uploadFile } from "../../routes/ia.routes"
import { AddUserToFileModal } from "../Modal/AddUserToFile.modal"
import { Add } from "../../icons"
/* import { Add } from "../../../icons"
import { uploadFile } from "../../../routes/ia.routes"
import { useAuthContext } from "../../../context/Auth.context"
 */
export const FilesContainer = () => {
    const {userId, isSmartPhone} = useAuthContext()
    const {users} = useUsersContext()
    const {files, updateFileSelected, getFiles} = useFilesContext()
    const [isOpen, setIsOpen] = useState(false);
    const [fileSelected, setFileSelected] = useState<FilesData>()
    const [filesToList, setFilesToList] = useState<any[]>([])
    const [allFilesSelected, setAllFilesSelected] = useState<boolean>(false)
    const [loadPercent, setLoadPercent] = useState(0)
    const [isTotal, setTotal] = useState(false)

    useEffect(() => {
        const filesCache = [...files]
        if (allFilesSelected) {
            filesCache.forEach((file: any) => {
                file.checked = true
            })
            setFilesToList(filesCache)
        } else {
            filesCache.forEach((file: any) => {
                file.checked = false
            })
            setFilesToList(filesCache)
        }
    }, [files, allFilesSelected])

    const assignToUser = (file: any) => {
        setFileSelected(file)
        setIsOpen(true);
    }

    const userSelected = (user: UserInterface) => {
        if (fileSelected) {
            const users = [...fileSelected.userId]
            const usersToSave = users.map((user: any) => {
                return user._id
            })
            usersToSave.push(user._id)
            fileSelected.userId = [...usersToSave]
            updateFileSelected(fileSelected)
            setIsOpen(false)
        }
    }

    const removeFile = async (file: any) => {
        if (window.confirm(`${t('confirm:removeFile')}`)) {
            const response = await deleteFile(file, file.userId[0]._id)
            getFiles()
        }
    }

    const modal = useRef<HTMLIonModalElement>(null);

    const confirm = () => {
        setIsOpen(false)
    }

    const checkFile = (checked: boolean, index: number) => {
        const filesCahce = [...filesToList]
        filesCahce[index].checked = checked
        setFilesToList(filesCahce)
    }


    const openGetFile = () => {
        const inputPdf = document.getElementById('file-pdf')
        if (inputPdf) {
            inputPdf.click()
        }
    }

    const getFile = async (e: any) => {
        console.log(e.target.files)
        if (e.target.files[0]) {
            const file = e.target.files[0]
            const response = await uploadFile(file, userId, Date.now(), progress)
            console.log(response)
        }
    }

    const progress = (e: any) => {
        console.log(e)
        setLoadPercent(e.progress * 100)
        setTotal((e.loaded === e.total) ? true : false)
    }
    
    return (
        <IonContent>
       {isOpen && <AddUserToFileModal
            isOpen={isOpen}
            modal={modal}
            setIsOpen={setIsOpen}
            confirm={confirm}
            users={users}
            fileSelected={fileSelected}
            userSelected={userSelected}
       />}
        <div className={`${isSmartPhone ? '' : 'padding-30 padding-left-120 '}`}>  
            {/* <IonToolbar>
                <IonTitle>
                Files Management
                </IonTitle>
                <IonButton slot="end">
                    Upload File
                </IonButton>
            </IonToolbar>   */}        
            <IonGrid>
                <IonRow style={{height: 31.42}}>
                    <IonTitle style={{padding: 0}}>
                    Files Management
                    </IonTitle>
                </IonRow>
                <IonRow style={{height: 56}}>
                    <IonToolbar style={{height: 56}}>
                            <IonButton fill="clear" className="create-user-button" slot="end" onClick={openGetFile}>
                                <IonIcon icon={Add} />
                                Create New User
                            </IonButton>
                            {/* <IonButton fill="clear" className="create-user-button" slot="end">
                                <IonIcon icon={ellipsisVertical}/>
                            </IonButton> */}
                    </IonToolbar>
                </IonRow>
                <input id={'file-pdf'} style={{display: 'none'}} onChange={getFile} type="file" accept="application/pdf"/>
                {/* <IonRow style={{height: 31.42}}>
                    <IonTitle style={{padding: 0}}>
                        
                    </IonTitle>
                </IonRow>
                <IonRow style={{height: 56}}>
                    
                </IonRow> */}
                <IonRow style={{height: 31.42}} className="border-bottom-line">
                    <IonCol sizeXs="0.5">
                        <IonCheckbox onIonChange={(e) => {setAllFilesSelected(e.detail.checked)}} checked={allFilesSelected}/>
                    </IonCol>
                    <IonCol sizeXs="4">
                        <IonText>
                            NAME    
                        </IonText>          
                    </IonCol>
                    <IonCol sizeXs="1">
                        <IonText>
                            URL    
                        </IonText>
                    </IonCol>
                    <IonCol sizeXs="2">
                        <IonText>
                            USERS    
                        </IonText>
                    </IonCol>
                    <IonCol sizeXs="2">
                        <IonText>
                            CREATED AT    
                        </IonText>
                    </IonCol>
                    <IonCol sizeXs="1.25">
                        <IonText>
                            STATE    
                        </IonText>
                    </IonCol>
                    <IonCol sizeXs="1.25">
                        <IonText>
                            ACTIONS    
                        </IonText>
                    </IonCol>
                </IonRow>
            </IonGrid>
            <IonGrid style={{overflowY: 'auto', height: '77vh'}}>
                {
                    filesToList.map((file, i) => {
                        return (
                            <IonRow key={`row_${i}`} style={{minHeight: 48, marginTop: 10}}>
                                <IonCol sizeXs="0.5">
                                    <IonCheckbox checked={file.checked} onIonChange={(e) => {checkFile(e.detail.checked, i)}} />
                                </IonCol>
                                <IonCol sizeXs="4">
                                    <IonText>
                                        {file.name}
                                    </IonText>
                                </IonCol>
                                <IonCol sizeXs="1">
                                    <a href={file.url}>Link</a>
                                </IonCol>
                                <IonCol sizeXs="2">
                                    {
                                        file.userId.map((user: any, i: number) => {
                                            const userData = user as UserInterface
                                            return (
                                                <p style={{margin: '5px 0px'}} key={i}>
                                                    {userData.name} {userData.lastName}
                                                </p>
                                            )
                                        })
                                    }
                                </IonCol>
                                <IonCol sizeXs="2">
                                    <IonText>
                                        {file.createdAt ? `${new Date(file.createdAt).toLocaleString()}` : 'No information'}
                                    </IonText>
                                </IonCol>
                                <IonCol sizeXs="1.25">
                                    {
                                        file.state ?
                                        <div style={{border: '2px solid #27AE60', color: '#27AE60', borderRadius: 5, textAlign: 'center'}}>
                                            <p style={{margin: 0}}>ACTIVE</p>
                                        </div>
                                        :
                                        <div style={{color: '#909090', backgroundColor: '#909090', borderRadius: 5, textAlign: 'center'}}>
                                            <p style={{margin: 0}}>INACTIVE</p>
                                        </div>
                                    }
                                </IonCol>
                                <IonCol sizeXs="1.25">
                                    <IonButtons style={{marginLeft: 10}}>
                                        <IonButton className="buttonActions" shape="round" onClick={(e: any) => {assignToUser(file)}}>
                                            <IonIcon slot="icon-only" icon={personAdd}/>
                                        </IonButton>
                                        <IonButton color={'danger'} className="buttonActions" shape="round" onClick={() => {removeFile(file)}}>
                                            <IonIcon slot="icon-only" icon={trash}/>
                                        </IonButton>
                                    </IonButtons>
                                </IonCol>
                            </IonRow>
                        )
                    })
                }
            </IonGrid>
        </div>
        </IonContent>
    )
}