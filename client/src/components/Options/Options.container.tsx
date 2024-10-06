import { IonContent, IonTitle } from "@ionic/react"
import { useAuthContext } from "../../context/Auth.context"

export const OptionsContainer = () => {
    const {styleCompany} = useAuthContext()
    return (
        <IonContent className={`appContent${styleCompany}`}>
            <IonTitle>
                Options
            </IonTitle>
        </IonContent>
    )
}