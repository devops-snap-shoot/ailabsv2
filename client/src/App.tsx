import React, { useEffect, useState } from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'
import './App.css'
import './K-Eternal.css'
import { AdminPage, HomePage, LoginPage, OptionsPage, WelcomePage } from './pages'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resources from './locales'
import { Header } from './components'
import { AuthProvider, useAuthContext } from './context/Auth.context'
import { MessagesProvider } from './context/Messages.context'
import { FilesProvider } from './context/Files.context'
import { UsersProvider } from './context/Users.context'
import { UserCreatePage } from './pages/Admin/PagesAdmin/UserCreate.page'
import { SocketProvider } from './context/Socket.context'
import { NavbarComponent } from './components/Navbar/Navbar.component'
import { AvatarProvider } from './context/Avatar.context'
import RestorePasswPage from './pages/RestorePassw/RestorePassw.page'
import CreateNewPasswordPage from './pages/CreateNewPassword/CreateNewPassword.page'
import { UploadAudioPage } from './pages/Upload/UploadAudio.page'
import { FilesPage } from './pages/Files/Files.page'
setupIonicReact()

const ImKChatApp = () => {
  
  Notification.requestPermission();
  i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        fallbackLng: 'en',
        debug: true,
        ns: [],
        defaultNS: 'common',
        keySeparator: false,
        interpolation: {
            escapeValue: false,
            formatSeparator: ','
        }
    })
  return (
    
    <IonReactRouter>
        <AuthProvider>
          <UsersProvider>
            <MessagesProvider>
              <FilesProvider>
                <SocketProvider>
                  <AvatarProvider>
                    <IonRouterOutlet>
                      <Header />
                      <RouterApp />
                    </IonRouterOutlet>
                  </AvatarProvider>
                </SocketProvider>
              </FilesProvider>
            </MessagesProvider>
          </UsersProvider>
        </AuthProvider>
      </IonReactRouter>
    
  )
}

const RouterApp = () => {
  const {enableNavbar, setEnableNavbar, setContainerWidth, setContainerHeight, isSmartPhone, isAuth} = useAuthContext()
  const location = useLocation()
  useEffect(() => {
    if (location.pathname ==='/home') {
      setEnableNavbar(true)
    }
  }, [location])

  useEffect(() => {
    const resize_ob = new ResizeObserver((entries) => {
      // since we are observing only a single element, so we access the first element in entries array
      const rect = entries[0].contentRect;
      // current width & height
      const width = rect.width;
      const height = rect.height
      setContainerWidth(width)
      setContainerHeight(height)
    });
    
    // start observing for resize
    resize_ob.observe(document.querySelector("#main-content")!);
    
  }, [])

  return (
    <div id={'main-content'}>
        {(enableNavbar && !isSmartPhone) && <NavbarComponent />}
        <Route exact path='/welcome'>
          <WelcomePage />
        </Route>
        <Route exact path='/login'>
          <LoginPage />
        </Route>
        <Route exact path='/login/:tokenData'>
          <CreateNewPasswordPage />
        </Route>
        <Route exact path='/restore-password'>
          <RestorePasswPage />
        </Route>
        <Route exact path='/upload_audio'>
          <UploadAudioPage />
        </Route>
        <Route exact path='/home'>
          <HomePage />
        </Route>
        <Route exact path='/home/:avatarId'>
          <HomePage />
        </Route>
        <Route exact path='/admin'>
          <AdminPage />
        </Route>
        <Route exact path='/admin/:page'>
          <AdminPage />
        </Route>
        <Route exact path='/admin/create-user'>
          <UserCreatePage />
        </Route>
        <Route exact path='/admin/edit-user/:user_id'>
          <UserCreatePage />
        </Route>
        <Route exact path='/options'>
          <OptionsPage />
        </Route>
        <Route exact path='/files'>
          <FilesPage />
        </Route>
        <Route exact path='/'>
          <Redirect to={'/login'} />
        </Route>
      </div>
  )
}

const App = () => {
  return (
    <IonApp>
      <ImKChatApp />
    </IonApp>
  )
}
  


export default App;
