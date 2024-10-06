import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonRow } from "@ionic/react"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../context/Auth.context"
import { useHistory } from "react-router"
import ExclamationModal from "../../modals/Exclamation.modal"

export const RestorePasswContainer = () => {
    const {subdomain, logo, iconPage, styleCompany, initForgotPassword} = useAuthContext()
    const [userLoginData, setUserLoginData] = useState({
        'email': null
    })

    const [openExclamation, setOpenExclamation] = useState(false)

    const [exclamationConditions, setExclamationConditions] = useState({
        message: '',
        isOk: false
    })

    const history = useHistory()

    const restorePassw = async (e: any) => {
        e.preventDefault();
        if (userLoginData) {
            if (userLoginData.email) {
                try {
                    const response = await initForgotPassword(userLoginData.email, subdomain, logo, iconPage)
                    console.log(response)
                    if (response.state) {
                        setExclamationConditions({
                            message: 'Se ha enviado un correo electrónico con las instrucciones.',
                            isOk: true
                        })
                        setOpenExclamation(true)
                        setTimeout(() => {
                            setOpenExclamation(false)
                        }, 3000);
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }

    return (
        <IonContent className='ion-padding'>
            <ExclamationModal
                open={openExclamation}
                handleClose={() => {setOpenExclamation(false); setTimeout(() => {
                    history.replace('/login')
                }, 500);}}
                message={exclamationConditions.message}
                isOk={exclamationConditions.isOk}
            />
            <div className="bg-container full-display">
                <IonGrid>
                    <IonRow>
                        <IonCol>
                        </IonCol>
                        <IonCol sizeXs="12" sizeSm="10" sizeMd="6" sizeLg="4" sizeXl="3">
                            <div className="login-component">
                                <div style={{textAlign: 'center'}}>
                                <img src={logo} width={'60%'} alt="" />
                                </div>
                                <p className="title-login">
                                    Restore Password
                                </p>
                                <form onSubmit={restorePassw}>
                                    <p className="label-input-k-eternal">Email</p>
                                    <input
                                        placeholder="example@test.ts"
                                        className="input-k-eternal"
                                        name="email"
                                        onChange={(e) => {setUserLoginData({...userLoginData, [e.target.name] : e.target.value})}}
                                    />
                                    <button className={`login-button ${styleCompany}`} type={'submit'}>
                                        RESTORE PASSWORD
                                    </button>
                                </form>
                            </div>
                        </IonCol>
                        <IonCol>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </div>
        </IonContent>
    )
}