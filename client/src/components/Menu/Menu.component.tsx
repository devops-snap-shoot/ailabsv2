import { IonContent, IonMenu, useIonLoading } from '@ionic/react'
import { NavbarContainer } from '../Navbar/Navbar.container'

const MenuComponent = () => {
    return (
        <IonMenu contentId='home-content' className='menu-list' menuId='left-menu'>
            <IonContent className='menuContent'>
                <NavbarContainer />
            </IonContent>
        </IonMenu>
    )
}

export default MenuComponent
