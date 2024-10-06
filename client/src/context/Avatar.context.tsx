import LanguageDetect from "languagedetect";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./Auth.context";
import axios from "axios";

interface AvatarType {
    setLanguages: React.Dispatch<React.SetStateAction<any[]>>
    languages: any[]
    setLanguageSelected: React.Dispatch<any>
    languageSelected: any
    setVoicesFilterByLanguage: React.Dispatch<React.SetStateAction<any[]>>
    voicesFilterByLanguage: any[]
    voice: any
    setVoice: React.Dispatch<any>
    setEnableAutoLanguage: React.Dispatch<React.SetStateAction<boolean>>
    enableAutoLanguage: boolean
    nameAvatar: string | undefined
    setNameAvatar: React.Dispatch<React.SetStateAction<string | undefined>>
    enableAvatar: boolean
    setEnableAvatar: React.Dispatch<React.SetStateAction<boolean>>
    avatarElement: HTMLVideoElement | undefined
    setAvatarElement: React.Dispatch<React.SetStateAction<HTMLVideoElement | undefined>>
    setOptimized: React.Dispatch<React.SetStateAction<boolean>>
    optimized: boolean
    elevenLabsVoiceId: string
    uploadAudioToAvatar: (file: any, nameAvatar: string, responseAvatar: string) => Promise<any>
}

export const AvatarContext = createContext<AvatarType>({} as AvatarType)

export const AvatarProvider = (props: any) => {
    const {subdomain} = useAuthContext()
    const [languages, setLanguages] = useState<any[]>([])
    const [voice, setVoice] = useState<any>()
    const [languageSelected, setLanguageSelected] = useState<any>('es-ES')
    const [voicesFilterByLanguage, setVoicesFilterByLanguage] = useState<any[]>([])
    const [enableAutoLanguage, setEnableAutoLanguage] = useState(false)
    const [nameAvatar, setNameAvatar] = useState<string>()
    const [avatarElement, setAvatarElement] = useState<HTMLVideoElement>()
    const [enableAvatar, setEnableAvatar] = useState(true)
    const [optimized, setOptimized] = useState(false)
    const [elevenLabsVoiceId, setelevenLabsVoiceId] = useState('IKne3meq5aSn9XLyUdCD')

    useEffect(() => {
        const lngDetector = new LanguageDetect();
        const langFiltered = lngDetector.getLanguages().filter(lng => {
            if (lng === 'english' || lng === 'spanish') return lng
        })
        const langs = langFiltered.map(lng => {
            if (lng === 'english') {
                return {
                    name: lng,
                    shortName: 'en'
                }
            } else if (lng === 'spanish') {
                return {
                    name: lng,
                    shortName: 'es'
                }
            }
        })
        console.log(langs)
        setLanguages(langs)
        
    }, [])

    useEffect(() => {
        if (subdomain) {
            const nameAvatarCache = 'mario'
            setNameAvatar(nameAvatarCache)
        }
    }, [subdomain])

    useEffect(() => {
        const userLang = navigator.language
        const langFiltered = languages.filter((lan) => {
            console.log(lan, userLang)
            if (userLang.includes(lan)) {
                return lan
            }
        })
        if (langFiltered.length > 0) {
            setLanguageSelected(langFiltered[0])
        } else {
            console.log(languages.filter((lan) => {
                if (userLang.includes('en')) {
                    return lan
                }
            })[0])
            setLanguageSelected(
                languages.filter((lan) => {
                    if (userLang.includes('en')) {
                        return lan
                    }
                })[0]
            )
        }
    }, [languages])

    /* useEffect(() => {
        if (languageSelected) {
            console.log(languageSelected)
            const voicesCache = speechSynthesis.getVoices()
            if (voicesCache.length > 0) {
                const voicesFilterByLanguageCache = voicesCache.filter(voice => {
                    console.log(voice)
                    if (voice.lang.includes(languageSelected)) {
                        return voice
                    }
                })
                setVoicesFilterByLanguage(voicesFilterByLanguageCache)
            }
        }
    }, [languageSelected]) */

    /* const speakAvatar = (message: string) => {
        if (avatarElement) {
            console.log(speechSynthesis.getVoices())
            console.log(message)
            const newMessage = new SpeechSynthesisUtterance(message);
            newMessage.lang = languageSelected || 'es-ES'
            newMessage.voice = speechSynthesis.getVoices().filter(voiceItem => (voice === voiceItem.name))[0]

            console.log(newMessage)
            speechSynthesis.speak(newMessage)
            avatarElement.src = `/assets/videos/avatar-${nameAvatar}-speak.webm`
            avatarElement.play()

            newMessage.addEventListener('end', () => {
                avatarElement.src = `/assets/videos/avatar-${nameAvatar}-standby.webm`
                avatarElement.play()
            })
            
        }
    } */

    const uploadAudioToAvatar = async (file: any, nameAvatar: string, responseAvatar: string) => {
        const url = (window.location.host.includes('demo')) ? process.env.REACT_APP_SERVER_URL_DEMO_AILABS : process.env.REACT_APP_SERVER_URL 

        const formData = new FormData()
        formData.append('file', file)
        formData.append('nameAvatar', nameAvatar)
        formData.append('responseAvatar', responseAvatar)
        const response = await axios.post(url+'/api/ia/add_my_voice', formData)
        console.log(response.data)
        return response.data
    }

    const value = {
        languages,
        setLanguages,
        languageSelected,
        setLanguageSelected,
        voicesFilterByLanguage,
        setVoicesFilterByLanguage,
        setVoice,
        voice,
        enableAutoLanguage,
        setEnableAutoLanguage,
        nameAvatar,
        setNameAvatar,        
        enableAvatar,
        setEnableAvatar,
        avatarElement,
        setAvatarElement,
        optimized,
        setOptimized,
        elevenLabsVoiceId,
        uploadAudioToAvatar
    }

    return (
        <AvatarContext.Provider value={value} >
            {props.children}
        </AvatarContext.Provider>
    )
}

export const useAvatarContext = () => useContext(AvatarContext)