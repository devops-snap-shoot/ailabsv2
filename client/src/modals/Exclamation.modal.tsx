import { IonContent, IonModal } from '@ionic/react'
import { Close, Error, GreenCheck } from '../icons'
import './modals.css'

const ExclamationModal = ({open, handleClose, message, isOk}:{open: boolean, handleClose?: () => void, message: string, isOk: boolean}) => {
    return (
        <IonModal
            isOpen={open}
            onWillDismiss={handleClose}
            className='exclamation'
            backdropDismiss={false}
        >
            <IonContent className='modalContainer'>
                <div className='modalContainerImage'>
                    <img src={isOk ? GreenCheck : Error} alt='green-check' width={88} height={88} />
                </div>
                <div className='modalContainerMessage'>
                    <p>
                        {message}
                    </p>
                </div>
                <div className='closeButtonModal' onClick={handleClose}>
                    <img src={Close} alt='close-button' width={24} height={24} />
                </div>
            </IonContent>
        </IonModal>
    )
}

export default ExclamationModal
