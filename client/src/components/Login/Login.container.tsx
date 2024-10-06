import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonRow } from "@ionic/react"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../context/Auth.context"
import { eye, eyeOff } from "ionicons/icons"
import { ImKChatLogo } from "../../icons"
import { useHistory } from "react-router"
import ExclamationModal from "../../modals/Exclamation.modal"

export const LoginContainer = () => {
    const {login, logo, styleCompany, logout} = useAuthContext()
    const [userLoginData, setUserLoginData] = useState({
        'email': null,
        'password': null
    })
    const [typePassword, setTypePassword] = useState('password')

    const [openExclamation, setOpenExclamation] = useState(false)

    const [exclamationConditions, setExclamationConditions] = useState({
        message: '',
        isOk: false
    })

    useEffect(() => {
        logout()
    }, [])


    const history = useHistory()

    const initSession = async (e: any) => {
        e.preventDefault();
        if (userLoginData) {
            if (userLoginData.email) {
                if (userLoginData.password) {
                    const response: any = await login(userLoginData.email, userLoginData.password)

                    console.log(response)

                    if (response.response && response.response.data && response.response.data.message) {
                        setOpenExclamation(true)
                        setExclamationConditions({
                            message: (response.response.data.message === "Wrong password") ? 'Error de password' : 'Error de inicio de sesión',
                            isOk: false
                        })
                    }
                }
            }
        }
    }

    return (
        <IonContent className='ion-padding'>
            <ExclamationModal
                open={openExclamation}
                handleClose={() => {setOpenExclamation(false);}}
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
                                    Login
                                </p>
                                <form onSubmit={initSession}>
                                    <p className="label-input-k-eternal">Email</p>
                                    <input
                                        placeholder="example@test.ts"
                                        className="input-k-eternal"
                                        name="email"
                                        onChange={(e) => {setUserLoginData({...userLoginData, [e.target.name] : e.target.value})}}
                                    />
                                    <p className="label-input-k-eternal">Password</p>
                                    <div style={{position: 'relative'}}>
                                    <input
                                        placeholder="******"
                                        className="input-k-eternal"
                                        name="password"
                                        type={typePassword}
                                        onChange={(e) => {setUserLoginData({...userLoginData, [e.target.name] : e.target.value})}}
                                    />
                                    <IonButton className="eye-button" style={{position: 'absolute', right: 5}} fill={'clear'} onClick={() => {setTypePassword((typePassword === 'password') ? 'text' : 'password')}}>
                                        <IonIcon icon={typePassword === 'password' ? eye : eyeOff} />
                                    </IonButton>
                                    </div>
                                    <button className={`login-button ${styleCompany}`} type={'submit'}>
                                        LOGIN
                                    </button>
                                </form>
                                <button className={`restore-password-button ${styleCompany}-RESTORE-PASSWORD`} onClick={() => {history.push('/restore-password')}}>
                                    RESTORE PASSWORD
                                </button>
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