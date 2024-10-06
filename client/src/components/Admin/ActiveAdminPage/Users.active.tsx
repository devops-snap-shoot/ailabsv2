import { IonButton, IonButtons, IonCheckbox, IonCol, IonGrid, IonIcon, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/react"
import { useUsersContext } from "../../../context/Users.context"
import { useEffect, useState } from "react"
import { Add } from "../../../icons"
import { ellipsisVertical, pencil, trash } from "ionicons/icons"
import { Role, UserInterface } from "../../../interfaces/Auth.interface"
import { useHistory } from "react-router"
import Pagination from '@mui/material/Pagination';

export const UsersActive = () => {
    const {deleteUser, pages, page, setPage, group} = useUsersContext()
    const [usersToList, setUsersToList] = useState<UserInterface[]>([])

    const [allUsersSelected, setAllUsersSelected] = useState(false)
    const history = useHistory()
    
    useEffect(() => {
        if (group) {
            setUsersToList(group[page])
        }
}, [page, group])

    const toNewUser = () => {
        history.push('/admin/create-user')
    }

    const editUser = (_id: string) => {
        history.push(`/admin/edit-user/${_id}`)
    }

    const removeUser = (_id: string) => {
        deleteUser(_id)
    }

    const selectAll = (e: any) => {
        setAllUsersSelected(e.detail.checked)
    }

    const selectUser = (checked: boolean, index: number) => {
        const usersCache: any[] = [...usersToList]
        usersCache[index].checked = checked
        setUsersToList(usersCache)
    }

    const changePage = (e: any, value: any) => {
        setPage(Number(value))
    }

    return (
        <div className="users-admin-container">
            <IonGrid>
                <IonRow style={{height: 31.42}}>
                    <IonTitle style={{padding: 0}}>
                        User Management
                    </IonTitle>
                </IonRow>
                <IonRow style={{height: 56}}>
                    <IonToolbar style={{height: 56}}>
                            <IonButton fill="clear" className="create-user-button" slot="end" onClick={toNewUser}>
                                <IonIcon icon={Add} />
                                Create New User
                            </IonButton>
                            <IonButton fill="clear" className="create-user-button" slot="end">
                                <IonIcon icon={ellipsisVertical}/>
                            </IonButton>
                    </IonToolbar>
                </IonRow>
                <IonRow style={{height: 31.42, paddingRight: 20}} className="border-bottom-line">
                    <IonCol sizeXs="0.5">
                        <IonCheckbox onIonChange={selectAll} checked={allUsersSelected}/>
                    </IonCol>
                    <IonCol sizeXs="1.5">
                        <IonText>
                            NAME    
                        </IonText>          
                    </IonCol>
                    <IonCol sizeXs="1.5">
                        <IonText>
                            LASTNAME    
                        </IonText>
                    </IonCol>
                    <IonCol sizeXs="2">
                        <IonText>
                            ORGANIZATION    
                        </IonText>
                    </IonCol>
                    <IonCol sizeXs="1">
                        <IonText>
                            ROLE    
                        </IonText>
                    </IonCol>
                    <IonCol sizeXs="1">
                        <IonText>
                            ESPECIALIDAD    
                        </IonText>
                    </IonCol>
                    <IonCol sizeXs="2.25">
                        <IonText>
                            EMAIL    
                        </IonText>
                    </IonCol>
                    <IonCol sizeXs="1">
                        <IonText>
                            STATE    
                        </IonText>
                    </IonCol>
                    <IonCol sizeXs="1.25">
                        <IonText>
                            ACTIONS    
                        </IonText>
                    </IonCol>
                </IonRow>
            </IonGrid>
            <IonGrid style={{overflowY: 'auto', height: '60vh'}}>
                {
                    usersToList.map((user: any, i) => {
                        let institution = 'Sin información'
                        if (user.userOtherData) {
                            if (user.userOtherData.institutions) {
                                if (user.userOtherData.institutions[0]) {
                                    institution = user.userOtherData.institutions[0]
                                }
                            }
                        }
                        return (
                            <IonRow key={`row_${i}`} style={{marginTop: 10}}>
                                <IonCol sizeXs="0.5">
                                    <IonCheckbox onIonChange={(e) => {selectUser(e.detail.checked, i)}} checked={user.checked} />
                                </IonCol>
                                <IonCol sizeXs="1.5">
                                    <IonText>
                                        {user.name}
                                    </IonText>
                                </IonCol>
                                <IonCol sizeXs="1.5">
                                    <IonText>
                                        {user.lastName}
                                    </IonText>
                                </IonCol>
                                <IonCol sizeXs="2">
                                    <IonText>
                                        {institution}
                                        {/* {(user.userOtherData && user.userOtherData.institutions && user.userOtherData.institutions[0]) ? user.userOtherData.intitutions[0] : 'Sin Información' } */}
                                    </IonText>
                                    {/* {
                                        user.organization.map((org: any, i: number) => {
                                            return (
                                                
                                            )
                                        })
                                    } */}
                                </IonCol>
                                <IonCol sizeXs="1">
                                    {
                                        user.roles.map((role: any, i: number) => {
                                            const roleData = role as Role
                                            return (
                                                <IonText key={i}>
                                                    {roleData.name}
                                                </IonText>
                                            )
                                        })
                                    }
                                </IonCol>
                                <IonCol sizeXs="1">
                                    {
                                        user.speciality.map((s: any, i: number) => {
                                            return (
                                                <IonText key={i}>
                                                    {s.name.replace(s.name[0], s.name[0].toUpperCase())}
                                                </IonText>
                                            )
                                        })
                                    }
                                </IonCol>
                                <IonCol sizeXs="2.25">
                                    <IonText>
                                        {user.email}    
                                    </IonText>
                                </IonCol>
                                <IonCol sizeXs="1">
                                    {
                                        user.state ?
                                        <div style={{border: '2px solid #27AE60', color: '#27AE60', borderRadius: 5, textAlign: 'center'}}>
                                            <p style={{margin: 0}}>ACTIVE</p>
                                        </div>
                                        :
                                        <div style={{color: '#909090', backgroundColor: '#909090', borderRadius: 5, textAlign: 'center'}}>
                                            <p style={{margin: 0}}>INACTIVE</p>
                                        </div>
                                    }
                                </IonCol>
                                <IonCol sizeXs="1.25">
                                    <IonButtons style={{marginLeft: 10}}>
                                        <IonButton className="buttonActions" shape="round" onClick={() => {editUser(user._id)}}>
                                            <IonIcon slot="icon-only" icon={pencil}/>
                                        </IonButton>
                                        <IonButton color={'danger'} className="buttonActions" shape="round" onClick={() => {removeUser(user._id)}}>
                                            <IonIcon slot="icon-only" icon={trash}/>
                                        </IonButton>
                                    </IonButtons>
                                </IonCol>
                            </IonRow>
                        )
                    })
                }
            </IonGrid>
            <Pagination 
                count={pages}
                page={page}
                onChange={changePage}
                style={{position: 'absolute', bottom: 10, right: 10}} />

        </div>
    )
}