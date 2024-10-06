import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonRow } from "@ionic/react"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../context/Auth.context"
import { eye, eyeOff } from "ionicons/icons"
import { ImKChatLogo } from "../../icons"
import { useHistory, useParams } from "react-router"

export const CreateNewPasswordContainer = () => {
    const {restorePassword, logo, styleCompany} = useAuthContext()
    const [userLoginData, setUserLoginData] = useState({
        'password': null,
        'confirmPassword': null
    })
    const [typePassword, setTypePassword] = useState('password')
    const [typePasswordConfirm, setTypePasswordConfirm] = useState('password')

    const [token, setToken] = useState('')

    const history = useHistory()

    const params: any = useParams()

    useEffect(() => {
        if (params) {
            setToken(params.tokenData)
        }
    }, [params])

    const initSession = async (e: any) => {
        e.preventDefault();
        if (userLoginData) {
            if (userLoginData.password && userLoginData.password) {
                if (userLoginData.password === userLoginData.confirmPassword) {
                    if (token.length > 0) {
                        const response = await restorePassword(userLoginData.password, token)
                        if (response.state) {
                            history.replace('/login')
                            alert('Ahora inicie sesión con su nueva password.')
                        }
                    }
                } else {
                    alert('Contraseñas no coinciden')
                }
            } else {
                alert('Debe agregar una contraseña')
            }
        }
    }

    return (
        <IonContent className='ion-padding'>
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
                                    RESTORE PASSWORD PAGE
                                </p>
                                <form onSubmit={initSession}>
                                    <p className="label-input-k-eternal">New Password</p>
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
                                    <p className="label-input-k-eternal">Confirm New Password</p>
                                    <div style={{position: 'relative'}}>
                                    <input
                                        placeholder="******"
                                        className="input-k-eternal"
                                        name="confirmPassword"
                                        type={typePasswordConfirm}
                                        onChange={(e) => {setUserLoginData({...userLoginData, [e.target.name] : e.target.value})}}
                                    />
                                    <IonButton className="eye-button" style={{position: 'absolute', right: 5}} fill={'clear'} onClick={() => {setTypePasswordConfirm((typePasswordConfirm === 'password') ? 'text' : 'password')}}>
                                        <IonIcon icon={typePassword === 'password' ? eye : eyeOff} />
                                    </IonButton>
                                    </div>
                                    <button className={`login-button ${styleCompany}`} type={'submit'}>
                                        CREATE NEW PASSWORD
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