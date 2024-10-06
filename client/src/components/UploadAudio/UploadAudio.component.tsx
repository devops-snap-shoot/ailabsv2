import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonModal, IonRow, IonSpinner, IonTextarea } from "@ionic/react"
import { UploadIcon } from "../../icons"
import { useEffect, useState } from "react"
import { useAvatarContext } from "../../context/Avatar.context"
import { useHistory } from "react-router"
import { close } from "ionicons/icons"

export const UploadAudioComponent = () => {
    const {uploadAudioToAvatar} = useAvatarContext()
    const [audioWav, setAudioWav] = useState<any>()

    const [nameAvatar, setNameAvatar] = useState('')

    const [responseAvatar, setResponseAvatar] = useState('')

    const [audioCloned, setAudioCloned] = useState<any>()

    const [waitCloneAudio, setWaitCloneAudio] = useState(false)

    const [isOpen, setIsOpen] = useState(false);

    const [enablePassToHome, setEnablePassToHome] = useState(false)

    const history = useHistory()

    useEffect(() => {
        const dragComponent = document.getElementById('upload-file-component')
        if (dragComponent) {
            dragComponent.addEventListener('dragover', () => {
                dragComponent.style.border = '2px red solid'
            })
            dragComponent.addEventListener('dragleave', () => {
                dragComponent.style.borderWidth = '0px'
            })
        }
    }, [])


    useEffect(() => {
        if (audioWav) {
            console.log(audioWav)
            const reader = new FileReader();
            reader.onload = loadedCallback;
            reader.readAsDataURL( audioWav );
        }
    }, [audioWav])

    useEffect(() => {
        if (audioCloned) {
            setWaitCloneAudio(false)
            setIsOpen(true)
        }
    }, [audioCloned])

    const loadedCallback = (e: any) => {
        console.log(e)
        const audioTag = document.getElementById('audio') as HTMLAudioElement
        if (audioTag) {
            audioTag.src = e.srcElement.result
            setTimeout(() => {
                audioTag.play()
            }, 500);
        }
    }

    const closeAudio = () => {
        setIsOpen(false)
        setEnablePassToHome(true)
    }

    const uploadAudio = () => {
        const input = document.getElementById('audio-input')
        if (input) {
            input.click()
        }
    }

    function hasWhiteSpace(s: string) {
        return s.indexOf(' ') >= 0;
    }

    const sendAudioToServer = async () => {
        if (nameAvatar.length > 0) {
            if (audioWav) {
                if (responseAvatar.length > 0) {
                    if (!hasWhiteSpace(nameAvatar)) {
                        setWaitCloneAudio(true)
                        const response = await uploadAudioToAvatar(audioWav, nameAvatar, responseAvatar)
                        console.log(response)
                        if (response) {
                            const audioResponse = response.data.audio
                            if (audioResponse) {
                                setAudioCloned(audioResponse)
                            }
                        }
                    } else {
                        alert('Nombre de avatar no debe tener espacios')
                    }
                } else {
                    alert('Debe ingresar un texto que responda su voz clonada.')
                }
            } else {
                alert('No hay audio')
            }
        } else {
            alert('Debe ingresar un noombre al avatar')
        }
    }

    return (
        <IonContent style={{'--background':"#F6F6F6"}}>
            <div
                style={{position: 'absolute', display: isOpen ? 'block' : 'none', height: '100%', width: '100%', zIndex: 1000, backgroundColor: '#021111', opacity: 0.9}}
            >
                <IonButtons style={{position: 'absolute', top: 10, right: 10}}>
                    <IonButton onClick={closeAudio}>
                        <IonIcon icon={close} style={{color: 'white'}} />
                    </IonButton>
                </IonButtons>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                        </IonCol>
                        <IonCol>
                            <div style={{marginTop: '50vh', width: '100%', opacity: 1, backgroundColor: 'transparent'}}>
                                <audio id={'audio-fixed'} style={{width: '100%'}} src={audioCloned} autoPlay controls />
                            </div>
                        </IonCol>
                        <IonCol>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </div>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        
                    </IonCol>
                    <IonCol sizeXl="4" sizeLg="4" sizeMd="6" sizeSm="10" sizeXs="12">
                        <div
                            id={'upload-window'}
                            className="upload-window"
                        >
                            <input disabled={waitCloneAudio} id={'audio-input'} style={{display: 'none'}} type="file" accept="audio/x-wav; audio/wav" onChange={(e) => {(e.target.files && e.target.files[0]) ? setAudioWav(e.target.files[0]) : alert('No file')}} />
                            <div style={{textAlign: 'center'}}>
                                <p style={{fontSize: 22}}>Clonación de Voz (Modo Test)</p>
                            </div>
                            {
                                audioWav
                                ?
                                <div>
                                    <div className="uploaded-file">
                                        <audio id={'audio'} controls />
                                    </div>
                                </div>
                                :
                                <div>
                                    <p>1.- Lo primero que debes hacer es subir un audio con tu voz de formato WAV.</p>
                                    <div id={'upload-file-component'} className="upload-file-component" onClick={uploadAudio}>
                                        <img src={UploadIcon} style={{maxWidth: 70}} />
                                        <div style={{marginTop: 30}}>
                                            <p style={{fontSize: 16}}>
                                                {/* Drag & drop files or <a>Browse</a> */}
                                                Browse a file
                                            </p>
                                            <p style={{fontSize: 12, color: '#676767'}}>
                                                Supported formates: WAV
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            }
                            <div>
                                {
                                    (audioWav && !waitCloneAudio) &&
                                    <p>2.- Ahora ingresa un nombre, simulando que es el avatar y luego un texto de lo que quieres que diga con un máximo de 100 carácteres. Al terminar presiona el botón <b>UPLOAD</b></p>
                                }
                                <br />
                                <IonInput 
                                    disabled={waitCloneAudio} 
                                    type={'text'} 
                                    onIonInput={(e) => {
                                        if (typeof e.target.value === 'string') {
                                            setNameAvatar(e.target.value)
                                        }
                                    }}
                                    value={nameAvatar}
                                    label="Name Avatar"
                                    labelPlacement="floating"
                                    fill="outline"
                                    placeholder="Name Avatar"

                                />
                                <br />
                                <IonTextarea
                                    disabled={waitCloneAudio} 
                                    counter={true}
                                    counterFormatter={(inputLength, maxLength) => `${maxLength - inputLength} / ${maxLength}`}
                                    rows={4}
                                    maxlength={100}
                                    label="Text Voice Response"
                                    labelPlacement="floating"
                                    fill={'outline'}
                                    placeholder="Text Voice Response"
                                    onIonInput={(e) => {
                                        if (typeof e.target.value === 'string') {
                                            setResponseAvatar(e.target.value)
                                        }
                                    }}
                                    value={responseAvatar}
                                />
                            </div>
                            <br />
                            <div style={{textAlign: 'center'}}>
                                {
                                    waitCloneAudio &&
                                    <p>
                                        3.- Espera que la plataforma responda con el audio clone de tu voz.
                                    </p>
                                }
                                {
                                    enablePassToHome && 
                                    <p>
                                        4.- Ahora puedes navegar al inicio de K-Eternal, donde puedes Chatear con don Ricardo Valdés.
                                    </p>
                                }
                                <IonRow>
                                {!enablePassToHome && 
                                <IonCol>
                                    <button
                                        disabled={waitCloneAudio} 
                                        onClick={sendAudioToServer}
                                        style={{backgroundColor: '#333A4D', color: 'white', maxWidth: 200, fontSize: 18, padding: '0px 14px', borderRadius: 4, height: 34}}
                                        >
                                            <IonRow>
                                                {waitCloneAudio &&  
                                                <IonCol>
                                                    <IonSpinner style={{color: 'white'}} />
                                                </IonCol>}
                                                <IonCol>
                                                <p style={{margin: '6px 0px', marginLeft: 5}}>
                                                UPLOAD
                                                </p>
                                                </IonCol>
                                            </IonRow>
                                        </button>
                                </IonCol>
                                }
                                {
                                    (enablePassToHome || (localStorage.getItem('readyToHome'))) &&
                                        <IonCol>
                                            <button
                                            onClick={() => {localStorage.setItem('readyToHome', 'ok'); history.replace('/home/1723406552933')}}
                                            style={{backgroundColor: '#333A4D', color: 'white', maxWidth: 106, fontSize: 18, padding: '0px 14px', borderRadius: 4, height: 34}}
                                        >
                                            GO TO HOME
                                        </button>
                                        </IonCol>
                                }
                                </IonRow>
                                
                            
                                

                            </div>
                        </div>
                    </IonCol>
                    <IonCol>
                        
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}