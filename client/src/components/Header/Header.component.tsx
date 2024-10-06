import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonList, IonMenu, IonMenuButton, IonMenuToggle, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import { ImKChatLogo } from '../../icons'
import { useAuthContext } from '../../context/Auth.context'
import { gridOutline, menu } from 'ionicons/icons'
import { menuController } from '@ionic/core/components';
import { useHistory, useLocation } from 'react-router';
import { useEffect } from 'react';

const Header = () => {
    const {isAuth, isDesktop, logo, user, styleCompany} = useAuthContext()
    const history = useHistory()
    const location = useLocation()

    useEffect(() => {
        menuController.enable(true, 'right-menu')
        menuController.enable(true, 'right-menu')
    }, [])

    const openLeftMenu = async () => {
        await menuController.open('left-menu')
        await menuController.close('right-menu')
    }

    const openRightMenu = async () => {
        await menuController.open('right-menu')
        await menuController.close('left-menu')
    }

    const navigateTo = async (value: string) => {
        history.push(`/${value}`)
        await menuController.close('right-menu')
    }

    return (
        <>
            {(!location.pathname.includes('login')) && <IonMenu side="end" contentId="home-content" menuId='right-menu'>
                <IonContent className="ion-padding">
                    <IonList>
                        <IonItem disabled={location.pathname.includes('home')} button onClick={() => {navigateTo('home')}}>
                            Home
                        </IonItem>
                        <IonItem disabled={location.pathname.includes('admin')} button onClick={() => {navigateTo('admin')}}>
                            Admin
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonMenu>}
            {isAuth && <IonHeader className={`ion-no-border`}>
                <IonToolbar className={`headerContainer background${styleCompany}`}>
                    {/* {(isAuth && !isDesktop) && */}
                        <IonButtons style={{position: 'absolute', left: 10, height: '100%', zindex: 1000}}>
                            <IonButton onClick={openLeftMenu}>
                                <IonIcon className={`contrast${styleCompany}`} icon={gridOutline} />
                            </IonButton>
                        </IonButtons>
                    {/* } */}
                    {((isAuth && isDesktop) && (user?.roles[0].name === 'admin' || user?.roles[0].name === 'SuperAdmin')) && 
                        <IonButtons style={{position: 'absolute', right: 10, height: '100%', zindex: 1000}}>
                            <IonButton onClick={openRightMenu}>
                                <IonIcon className={`contrast${styleCompany}`} icon={menu} />
                            </IonButton>
                        </IonButtons>
                    }
                    <IonGrid style={{padding: 0}}>
                        <IonRow>
                            <IonCol style={{padding: 0}} sizeXs='12'>
                                <div style={{padding: '0px 10px'}}>
                                    <div style={{textAlign: 'center'}}>
                                        <img src={logo} alt='logo' width={106} height={60} />{/* <p className={`contrast${styleCompany}`} style={{fontSize: 10, position: 'absolute', left: 107, top: 8}}>Beta</p> */}
                                    </div>
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonToolbar>
            </IonHeader>}
        </>
    )
}

export default Header