import { IonButton, IonButtons, IonCheckbox, IonContent, IonIcon, IonItem, IonLabel, IonList, IonModal, IonSelect, IonSelectOption, IonToolbar } from '@ionic/react'
import './modals.css'
import { useEffect } from 'react'
import { close } from 'ionicons/icons'
import { useAvatarContext } from '../context/Avatar.context'

const AvatarOptionsModal = ({open, handleClose}:{open: boolean, handleClose: () => void}) => {
    const {languages, setLanguageSelected, languageSelected, voice, voicesFilterByLanguage, setVoice, setEnableAutoLanguage, enableAutoLanguage} = useAvatarContext()

    useEffect(() => {
        console.log(voicesFilterByLanguage)
    }, [voicesFilterByLanguage])
    return (
        <IonModal
            isOpen={open}
            onWillDismiss={() => {handleClose()}}
            backdropDismiss={false}
        >
            <IonToolbar>
                <div style={{paddingLeft: 15}}>
                    <h3 style={{fontFamily: 'Poppins'}}>Avatar Options</h3>
                </div>
                <IonButtons slot='end'>
                    <IonButton onClick={() => {handleClose()}}>
                        <IonIcon icon={close} />
                    </IonButton>
                </IonButtons>
            </IonToolbar>
            <IonContent className='modalContainer'>
                <IonList>
                    <IonItem>
                        <IonSelect value={languageSelected} interface="popover" label='Select Language' placeholder={'language'} onIonChange={(e) => {setLanguageSelected(e.target.value)}}>
                            {
                                languages.map((lng, i) => {
                                    return (
                                        <IonSelectOption key={i} value={lng.shortName}>
                                            {lng.name}
                                        </IonSelectOption>
                                    )
                                })
                            }
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonSelect
                            interface="popover"
                            label='Select Voice'
                            disabled={voicesFilterByLanguage.length === 0}
                            value={voice}
                            onIonChange={(e) => {
                                setVoice(e.target.value)
                            }}
                        >
                            {
                                voicesFilterByLanguage.length > 0 &&
                                voicesFilterByLanguage.map((voice, i) => {
                                    return (
                                        <IonSelectOption key={i} value={voice.name}>
                                            {voice.name} {voice.lang}
                                        </IonSelectOption>
                                    )
                                })
                            }
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonCheckbox
                            checked={enableAutoLanguage}
                            onIonChange={(e) => {setEnableAutoLanguage(e.target.checked)}}
                        >
                            Enable autodetect language (Beta)
                        </IonCheckbox>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonModal>
    )
}

export default AvatarOptionsModal
