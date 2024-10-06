import { IonButton, IonButtons, IonFab, IonFabButton, IonFabList, IonIcon, IonPage, IonToolbar } from '@ionic/react'
import { HomeContainer, MenuComponent } from '../../components'
import { Message, Share, Sounds, User } from '../../icons'
import { useAuthContext } from '../../context/Auth.context'
import { useAvatarContext } from '../../context/Avatar.context'
import { useParams } from 'react-router'
import { useEffect } from 'react'

const HomePage = () => {
    const {isSmartPhone, setAvatarIdLocal} = useAuthContext()
    const {setEnableAvatar, enableAvatar} = useAvatarContext()
    const params: any = useParams()

    useEffect(() => {
        if (params) {
            if (params.avatarId) {
                setAvatarIdLocal(params.avatarId)
            }
        }
    }, [params])
    return (
        <>
            {isSmartPhone && <MenuComponent />}
            <IonPage id='home-content' style={{}}>
                {!isSmartPhone && <IonToolbar style={{height: 70}}>
                    <IonButtons slot='end' className='home-toolbar' style={{height: 70}}>
                        <IonButton className={'home-toolbar-button-inactive'} disabled>
                            <IonIcon style={{width: 24}} src={Message} />
                        </IonButton>
                        <IonButton className={'home-toolbar-button-inactive'} disabled>
                            <IonIcon style={{width: 24}} src={Sounds} />
                        </IonButton>
                        <IonButton
                            className={
                                enableAvatar ? 'home-toolbar-button-active' : 'home-toolbar-button-inactive'
                            }
                            onClick={() => {
                                setEnableAvatar(enableAvatar ? false : true)
                            }}>
                            <IonIcon style={{width: 24}} src={User} />
                        </IonButton>
                        <IonButton className={'home-toolbar-button-inactive'} disabled>
                            <IonIcon style={{width: 24}} src={Share} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>}
                <HomeContainer />
            </IonPage>
        </>
    )
}

export default HomePage