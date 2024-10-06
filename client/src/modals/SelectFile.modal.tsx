import { IonButton, IonButtons, IonContent, IonIcon, IonItem, IonLabel, IonList, IonModal, IonToolbar } from '@ionic/react'
import './modals.css'
import { useFilesContext } from '../context/Files.context'
import { useEffect, useState } from 'react'
import { FilesData } from '../interfaces/Files.interface'
import { chevronForward, close, cloudUploadOutline } from 'ionicons/icons'
import { useAuthContext } from '../context/Auth.context'
import { uploadFile } from '../routes/ia.routes'
import CircularProgress, {
    CircularProgressProps,
  } from '@mui/material/CircularProgress';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CircularProgressWithLabel(
    props: CircularProgressProps & { value: number },
  ) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
          >{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  }
  
  

const SelectFileModal = ({open, handleClose}:{open: boolean, handleClose: () => void}) => {
    const {userId} = useAuthContext()
    const {files, setFileSelected, getFiles} = useFilesContext()
    const [filesLoad, setFilesLoad] = useState<any[]>([])

    useEffect(() => {
        console.log(files)
    }, [files])

    const selectFile = (file: FilesData) => {
        setFileSelected(file)
        handleClose()
    }

    const getFile = () => {
        const input = document.getElementById('file-uploader')
        if (input) {
            input.click()
        }
    }

    const progress = (e: any, nameFile: string, idFile: number) => {
        console.log(e.progress * 100)
        console.log(e.loaded === e.total)
        console.log((e.loaded === e.total) ? true : false)
        /* const isLoaded = (e.loaded === e.total) ? true : false */
        /* const filesLoadTemp = [...filesLoad]
        const fileIndex = filesLoadTemp.findIndex((file) => {
            (file.name === nameFile && idFile === file.id)
        })
        console.log(fileIndex)
        if (e.progress ) {
            filesLoadTemp[fileIndex].progress = (e.progress * 100)
            setFilesLoad(filesLoadTemp)
        }

        if (isLoaded) {
            const filesLoadCache = filesLoad.filter(file => {
                return (idFile !== file.id)
            })
            setFilesLoad(filesLoadCache)
        } */
        
    }

    const getFileToSendServer = async (e: any) => {
        console.log(e.target.files[0])
        const file = e.target.files[0]
        const filesLoadCache: any[] = [...filesLoad]
        const newFile = {
            name: e.target.files[0].name,
            id: Date.now()
        }
        filesLoadCache.push(newFile)
        setFilesLoad(filesLoadCache)
        const response = await uploadFile(file, userId, newFile.id, progress)
        console.log(response)
        getFiles()
    }



    return (
        <IonModal
            isOpen={open}
            onWillDismiss={() => {handleClose()}}
            backdropDismiss={false}
        >
            <IonToolbar>
                <div style={{paddingLeft: 15}}>
                    <h3 style={{fontFamily: 'Poppins'}}>File list</h3>
                    <input type='file' accept='application/pdf' style={{display:'none'}} id={'file-uploader'} onChange={getFileToSendServer} />
                </div>
                <IonButtons slot='end'>
                    <IonButton onClick={() => {getFile()}}>
                        <IonIcon icon={cloudUploadOutline} />
                    </IonButton>
                    <IonButton onClick={() => {handleClose()}}>
                        <IonIcon icon={close} />
                    </IonButton>
                </IonButtons>
            </IonToolbar>
            <IonContent className='modalContainer'>
                <IonList>
                    {
                        files.map((file) => {
                            return (
                                <IonItem key={file.name} button onClick={() => {selectFile(file)}}>
                                    <IonLabel style={{fontFamily: 'Poppins', fontSize: 14}}>{file.name}</IonLabel>
                                    <IonIcon icon={chevronForward}/>
                                </IonItem>
                            )
                        })
                    }
                    {/* {
                        filesLoad.map((file) => {
                            return (
                                <IonItem key={file.name} button onClick={() => {selectFile(file)}}>
                                    <IonLabel style={{fontFamily: 'Poppins', fontSize: 14}}>{file.name}</IonLabel>
                                    <IonIcon icon={chevronForward}/>
                                    <CircularProgressWithLabel value={file.progress} />
                                </IonItem>
                            )
                        })
                    } */}
                </IonList>
            </IonContent>
        </IonModal>
    )
}

export default SelectFileModal
