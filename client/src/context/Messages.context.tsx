import { createContext, useContext, useEffect, useState } from "react";
import { MessageFormat } from "../interfaces/Messages.interface";
import { useAuthContext } from "./Auth.context";
import { createNewContextAvatar, getAllMessages } from "../routes/ia.routes";

interface MessagesType {
    messages: MessageFormat[]
    setMessages: React.Dispatch<React.SetStateAction<MessageFormat[]>>
    avatarWeb: any
    setAvatarWeb: React.Dispatch<any>
    getNewContext: () => Promise<any>
    unableChat: boolean
}

export const MessagesContext = createContext<MessagesType>({} as MessagesType)


export const MessagesProvider = (props: any) => {
    const {userId} = useAuthContext()
    const [messages, setMessages] = useState<MessageFormat[]>([])
    const [avatarWeb, setAvatarWeb] = useState<any>(null)
    const [unableChat, setUnableChat] = useState(false)

    useEffect(() => {
        if (userId) {
            readMessages()
        }
    }, [userId])

    const readMessages = async () => {
        try {
            const response = await getAllMessages(userId)
            console.log(response)
            if (response && response.messages) {
                setMessages(response.messages.map((message: any, index: number) => {
                    return {
                        id: message._id,
                        user: message.role === 'user' ? message.user.name + ' ' + message.user.lastName : '#bot',
                        message: message.content,
                        reference: [],
                        isNew: false,
                        removedBy: [],
                        audio: message.urlAudio,
                        cache: message.cache
                    }
                }))
            } else {
                setMessages([])
            }
        } catch (error) {
            console.log(error)
            alert('Usuario no cuenta con información requerida para conversar con el avatar')
            setMessages([])
            setUnableChat(true)
        }
    }

    const getNewContext = async () => {
        try {
            const response = await createNewContextAvatar(userId)
            return response
        } catch (error) {
            console.log(error)
        }
    }

    const value: MessagesType = {
        messages,
        setMessages,
        avatarWeb,
        setAvatarWeb,
        getNewContext,
        unableChat
    }

    return (
        <MessagesContext.Provider value={value} >
            {props.children}
        </MessagesContext.Provider>
    )
}

export const useMessagesContext = () => useContext(MessagesContext)