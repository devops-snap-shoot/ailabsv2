import { IonPage } from '@ionic/react'
import { AdminContainer } from '../../components'
import { useAuthContext } from '../../context/Auth.context'

const AdminPage = () => {
    return (
        <>
            <IonPage id='home-content'>
                <AdminContainer />
            </IonPage>
        </>
    )
}

export default AdminPage