import { IonButton, IonButtons, IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react"
import { Documents, Logout, Menu } from "../../icons"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../context/Auth.context"
import SelectFileModal from "../../modals/SelectFile.modal"

export const NavbarContainer = () => {
    const {logout} = useAuthContext()
    const [navBarExpanded, setNavBarExpanded] = useState(false)
    const [enableText, setEnableText] = useState(false)
    const [
        openSelectFileModal,
        setOpenSelectFileModal
    ] = useState(false)

    useEffect(() => {
        window.addEventListener('click', (e: any) => {
            const navBar = document.getElementById('navBar')
            if (navBar && navBar.contains(e.target)){
              // Clicked in box
            } else{
              if (navBarExpanded) {
                expandMenu()
              }
            }
        });
    })

    useEffect(() => {
        const navBar = document.getElementById('navBar')
        if (navBarExpanded) {
            if (navBar) {
                navBar.style.width = '299px'
                navBar.style.transition = '1s'
                setTimeout(() => {
                    setEnableText(true)
                }, 600);
            }    
        } else {
            if (navBar) {
                setTimeout(() => {
                    setEnableText(false)
                }, 100);
                navBar.style.width = '108px'
                navBar.style.transition = '1s'
            } 
        }
    }, [navBarExpanded])

    const expandMenu = () => {
        setNavBarExpanded(navBarExpanded ? false : true)
    }

    return (
        <div className="navBar-container" id={'navBar-container'}>
            {openSelectFileModal && <SelectFileModal
                open={openSelectFileModal}
                handleClose={() => {setOpenSelectFileModal(false)}}
            />}
            <button style={{backgroundColor: 'transparent'}} onClick={() => {expandMenu()}}>
                <IonGrid style={{padding: 0, height: 60}}>
                    <IonRow style={{padding: 0}}>
                        <IonCol style={{padding: 0}} size={enableText ? 'auto' : '12'}>
                            <img width={48} src="/k-eternal/images/isotipo.png"/>
                        </IonCol>
                        {
                            enableText && 
                            <IonCol style={{padding: 0}} size="auto">
                                <img width={150} src="https://k-eternal.ai/wp-content/uploads/2024/07/LOGO-Eternal-5-1024x341.png" alt="" />
                            </IonCol>
                        }
                    </IonRow>
                </IonGrid>
            </button>
            <div style={{marginTop: 30, marginBottom: 30, textAlign: 'center', maxWidth: 48}}>
                <p style={{fontFamily:'Manrope'}}>Menu</p>
            </div>
            <IonButton fill="clear" className={`navBar-button`}>
                <IonIcon src={Menu} style={{marginLeft: enableText ? 11.5 : 0, marginRight: enableText ? 11.5 : 0}} /> {enableText && <IonText style={{marginRight: 10}}>Overview</IonText>}
            </IonButton>
            <br />
            <IonButton fill="clear" slot="icon-only" className="navBar-button" onClick={() => {setOpenSelectFileModal(true)}}>
                <IonIcon style={{marginLeft: enableText ? 11.5 : 0, marginRight: enableText ? 11.5 : 0}} src={Documents} /> {enableText && <IonText style={{marginRight: 10}}>Files</IonText>}
            </IonButton>
            <div className="navBar-container" style={{position: "absolute", left: 0, bottom: 0}}>
                <IonButton fill="clear" slot="icon-only" className="navBar-button" onClick={() => {logout()}}>
                    <IonIcon style={{marginLeft: enableText ? 11.5 : 0, marginRight: enableText ? 11.5 : 0}} src={Logout} /> {enableText && <IonText style={{marginRight: 10}}>Log out</IonText>}
                </IonButton>
            </div>
        </div>
    )
}