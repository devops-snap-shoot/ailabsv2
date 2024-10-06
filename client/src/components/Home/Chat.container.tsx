import { IonAlert, IonButton, IonButtons, IonCheckbox, IonCol, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonRow, IonSpinner, IonToolbar } from '@ionic/react'
import { Mic, Send } from '../../icons'
import { t } from 'i18next'
import { useEffect, useState } from 'react'
import { useAuthContext } from '../../context/Auth.context'
import { useMessagesContext } from '../../context/Messages.context'
import { MessageFormat } from '../../interfaces/Messages.interface'
import { chat } from '../../routes/ia.routes'
import { useFilesContext } from '../../context/Files.context'
import PDFModal from '../../modals/PDF.modal'
import { FilesData } from '../../interfaces/Files.interface'
import { pause, play, stop, barcodeOutline, volumeOffOutline, volumeHighOutline, volumeMuteOutline } from 'ionicons/icons'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useAvatarContext } from '../../context/Avatar.context'
import axios from 'axios'
import { useSocketContext } from '../../context/Socket.context'

const ChatContainer = () => {
    const {userId, initials, setAvatarSelected, isSmartPhone, apiKeyElevenLabs, userInvited, user} = useAuthContext()
    const {waitAudio, setWaitAudio} = useSocketContext()
    const {messages, avatarWeb, unableChat} = useMessagesContext()
    const {fileSelected, setDisabledInput, setWaitWhileMessage} = useFilesContext()
    const {elevenLabsVoiceId, nameAvatar, setEnableAvatar, enableAvatar, avatarElement, setAvatarElement, optimized, setOptimized} = useAvatarContext()
    const [messagesToUse, setMessagesToUse] = useState<MessageFormat[]>([])
    const [waitResponse, setWaitResponse] = useState(false)
    const [avatarSpeaking, setAvatarSpeaking] = useState(false)
    const [avatarPaused, setAvatarPaused] = useState(true)
    const {transcript,listening} = useSpeechRecognition()
    const [openFileReader, setOpenFileReader] = useState(false)
    const [message, setMessage] = useState('')
    const [audioMessage, setAudioMessage] = useState('')
    const [referenceSelected, setReferenceSelectec] = useState<{page_content: string, metadata: any}>()
    const [audio, setAudio] = useState<HTMLAudioElement>()
    const [loadingAudio, setLoadingAudio] = useState(false)

    const [cache, setCache] = useState()

    const [enableAudio, setEnableAudio] = useState(false)

    const [messageQuota, setMessageQuota] = useState('')

    const [quota, setQuota] = useState({
        limit: 0,
        remaining: 0
    })

    const [showQuota, setShowQuota] = useState(false)

    useEffect(() => {
        if (enableAvatar) {
            const element: HTMLVideoElement = document.getElementById('container-avatar') as HTMLVideoElement
            if (element) {
                setAvatarElement(element)
            }
        } else {
            if (avatarElement) {
                avatarElement.pause()
                setAvatarElement(undefined)
            }
        }
    }, [enableAvatar])

    useEffect(() => {
        if (waitResponse) {
            const el = document.getElementById('chatMain')
            if (el) {
                el.scrollTop = el.scrollHeight
            }
        }
    }, [waitResponse])

    useEffect(() => {
        if (audio) {
            setLoadingAudio(false)
            audio.play();
            audio.addEventListener('playing', () => {
                setAvatarSpeaking(true)
                playSpeackAvatar()
            })
            audio.addEventListener('pause', () => {
                setAvatarSpeaking(false)
                stopSpeackAvatar()
            })
            audio.addEventListener('ended', () => {
                setAvatarSpeaking(false)
                stopSpeackAvatar()
            })
        }
    }, [audio])

    useEffect(() => {
        if (avatarElement && nameAvatar) {
            avatarElement.src = `/assets/videos/avatar-${nameAvatar}-standby.webm`
            if (avatarElement.src) {
                setTimeout(() => {
                    console.log('avatar play')
                    avatarElement.play()
                }, 1000);
            }
        }
    }, [nameAvatar])

    const stopSpeackAvatar = () => {
        if (avatarElement) {
            avatarElement.pause()
            avatarElement.src = `/assets/videos/avatar-${nameAvatar}-standby.webm`
            setTimeout(() => {
                avatarElement.play()
                if (audio && audio.played) {
                    audio.pause()
                    setAudio(undefined)
                }
                setAvatarSpeaking(false)
            }, 100);
        }
    }

    const playSpeackAvatar = () => {
        if (avatarElement) {
            avatarElement.pause()
            avatarElement.src = `/assets/videos/avatar-${nameAvatar}-speak.webm`
            avatarElement.play()
            setAvatarSpeaking(true)
            setAvatarPaused(false)
        }
    }

    useEffect(() => {
        if (messagesToUse) {
            console.log(messagesToUse)
            if (messagesToUse.length > 0) {
                const el = document.getElementById('chatMain')
                if (el) {
                    el.scrollTop = el.scrollHeight
                }
                if (messagesToUse.length === 1) {
                    const response = messagesToUse[0]
                    const newMessage = {
                        id: response.id,
                        message: '',
                        user: '#bot',
                        reference: [] ,
                        isNew: true,
                        removedBy: [],
                        audio: response.audio,
                        cache: response.cache
                    }
                    setCache(response.cache)
                    let textIndex = 0
                    const text : string = response.message
                    if (newMessage.audio) {
                        setTimeout(() => {
                            const audioCache = new Audio(newMessage.audio);
                            setWaitAudio({state: false, time: ''})
                            setAudio(audioCache)
                        }, 1000);
                    }
                    setWaitWhileMessage(false)
                    const interval = setInterval(() => {
                        textIndex = textIndex + 1
                        const newText = text.replace(/(?<![{[?}\]])\[(?!\s)(.+?)\]/g, '').substring(0, textIndex)
                        const el = document.getElementById('chatMain')
                        const paragraph = document.getElementById(`messageText_${newMessage.id}`)
                        if (paragraph) {
                            paragraph.innerHTML = urlify(`<p>${newText.replace(/(?<![{[?}\]])\*(?!\s)(.+?)\*/g, '<b>$1</b>')}</p>`
                            .replaceAll('\n* ', '\n- ')
                            .replaceAll('* <b>', '- <b>')
                            .replaceAll('<b>*', '<b>')
                            .replaceAll('</b>*', '</b>'))
                            .replaceAll('(<a', '<a')
                            .replaceAll(')</a>', '</a>')
                            .replaceAll(')"', '"')
                            if (el) {
                                el.scrollTop = el.scrollHeight
                            }
                            if (textIndex === text.length) {
                                clearInterval(interval)
                            }
                        }
                    }, 50)
                } else {
                    messagesToUse.forEach((message, index) => {
                        const newText = message.message.replace(/(?<![{[?}\]])\[(?!\s)(.+?)\]/g, '')
                        const paragraph = document.getElementById(`messageText_${message.id}`)
                        if (paragraph) {
                            paragraph.innerHTML = urlify(`<p>${newText.replace(/(?<![{[?}\]])\*(?!\s)(.+?)\*/g, '<b>$1</b>')}</p>`
                            .replaceAll('\n* ', '\n- ')
                            .replaceAll('* <b>', '\n- <b>')
                            .replaceAll('<b>*', '<b>')
                            .replaceAll('</b>*', '</b>'))
                            .replaceAll('(<a', '<a')
                            .replaceAll(')</a>', '</a>')
                            .replaceAll(')"', '"')
                            if (el) {
                                el.scrollTop = el.scrollHeight
                            }
                        }
                    })
                    setCache(messagesToUse[messagesToUse.length - 1].cache)
                }
            }
        }
    }, [messagesToUse])

    useEffect(() => {
        if (messages) {
            setMessagesToUse(messages)
        }
    }, [messages])


    const closeDocumentReference = () => {
        setOpenFileReader(false)
    }

    const newMessageData = (e: any) => {
        e.preventDefault();
        addMessage()
    }

    const urlify = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => {
          return '<a style="color: blue;" target="_blank" href="' + url + '">' + url + '</a>';
        })
    }

    const addMessage = async () => {
        setWaitWhileMessage(true)
        if (message.length > 0) {
            const newMessage = {
                id: Date.now(),
                message: message,
                user: userInvited ? `${userInvited.name}` : initials,
                isNew: true,
                removedBy: []
            }
            const messagesCache = [...messagesToUse!, newMessage]
            setMessagesToUse(messagesCache)
            setMessage('')
            setTimeout(() => {
                const el = document.getElementById('chatMain')
                if (el) {
                    el.scrollTop = el.scrollHeight
                    const elMessage1 = document.getElementById(`messageText_${newMessage.id}`)
                    if (elMessage1) {
                        elMessage1.innerHTML = `<p>${newMessage.message}</p>`
                        if (elMessage1) {
                            elMessage1.style.visibility = 'hidden'
                            elMessage1.style.opacity = '0'
                            setTimeout(() => {
                                elMessage1.style.visibility = 'visible'
                                elMessage1.style.opacity = '1'
                                elMessage1.style.transition = '500ms'
                            }, 100);
                        }
                    }
                }
            }, 100)
            setWaitResponse(true)
            console.log(fileSelected)
            try {
                const response = await chat(message, userId, cache)
                setWaitResponse(false)
                if (response.data) {
                    const newMessage2 = {
                        id: Date.now(),
                        message: '',
                        user: '#bot',
                        reference: [] ,
                        isNew: true,
                        removedBy: [],
                        audio: response.urlAudio,
                        cache: response.cache
                    }
                    setCache(response.cache)
                    const messagesCahe2 = [...messagesCache, newMessage2]
                    setMessagesToUse(messagesCahe2)
                    let textIndex = 0
                    const text : string = response.data.answer
                    if (newMessage2.audio) {
                        const audioCache = new Audio(newMessage2.audio);
                        setWaitAudio({state: false, time: ''})
                        setAudio(audioCache)
                    }
                    if (text) {
                        messagesCahe2[messagesCahe2.length - 1].message = text
                    }
                    setWaitWhileMessage(false)
                    const interval = setInterval(() => {
                        textIndex = textIndex + 1
                        const newText = text.replace(/(?<![{[?}\]])\[(?!\s)(.+?)\]/g, '').substring(0, textIndex)
                        const el = document.getElementById('chatMain')
                        const paragraph = document.getElementById(`messageText_${newMessage2.id}`)
                        if (paragraph) {
                            paragraph.innerHTML = urlify(`<p>${newText.replace(/(?<![{[?}\]])\*(?!\s)(.+?)\*/g, '<b>$1</b>')}</p>`
                            .replaceAll('\n* ', '\n- ')
                            .replaceAll('* <b>', '- <b>')
                            .replaceAll('<b>*', '<b>')
                            .replaceAll('</b>*', '</b>'))
                            .replaceAll('(<a', '<a')
                            .replaceAll(')</a>', '</a>')
                            .replaceAll(')"', '"')
                            if (el) {
                                el.scrollTop = el.scrollHeight
                            }
                            if (textIndex === text.length) {
                                clearInterval(interval)
                            }
                        }
                    }, 50)
                }
                
            } catch (error: any) {
                console.log('Error: ', error)
                setWaitResponse(false)
                
                const newMessage2 = {
                    id: Date.now(),
                    message: '',
                    user: '#bot',
                    isNew: true,
                    removedBy: []
                }
                const messagesCahe2 = [...messagesCache, newMessage2]
                setMessagesToUse(messagesCahe2)
                let textIndex = 0
                const text : string = error.response ? (((error.response.data && !error.response.data.message) ? 'Error data!' : (error.response.data.message && error.response.data.message.includes('timeout')))
                ? 'Error timeot!'
                : ( (error.response.data.message.includes('connect ECONNREFUSED')||(error.response.data.message.includes('ETIMEDOUT'))) ? t('homePage:cantConnectServer') : t('homePage:initialText'))) : error.message
                const fileSelectedCache = fileSelected
                if (fileSelectedCache) {
                    if (text) {
                        messagesCahe2[messagesCahe2.length - 1].message = text
                        fileSelectedCache.messages = messagesCahe2
    
                    }
                    if (avatarWeb) {
                        avatarWeb.addMessage(text)
                        avatarWeb.processMessages()
                    }
                    setWaitWhileMessage(false)
                    const interval = setInterval(() => {
                        textIndex = textIndex + 1
                        const newText = text.substring(0, textIndex)
                        const el = document.getElementById('chatContainerData')
                        const paragraph = document.getElementById(`messageText_${newMessage2.id}`)
                        if (paragraph) {
                            paragraph.innerHTML = `<p>${newText.replace(/(?<![{[?}\]])\*(?!\s)(.+?)\*/g, '<b>$1</b>')}</p>`
                                .replaceAll('\n* ', '\n- ')
                                .replaceAll('* <b>', '- <b>')
                                .replaceAll('<b>*', '<b>')
                                .replaceAll('</b>*', '</b>')
                        }
                        if (el) {
                            el.scrollTop = el.scrollHeight
                        }
                        if (textIndex === text.length) {
                            clearInterval(interval)
                            setMessagesToUse(messagesCahe2)
                        }
                    }, 50)
                }

                
            }
        }
    }

    useEffect(() => {
        if (transcript.length > 0) {
            setAudioMessage(transcript)
        }
    }, [transcript])

    useEffect(() => {
        if (!listening) {
            if (audioMessage.length > 0) {
                setMessage(audioMessage)
                setTimeout(() => {
                    addMessage()
                }, 500);
            }
        }
    }, [listening])

    const startAudioMessage = () => {
        setAudioMessage('')
        SpeechRecognition.startListening()
    }

    const stopAudioMessage = () => {
        SpeechRecognition.stopListening();
        setMessage(audioMessage)
    }

    const writeMessage = (e: any) => {
        setMessage(e.target.value)
    }
    
    const initAudioMessage = (url: string) => {
        const audioCache = new Audio(url);
        setAudio(audioCache)
    }

    return (
        <div className='homeContainer'>
            {(fileSelected && referenceSelected) && <PDFModal 
                open={openFileReader}
                closeModal={closeDocumentReference}
                pdfFile={fileSelected.url}
                loading={false}
                reference={referenceSelected}
            />}
        
            
            <IonGrid>
                <IonRow>
                    {enableAvatar && <IonCol sizeXl={'6'} sizeLg={'6'} sizeMd={'6'} sizeSm={'12'} sizeXs={'12'}>
                        <IonRow>
                            <IonCol />
                            <IonCol size='8'>
                                <div id={'content-avatar'}>
                                    <video poster={`/k-eternal/images/${nameAvatar}.png`} loop={true} id={'container-avatar'} width={'100%'} muted/>
                                    {(audio && !isSmartPhone) && <div style={{position: 'absolute', bottom: 10, right: 10}}>
                                        <IonButtons style={{backgroundColor: '#ccc'}}>
                                            <IonButton style={{'--color': '#444'}} disabled={!avatarSpeaking} onClick={stopSpeackAvatar}>
                                                <IonIcon icon={stop} /> Detener Audio
                                            </IonButton>
                                        </IonButtons>
                                    </div>}
                                    {(audio && isSmartPhone) && <div style={{position: 'absolute', bottom: 10, right: 10}}>
                                        <IonButtons style={{backgroundColor: '#ccc'}}>
                                            <IonButton style={{'--color': '#444'}} disabled={!avatarSpeaking} onClick={stopSpeackAvatar}>
                                                <IonIcon icon={stop} /> 
                                            </IonButton>
                                        </IonButtons>
                                    </div>}
                                    {audio && <div style={{position: 'absolute', bottom: 10, right: 10}}>
                                        <IonButtons style={{backgroundColor: '#ccc'}}>
                                            <IonButton style={{'--color': '#444'}} disabled={!avatarSpeaking} onClick={stopSpeackAvatar}>
                                                <IonIcon icon={stop} /> Detener Audio
                                            </IonButton>
                                        </IonButtons>
                                    </div>}
                                </div>
                            </IonCol>
                            <IonCol />
                        </IonRow>
                    </IonCol>}
                    <IonCol className='margin-top-10' sizeXl={enableAvatar ? '6' : '12'} sizeLg={enableAvatar ? '6' : '12'} sizeMd={enableAvatar ? '6' : '12'} sizeSm='12' sizeXs='12'>
                        <div id={'chatMain'} className={ `chatMain ${isSmartPhone ? (enableAvatar ? 'chatContainerMobileWithAvatar' : 'chatContainerMobileWithOutAvatar') : 'chatContainerHeight'}`}>
                            <div className={`chatContainer`}>
                                <div className='chatContainerData' id='chatContainerData'>
                                    {
                                        (messagesToUse.length > 0 ) ? messagesToUse.map((message, i) => {
                                            return (
                                                <div
                                                    key={i}
                                                    className='chat-message'>
                                                    <div 
                                                        className={
                                                            message.user === '#bot' ? 'chatBot-keternal-padding' : 'chatUser-keternal-padding'
                                                        }
                                                    >
                                                        <div style={{paddingLeft: 24.47, fontFamily: 'Montserrat'}}>
                                                            <p style={{margin: 0, color: '#8A898E'}}>{(message.user === '#bot') ? 'Mario Cañete' : message.user}</p>
                                                        </div>
                                                        <div id={`${message.id}`} className={(message.user === '#bot') ? 'chatBot-keternal' : 'chatUser-keternal'}>
                                                            <div style={{width:'100%'}}>
                                                                <div className='messageText' id={`messageText_${message.id}`} />
                                                                {
                                                                    (message.user === '#bot' && message.audio) && 
                                                                    <IonToolbar style={{'--background': 'transparent'}}>
                                                                        <IonButtons slot={'end'} >
                                                                            <IonButton slot='icon-only' onClick={() => {initAudioMessage(message.audio!)}}>
                                                                                <IonIcon icon={barcodeOutline} />
                                                                            </IonButton>
                                                                        </IonButtons>
                                                                    </IonToolbar>
                                                                }                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                        :
                                        !unableChat ? <div id={'spinner'} style={{width: '100%', paddingLeft: 16}}>
                                            <IonSpinner name='dots' /> <p>Iniciando conversación con {user?.name} {user?.lastName}</p>
                                        </div>
                                        :
                                        <div id={'spinner'} style={{width: '100%', paddingLeft: 16}}>
                                            <p>Usuario inhabilitado para conversar con el avatar</p>
                                        </div>
                                    }
                                    {
                                        waitResponse
                                        &&
                                        <div id={'spinner'} style={{width: '100%', paddingLeft: 16}}>
                                            <IonSpinner name='dots' /> <p>{waitAudio.stata && waitAudio.time}</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <div className='textContainer'>
                        <form onSubmit={newMessageData}>
                            <div className='textItem'>
                                {
                                    listening
                                    ?
                                    <div className='textItemInputs'>
                                        <p>
                                            {
                                                audioMessage.length === 0
                                                ?
                                                'Recording'
                                                :
                                                audioMessage
                                            }
                                        </p>
                                    </div>
                                    :
                                    <IonInput
                                    disabled={avatarSpeaking || unableChat}
                                    className='textItemInputs'
                                    onIonInput={writeMessage}
                                    value={message}
                                />}
                                <button
                                    disabled={avatarSpeaking || unableChat}
                                    style={{position: 'absolute', right: 20, backgroundColor: 'transparent', top: 20, height: 25, width: 25}}
                                    onClick={() => {(message.length === 0) && (!listening ? startAudioMessage() : stopAudioMessage())}}
                                    type={(message.length > 0) ? 'submit' : 'button'}
                                >
                                    <img src={message.length === 0 ? Mic : Send} alt="" />
                                </button>
                            </div>
                        </form>
                    </div>
                </IonRow>
            </IonGrid>
        </div>
    )
}

export default ChatContainer