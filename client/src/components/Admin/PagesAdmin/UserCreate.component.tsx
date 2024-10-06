import { IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonGrid, IonInput, IonPopover, IonRow, IonSelect, IonSelectOption, IonToolbar } from "@ionic/react"
import { useEffect, useRef, useState } from "react"
import { Role, UserInterface } from "../../../interfaces/Auth.interface"
import { NoImageProfile } from "../../../images"
import { t } from 'i18next'
import { useParams } from "react-router"
import { useUsersContext } from "../../../context/Users.context"
import { useAuthContext } from "../../../context/Auth.context"
import usersRoutes from "../../../routes/users.routes"

export const UserCreateComponent = () => {
    const params: any = useParams()
    const {roles, companies, allRoles, user, styleCompany} = useAuthContext()
    const {users, createNewUser, editUser} = useUsersContext()
    const [userEdit, setUserEdit] = useState<UserInterface>({} as UserInterface)
    const [userRole, setUserRole] = useState<string>('Role')
    const [typePassword, setTypePassword] = useState<'password'|'text'>('password')
    const [companySelected, setCompanySelected] = useState<string>()
    const [roleSelected, setRoleSelected] = useState<any[]>([])
    const [roleList, setRoleList] = useState<any[]>([])
    const [rolesUser, setRolesUser] = useState<any[]>([])
    const [password, setPassword] = useState<string>()

    const popover = useRef<HTMLIonPopoverElement>(null);
    const [popoverOpen, setPopoverOpen] = useState(false);

    
  
    const addDate = (e: any) => {
      popover.current!.event = e;
      setPopoverOpen(true);
    };

    const newDate = (e:any) => {
        const date = new Date(e.detail.value)
        const dateOfBirth = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
        setUserEdit({...userEdit, dateOfBirth: dateOfBirth})
    }

    useEffect(() => {
        if (roleSelected) {
            const rolesUserCache: any[] = []
            roleList.forEach((r) => {
                roleSelected.forEach((role) => {
                    if (role === r._id) {
                        rolesUserCache.push(r.name)
                    }
                })
            })
            setRolesUser(rolesUserCache)
        }
    },[roleSelected, roleList])

    useEffect(() => {
        if (rolesUser.length > 0) {
            let roles = ''
            rolesUser.forEach((role, i) => {
                roles += `${role}${(i === rolesUser.length - 1) ? '' : ', '}`
            })
            setUserRole(roles)
        } else {
            setUserRole('Role')
        }
    },[rolesUser])

    useEffect(() => {
        if (params && params.user_id) {
            const userFiltered = users.filter(u => {if (u._id === params.user_id) return u})
            if (userFiltered.length>0) {
                setUserEdit({
                    ...userEdit,
                    _id: params.user_id,
                    name: userFiltered[0].name,
                    lastName: userFiltered[0].lastName,
                    email: userFiltered[0].email,
                    dateOfBirth: userFiltered[0].dateOfBirth,
                    phone: userFiltered[0].phone,
                    organization: (userFiltered[0].organization && userFiltered[0].organization[0] && userFiltered[0].organization[0]._id) ? userFiltered[0].organization[0]._id : []
                })
                if (userFiltered[0].organization && userFiltered[0].organization[0] && userFiltered[0].organization[0]._id) {
                    setCompanySelected(userFiltered[0].organization[0]._id)
                }
                if (userFiltered[0].roles) {
                    const rolesCache = userFiltered[0].roles.map((role: any) => {
                        return role._id
                    })
                    setRoleSelected(rolesCache)
                }
            }
        } else {
            if (roles[0] && roles[0].name === 'admin') {
                setCompanySelected(user?.organization[0])
            }
        }
    }, [params])

    useEffect(() => {
        if (companySelected) {
            const rolesFiltered = allRoles.filter((role) => {if (role.organizationId && role.organizationId._id === companySelected) return role})
            setRoleList(rolesFiltered)
            setUserEdit({...userEdit, organization: [companySelected]})
        }
    }, [companySelected])

    useEffect(() => {
        if (roleSelected) {
            setUserEdit({...userEdit, roles: roleSelected as Role[]})
        }
    }, [roleSelected])

    const userDataEdited = async () => {
        if (!params.user_id) {
            if (validateEmail(userEdit.email)) {
                if (password && password.length > 5) {
                    userEdit.password = password
                    if (userEdit.name && userEdit.lastName) {
                        createNewUser(userEdit)
                    }
                }
            }
        } else {
            editUser(userEdit)
        }
    }

    const validateEmail = (email: string) => {
        return email.match(
          /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        );
    };

    const addSignature = () => {
        alert(t('messages:indevelopment'))
    }

    const addImageProfile = () => {
        alert(t('messages:indevelopment'))
    }

    return (
        <IonContent className={`appContent${styleCompany}`}>
            <IonGrid>
                <IonRow>
                    <IonCol size="3" />
                    <IonCol size="2">
                        <div className="userDataContainer">
                            <div className="userDataContainerImage" onClick={addImageProfile}>
                                <img src={(userEdit && userEdit.image) ? userEdit.image : NoImageProfile} />
                            </div>
                            <div className="userDataContainerName">
                                <p>
                                    {
                                        userEdit?.name ? userEdit.name : 'Name'
                                    }
                                </p>
                                <p>
                                    {
                                        userEdit?.lastName ? userEdit.lastName : 'Lastname'
                                    }
                                </p>
                            </div>
                            <div className="userDataContainerRole">
                                {userRole.toUpperCase()}
                            </div>
                            <button className="userDataContainerSignature" onClick={addSignature}>
                                <p>
                                    {
                                        t('admin:createUser:signature:text').toUpperCase()
                                    }
                                </p>
                            </button>
                        </div>
                    </IonCol>
                    <IonCol size="4">
                        <div className="userDataContainerInputs">
                            <IonRow>
                                <IonCol size="6" style={{'padding': '0px 5px 0px 5px'}}>
                                    <p className="label-user">{t('admin:createUser:inputs:firstName').toUpperCase()}</p>
                                    <IonInput onIonInput={(e: any) => {setUserEdit({...userEdit, name: e.detail.value})}} value={userEdit.name} className="userDataContainerInputsElements" fill="outline"></IonInput>
                                </IonCol>
                                <IonCol size="6" style={{'padding': '0px 5px 0px 5px'}}>
                                    <p className="label-user">{t('admin:createUser:inputs:last').toUpperCase()}</p>
                                    <IonInput onIonInput={(e: any) => {setUserEdit({...userEdit, lastName: e.detail.value})}} value={userEdit.lastName} className="userDataContainerInputsElements" fill="outline"></IonInput>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="6" style={{'padding': '0px 5px 0px 5px'}}>
                                    <p className="label-user">{t('admin:createUser:inputs:dateOfBirth').toUpperCase()}</p>
                                    <IonInput value={userEdit.dateOfBirth ? new Date(userEdit.dateOfBirth).toLocaleDateString() : null} id="click-trigger" className="userDataContainerInputsElements" fill="outline" onIonFocus={addDate}></IonInput>
                                    <IonPopover ref={popover} isOpen={popoverOpen} onDidDismiss={() => setPopoverOpen(false)}>
                                        <IonDatetime presentation="date" onIonChange={newDate} />
                                    </IonPopover>
                                </IonCol>
                                <IonCol size="6" style={{'padding': '0px 5px 0px 5px'}}>
                                    <p className="label-user">{t('admin:createUser:inputs:mobile').toUpperCase()}</p>
                                    <IonInput onIonInput={(e: any) => {setUserEdit({...userEdit, phone: e.detail.value})}} value={userEdit.phone} className="userDataContainerInputsElements" fill="outline" ></IonInput>
                                </IonCol>
                            </IonRow>
                            <IonRow>
                                <IonCol size="6" style={{'padding': '0px 5px 0px 5px'}}>
                                    <p className="label-user">{t('admin:createUser:inputs:email').toUpperCase()}</p>
                                    <IonInput onIonInput={(e: any) => {setUserEdit({...userEdit, email: e.detail.value})}} value={userEdit.email} className="userDataContainerInputsElements" fill="outline"></IonInput>
                                </IonCol>
                                <IonCol size="6" style={{'padding': '0px 5px 0px 5px'}}>
                                    <p className="label-user">{t('admin:createUser:inputs:password').toUpperCase()}</p>
                                    <IonInput onIonInput={(e: any) => {setPassword(e.detail.value)}} className="userDataContainerInputsElements" fill="outline" type={typePassword}></IonInput>
                                </IonCol>
                            </IonRow>
                            {(roles[0] && roles[0].name === 'SuperAdmin') && <IonRow>
                                <IonCol size="6" style={{'padding': '0px 5px 0px 5px'}}>
                                    <p className="label-user">{t('admin:createUser:inputs:companies').toUpperCase()}</p>
                                    <IonSelect className="userDataContainerInputsElements" fill="outline" value={companySelected} onIonChange={(e) => {setCompanySelected(e.target.value)}}>
                                        {
                                            companies.map((company, i) => {
                                                return(
                                                    <IonSelectOption key={`company_${i}`} value={company._id}>{company.name}</IonSelectOption>
                                                )
                                            })
                                        }
                                    </IonSelect>
                                </IonCol>
                                <IonCol size="6" style={{'padding': '0px 5px 0px 5px'}}>
                                    <p className="label-user">{t('admin:createUser:inputs:roles').toUpperCase()}</p>
                                    <IonSelect disabled={!companySelected} className="userDataContainerInputsElements" fill="outline" multiple value={roleSelected} onIonChange={(e) => {setRoleSelected(e.target.value)}}>
                                        {
                                            roleList.map((role, i) => {
                                                return (
                                                    <IonSelectOption key={`role_${i}`} value={role._id}>{role.name}</IonSelectOption>
                                                )
                                            })
                                        }
                                    </IonSelect>
                                </IonCol>
                            </IonRow>}
                            {(roles[0] && roles[0].name != 'SuperAdmin') && <IonRow>
                                <IonCol size="6" style={{'padding': '0px 5px 0px 5px'}}>
                                    <p className="label-user">{t('admin:createUser:inputs:roles').toUpperCase()}</p>
                                    <IonSelect className="userDataContainerInputsElements" fill="outline" multiple value={roleSelected} onIonChange={(e) => {setRoleSelected(e.target.value)}}>
                                        {
                                            allRoles.map((role, i) => {
                                                return (
                                                    <IonSelectOption key={`role_${i}`} value={role._id}>{role.name}</IonSelectOption>
                                                )
                                            })
                                        }
                                    </IonSelect>
                                </IonCol>
                                <IonCol size="6" style={{'padding': '0px 5px 0px 5px'}}>
                                </IonCol>
                            </IonRow>}
                            <IonRow>
                                <IonToolbar style={{'--background':'transparent'}}>
                                    <IonButtons slot="end">
                                        <IonButton className="button-cancel" fill="outline" onClick={() => {history.back()}}>
                                            Cancel
                                        </IonButton>
                                        <IonButton className="button-add" fill="solid" onClick={() => {userDataEdited()}}>
                                            {params.user_id ? 'Edit' : 'Create'}
                                        </IonButton>
                                    </IonButtons>
                                </IonToolbar>
                            </IonRow>
                        </div>
                    </IonCol>
                    <IonCol size="3" />
                </IonRow>
            </IonGrid>
        </IonContent>
    )
}