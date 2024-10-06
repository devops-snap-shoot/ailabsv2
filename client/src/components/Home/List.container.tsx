import { useEffect, useState } from "react"
import { FilesData } from "../../interfaces/Files.interface"
import { useFilesContext } from "../../context/Files.context"
import { IonButton, IonButtons, IonContent, IonFabButton, IonIcon, IonItem, IonLoading, IonPopover, IonToolbar } from "@ionic/react"
import { Info, Logout, UploadCloud, User } from "../../icons"
import { t } from "i18next"
import { useAuthContext } from "../../context/Auth.context"
import { MessageFormat } from "../../interfaces/Messages.interface"
import { deleteFile, uploadFile } from '../../routes/ia.routes'
import { useMessagesContext } from "../../context/Messages.context"
import { timerOutline, trashOutline } from "ionicons/icons"
import ExclamationModal from "../../modals/Exclamation.modal"

export const ListContainer = () => {
    const {logout, userId, totalDocsByMonth, isPremium, styleCompany, user} = useAuthContext()
    const {messages, setMessages, setAvatarWeb, avatarWeb} = useMessagesContext()

    const {getFiles, files, setIdFile, setFileSelected, setWaitingLoad, setDisabledInput, waitingButtonLoad, waitWhileMessage, idFileInProcess} = useFilesContext()

    const [fileList, setFileList] = useState<FilesData[]>([])

    const [openLoading, setOpenLoading] = useState(false)
    const [openLoadingMessage, setOpenLoadingMessage] = useState(false)
    const [messageLoading, setMessageLoading] = useState('')
    const [isTotal, setTotal] = useState(false)

    const [openExclamation, setOpenExclamation] = useState(false)
    const [isOkExclamation, setIsOkExclamation] = useState(false)
    const [messageExclamation, setMessageExclamation] = useState('')
    const [loadPercent, setLoadPercent] = useState(0)

    useEffect(() => {
        if (files.length > 0) {
            setFileList(files)
        } else {
            setFileList([])
        }
    }, [files])

    

    /* const getFileToSend = async (e: any) => {
        if (e.target.files) {
            if (e.target.files[0])
            uploadFileToServer(e.target.files, true)
        }
    } */

    const progress = (e: any) => {
        setLoadPercent(e.progress * 100)
        setTotal((e.loaded === e.total) ? true : false)
    }

    /* const uploadFileToServer = async (files: FileList | null, newFile: boolean, idFileNumber?: number) => {
        if (files) {
            setOpenLoading(true)
            if (newFile) {
                setMessages([])
            }
            let idFile : number
            let saveFile = true
            if (!idFileNumber) {
                idFile = Date.now()
            } else {
                idFile = idFileNumber
                saveFile = false
            }
            setIdFile(idFile)
            try {
                setWaitingLoad(true)
                const response = await uploadFile(files[0], userId, idFile, progress)
                const filesCache = [...fileList, response.file]
                setDisabledInput(true)
                setFileList(filesCache)
                setOpenLoadingMessage(false)
                setMessageLoading('')
                setTotal(false)
                setOpenExclamation(true)
                setIsOkExclamation(true)
                setOpenLoading(false)
                setMessageExclamation('Your file has been processed')
                setTimeout(() => {
                    setOpenLoading(false)
                    setOpenExclamation(false)
                }, 2000);
                setTimeout(() => {
                    setOpenLoading(false)
                    setMessageExclamation('')
                }, 3000);
                setTimeout(() => {
                    const newMessage : MessageFormat = {
                        id: messages.length + 1,
                        user: '#bot',
                        message: `File ${files[0].name} in progress. please wait when the AI finishes`,
                        isNew: true,
                        removedBy: []
                    }
                    const messagesToAdd = newFile ? [] : messages
                    const messagesCache = [...messagesToAdd, newMessage]
                    setMessages(messagesCache)
                    if (saveFile) {
                        getBase64(files[0], idFile, messagesCache)
                    }
                }, 1000);
            } catch (error: any) {
                console.info(error)
                alert(`${error.code} - ${error.message}`)
            }
        }
    } */

    const getBase64 = (file: any, idFile: number, messages: MessageFormat[]) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = async () => {
          const fileToSave: FilesData = {
            id: idFile,
            file: reader.result?.toString() || '',
            name: file.name,
            userId: [userId],
            messages: messages,
            url: '',
            wait: true,
            state: true
          }
            setFileSelected(fileToSave)
            getFiles()
        }
        reader.onerror = (error) => {
            console.log(error)
        }
    }

    const closeExclamations = () => {
        setOpenExclamation(false)
    }

    const getFile = async (file: FilesData) => {
        if (confirm('Confirm that you want to change the document to process')) {
            setFileSelected(file)
        }
    }

    const removeFile = async (file: FilesData, index: number) => {
        if (confirm(`Confirm that you want to delete the document ${file.name}`)) {
            setWaitingLoad(true)
            try {
                const response = await deleteFile(userId, file.id, file.name)
                if (response) {
                    getFiles()
                    setMessages([])
                    setFileSelected(undefined)
                }
            } catch (error) {
                getFiles()
                setFileSelected(undefined)
            }
        }
    }

    const uploadPdf = () => {
        if (isPremium || (totalDocsByMonth < 2) || (user?.roles[0].name === 'admin')) {
            const elInput = document.getElementById('pdf-input')
            if (elInput) {
                elInput.click()
            }
        } else {
            setIsOkExclamation(false)
            setOpenExclamation(true)
            setMessageExclamation("Can't upload document. Upgrade your account.")
            setTimeout(() => {
                setOpenExclamation(false)
            }, 2000);
            setTimeout(() => {
                setMessageExclamation('')
            }, 3000);
        }
    }
    const goOut = () => {
        logout()
    }

    return (
        <div className='listContainer'>
            <IonLoading isOpen={openLoading} message={`${Math.trunc(loadPercent)}%`} />
            <IonLoading isOpen={openLoadingMessage} message={messageLoading} />
            <ExclamationModal
                open={openExclamation}
                isOk={isOkExclamation}
                message={messageExclamation}
                handleClose={closeExclamations}
            />
            <div className='listContainerItems'>
                <p className='titleList'>{t('homePage:myDocuments')}</p>
                {
                    fileList.map((file, i) => {
                        return (
                            <IonItem lines="none" key={i}>
                                <p title={file.name} className='ellipsis' style={{ color: (file.wait || waitWhileMessage) ? 'grey' : 'black' }} onClick={() => {(file.wait || waitWhileMessage) ? null : getFile(file)}}>{file.name}</p>
                                {(file.userId[0] === userId) ? <IonButtons slot='end'>
                                    {!waitWhileMessage && <IonButton className={`colorFont${styleCompany}`} shape="round" onClick={() => {file.wait ? alert('The file is being analyzed') : removeFile(file, i)}}>
                                        <IonIcon color={((idFileInProcess === file.id.toString())&&file.wait) ? 'warning' : ''} icon={file.wait ? timerOutline : trashOutline} />
                                    </IonButton>}
                                </IonButtons> : <IonButtons slot='end'>
                                    <IonButton className={`colorFont${styleCompany}`} shape="round" id={`click-info-popover-${i}`}>
                                        <IonIcon src={Info} />
                                    </IonButton>
                                    <IonPopover trigger={`click-info-popover-${i}`} triggerAction="click" showBackdrop={false}>
                                        <IonContent class="ion-padding">
                                            <p>{t('homePage:deleteOnlyMessage')}</p>
                                        </IonContent>
                                    </IonPopover>
                                </IonButtons>}
                            </IonItem>
                        )
                    })
                }
            </div>
            <div className={`uploadContainer uploadContainer${styleCompany}`}>
                <IonFabButton id="right-end" className='infoButton copy-icon' slot={'icon-only'}>
                    <IonIcon src={Info} />
                </IonFabButton>
                <IonPopover showBackdrop={false} trigger="right-end" side="right" alignment="start" className='popoverInfo'>
                    <IonContent>
                        <div style={{padding: 10}}>
                            <p className='popoverTitle'>File Type</p>
                            <p className='popoverText'>.PDF</p>
                            <p className='popoverTitle'>Max Size</p>
                            <p className='popoverText'>10 Pages/doc</p>
                            <p className='popoverTitle'>Max Weight</p>
                            <p className='popoverText'>5 Mb</p>
                            <p className='popoverTitle'>Total free limit</p>
                            <p className='popoverText'>5 docs/mo</p>
                        </div>
                    </IonContent>
                </IonPopover>
                <p /* style={{maxWidth: 194}} */ className={`colorFont${styleCompany}`}>
                    <strong>{t('homePage:dropLeyend')}</strong>
                </p>
                <img src={UploadCloud} alt='upload-cloud-logo' width={44} height={44} style={{marginTop: 13}} className={`filter${styleCompany}`} />
                <button className={`uploadButton ${(!waitingButtonLoad && !waitWhileMessage) ? `primaryColor${styleCompany}` : `primaryColorWait${styleCompany}`}`} disabled={waitingButtonLoad || waitWhileMessage} title='upload' onClick={uploadPdf}>
                    {t('homePage:uploadButton')}
                </button>
                <input /* onChange={getFileToSend} */ type='file' style={{display: 'none'}} id='pdf-input' accept='application/pdf' />
            </div>
            <IonToolbar>
                <IonPopover trigger="click-user-popover" side='top' triggerAction="click" /* dismissOnSelect={true}  */showBackdrop={false}>
                    <IonContent class="ion-padding">
                        {user && <div style={{width: '100%', textAlign: 'center'}}>
                            <h2>{user.name} {user.lastName}</h2>
                            <p>{user.email}</p>
                        </div>}
                    </IonContent>
                </IonPopover>
                <IonButtons slot='end'>
                    <IonButton title='Profile' id="click-user-popover" /* onClick={() => {alert('Developing user view')}} */>
                        <IonIcon src={User}/>
                    </IonButton>
                    <IonButton onClick={goOut} title='Logout'>
                        <IonIcon src={Logout}/>
                    </IonButton>
                    <IonButton disabled>
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        </div>
    )
}