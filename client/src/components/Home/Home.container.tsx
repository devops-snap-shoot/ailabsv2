import { IonButton, IonButtons, IonCol, IonContent, IonFab, IonFabButton, IonFabList, IonGrid, IonIcon, IonItem, IonList, IonPopover, IonRow, IonToolbar } from "@ionic/react"
import ChatContainer from "./Chat.container"
import { NavbarComponent } from "../Navbar/Navbar.component"
import { useEffect, useRef, useState } from "react"
import { useAuthContext } from "../../context/Auth.context"
import { list, menu } from "ionicons/icons"
import { Message, Share, Sounds, User } from "../../icons"
import { menuController } from '@ionic/core/components';
import { useAvatarContext } from "../../context/Avatar.context"

export const HomeContainer = () => {
    const popover = useRef<HTMLIonPopoverElement>(null);
    const {isSmartPhone} = useAuthContext()
    const {setEnableAvatar, enableAvatar} = useAvatarContext()
    const [ openMenuPopover, setOpenMenuPopover] = useState(false)
    const openMenu = async () => {
        await menuController.open('left-menu')
    }

    const openPopover = (e: any) => {
        popover.current!.event = e;
        setOpenMenuPopover(true);
    };

    return (
        <IonContent className='ion-padding'>
            {
                isSmartPhone && <IonToolbar style={{/* position: 'absolute' */}}>
                    <IonButtons slot="start">
                        <IonButton onClick={openMenu}>
                            <IonIcon slot="icon-only" icon={menu}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot="end">
                        <IonButton onClick={openPopover}>
                            <IonIcon slot="icon-only" icon={list}></IonIcon>
                        </IonButton>
                        <IonPopover ref={popover} isOpen={openMenuPopover} onDidDismiss={() => setOpenMenuPopover(false)}>
                            <IonContent class="ion-padding">
                                <IonList>
                                    <IonItem disabled>
                                        <IonIcon style={{width: 24, marginRight: 10}} src={Message} /> Messages
                                    </IonItem>
                                    <IonItem disabled>
                                        <IonIcon style={{width: 24, marginRight: 10}} src={Sounds} /> Sounds
                                    </IonItem>
                                    <IonItem
                                        /* className={
                                            enableAvatar ? 'home-toolbar-button-active' : 'home-toolbar-button-inactive'
                                        } */
                                        onClick={() => {
                                            setEnableAvatar(enableAvatar ? false : true);
                                            setOpenMenuPopover(false)
                                        }}>
                                        <IonIcon style={{width: 24, marginRight: 10}} src={User} /> Avatar
                                    </IonItem>
                                    <IonItem disabled>
                                        <IonIcon style={{width: 24, marginRight: 10}} src={Share} /> Share
                                    </IonItem>
                                </IonList>
                            </IonContent>
                        </IonPopover>
                    </IonButtons>
                </IonToolbar>
            }
            <div className={`${isSmartPhone ? '' : 'padding-30 padding-left-120 '}`}>
                <ChatContainer />
            </div>
        </IonContent>
    )
}