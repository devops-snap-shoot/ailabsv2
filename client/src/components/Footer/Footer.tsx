import { IonCol, IonGrid, IonRow, IonToolbar } from '@ionic/react'
import { ImKChatWhiteLogo } from '../../icons'
import { t } from 'i18next'

const Footer = () => {
    return (
        <IonToolbar className='footerContainer'>
            <IonGrid style={{padding: 0}}>
                <IonRow style={{padding: 0}}>
                    <IonCol style={{padding: 0}}>

                    </IonCol>
                    <IonCol style={{padding: 0}} sizeXl='8' sizeLg='9' sizeMd='10' sizeSm='12' sizeXs='12'>
                        <IonRow>
                            <IonCol sizeXl='2.4' sizeLg='2.4' sizeMd='12' sizeSm='12' sizeXs='12'>
                                <img src={ImKChatWhiteLogo} alt='logo-white' width={167} height={46} />
                                <p className='footerText'>{t('footer:copyRight')}</p>
                            </IonCol>
                            <IonCol sizeXl='2.4' sizeLg='2.4' sizeMd='3' sizeSm='3' sizeXs='6'>
                                <p className='footerTextTitle'>
                                    {t('footer:links:ai:title')}
                                </p>
                                <br />
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:ai:linkName1')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:ai:linkName2')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:ai:linkName3')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:ai:linkName4')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:ai:linkName5')}
                                </p>
                            </IonCol>
                            <IonCol sizeXl='2.4' sizeLg='2.4' sizeMd='3' sizeSm='3' sizeXs='6'>
                                <p className='footerTextTitle'>
                                    {t('footer:links:vr:title')}
                                </p>
                                <br />
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:vr:linkName1')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:vr:linkName2')}
                                </p>                               
                            </IonCol>
                            <IonCol sizeXl='2.4' sizeLg='2.4' sizeMd='3' sizeSm='3' sizeXs='6'>
                                <p className='footerTextTitle'>
                                    {t('footer:links:us:title')}
                                </p>
                                <br />
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:us:linkName1')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:us:linkName2')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:us:linkName3')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:us:linkName4')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:us:linkName5')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:us:linkName6')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:us:linkName7')}
                                </p>
                            </IonCol>
                            <IonCol sizeXl='2.4' sizeLg='2.4' sizeMd='3' sizeSm='3' sizeXs='6'>
                                <p className='footerTextTitle'>
                                    {t('footer:links:legal:title')}
                                </p>
                                <br />
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:legal:linkName1')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:legal:linkName2')}
                                </p>
                                <br />
                                <p className='footerTextTitle'>
                                    {t('footer:links:socialMedia:title')}
                                </p>
                                <br />
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:socialMedia:linkName1')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:socialMedia:linkName2')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:socialMedia:linkName3')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:socialMedia:linkName4')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:socialMedia:linkName5')}
                                </p>
                                <p className='footerText footerTextLink'>
                                    {t('footer:links:socialMedia:linkName6')}
                                </p>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                    <IonCol style={{padding: 0}}>

                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonToolbar>
    )
}

export default Footer