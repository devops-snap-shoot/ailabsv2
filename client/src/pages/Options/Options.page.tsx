import { IonPage } from '@ionic/react'
import { OptionsContainer } from '../../components'
import { useAuthContext } from '../../context/Auth.context'

const OptionsPage = () => {
    return (
        <>
            <IonPage id='home-content'>
                <OptionsContainer />
            </IonPage>
        </>
    )
}

export default OptionsPage