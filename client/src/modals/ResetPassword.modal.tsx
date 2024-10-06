import { IonButton, IonContent, IonIcon, IonInput, IonModal } from '@ionic/react'
import './modals.css'
import { useState } from 'react'
import { eye, eyeOff } from 'ionicons/icons'
import { Close, ImKChatLogo } from '../icons'
import { useAuthContext } from '../context/Auth.context'


const ResetPasswordModal = ({open, closeModal, token, setState}: {open: boolean, closeModal: () => void, token: string, setState: (state: boolean, from: string) => void}) => {
    const {restorePassword, styleCompany} = useAuthContext()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isPassword, setIsPassword] = useState<any>('password')
    const [isConfirmPassword, setIsConfirmPassword] = useState<any>('password')
    const [messageRestorePassError, setMessageRestorePassError] = useState('')
    
    const setNewPassword = async () => {
        if (password.length > 0) {
            if (confirmPassword.length > 0) {
                try {
                    const response = await restorePassword(password, token)
                    console.log(response)
                    closeModal()
                    setState(true, 'restorePassword')
                } catch (error) {
                    setState(false, 'restorePassword')
                }
            }
        }
    }

    return (
        <IonModal
            isOpen={open}
            onWillDismiss={closeModal}
        >
            <IonContent className={`fonts primaryColorWait${styleCompany}`}>
            <div className='closeButtonModal' onClick={closeModal}>
                <img src={Close} alt='close-button' width={24} height={24} />
            </div>
            <div style={{width:'100%', marginTop: 10, textAlign: 'center'}}>
                <img src={ImKChatLogo} alt='logo' width={150} />
            </div>
            <div style={{width:'100%', marginBottom: 10, textAlign: 'center'}}>
                <h1 style={{margin: 0}}>
                    Create New Password
                </h1>
            </div>
            <div>
                <p className='label-login'>Password</p>
            </div>
            <div style={{width: '100%', position: 'relative'}}>
                <IonInput className='input-login' fill={'outline'} type={isPassword} placeholder='Enter your password' onIonChange={(e: any) => {setPassword(e.target.value)}}/>
                <IonButton onClick={() => {(isPassword==='password') ? setIsPassword('text') : setIsPassword('password')  }} fill={'clear'} style={{position: 'absolute', right: 10, top: 5, zIndex: 1000}}>
                    <IonIcon icon={(isPassword==='password') ? eye : eyeOff} />
                </IonButton>
            </div>
            <br />
            <div>
                <p className='label-login'>Confirm Password</p>
            </div>
            <div style={{width: '100%', position: 'relative'}}>
                <IonInput className='input-login' fill={'outline'} type={isConfirmPassword} placeholder='Confirm your password' onIonChange={(e: any) => {setConfirmPassword(e.target.value)}}/>
                <IonButton onClick={() => {(isConfirmPassword==='password') ? setIsConfirmPassword('text') : setIsConfirmPassword('password')  }} fill={'clear'} style={{position: 'absolute', right: 10, top: 5, zIndex: 1000}}>
                    <IonIcon icon={(isConfirmPassword==='password') ? eye : eyeOff} />
                </IonButton>
            </div>
            <br />
            <IonButton className='button-login' expand={'block'} onClick={setNewPassword}>
                Set New Password
            </IonButton>
            <br />
            </IonContent>
        </IonModal>
    )
}

export default ResetPasswordModal
