import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonModal, IonTitle, IonToolbar } from "@ionic/react"

export const AddUserToFileModal = ({isOpen, setIsOpen, confirm, users, fileSelected, userSelected}: any) => {
    return (
        <IonModal isOpen={isOpen}>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
                    </IonButtons>
                    <IonTitle>Welcome</IonTitle>
                    <IonButtons slot="end">
                        <IonButton strong={true} onClick={() => confirm()}>
                            Confirm
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {
                    users.map((user: any, index: number) => {
                        let state = false
                        fileSelected.userId.forEach((u: any) => {
                            if (u._id === user._id) {
                                state = true
                            }
                        })
                        const disabled = state
                        return (
                            <IonItem disabled={disabled} key={`user_${index}`} button onClick={() => {userSelected(user)}}>
                                {user.name} {user.lastName}
                            </IonItem>
                        )
                    })
                }
            </IonContent>
        </IonModal>
    )
}