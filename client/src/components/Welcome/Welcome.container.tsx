import { IonCol, IonContent, IonGrid, IonRow } from "@ionic/react"
import { useEffect } from "react"
import { useAuthContext } from "../../context/Auth.context"
import { useHistory } from "react-router"

export const WelcomeContainer = () => {
    const {verifyToken} = useAuthContext()
    const history = useHistory()
    useEffect(() => {
        const img = document.getElementById('image-title')
        if (img) {
            img.style.transition = 'opacity 2s'
            img.style.opacity = '1'
            executeAct()
        }

    },[])

    const executeAct = () => {
        const img = document.getElementById('image-title')
        setTimeout(() => {
            if (img) {
                img.style.transition = 'opacity 2s'
                img.style.opacity = '0'
            }
            setTimeout(() => {
                const tokenSaved = localStorage.getItem('token')
                if (tokenSaved) {
                    verifyToken(tokenSaved)
                } else {
                    history.replace('/login')
                }
            }, 2000)
        }, 500);
    }

    return (
        <IonContent>
            <div className="bg-container full-display text-align-center to-click" /* onClick={() => {executeAct()}} */>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                        </IonCol>
                        <IonCol sizeXs="12" sizeSm="12" sizeMd="8" sizeLg="6" sizeXl="6">
                            <img id={'image-title'} className="image-title-app-init" style={{marginTop: '30vh', opacity: 0}} width={'100%'} src="https://k-eternal.ai/wp-content/uploads/2024/07/LOGO-Eternal-5-1024x341.png" alt="" />
                        </IonCol>
                        <IonCol>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </div>
        </IonContent>
    )
}