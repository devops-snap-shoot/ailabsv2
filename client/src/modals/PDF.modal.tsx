import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonIcon, IonModal } from "@ionic/react"
import { close } from "ionicons/icons";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = './pdf/pdf.worker.min.js' /* `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`; */

const PDFModal = ({open, closeModal, loading, pdfFile, reference}: {open: boolean, closeModal: () => void, loading: boolean, pdfFile: string, reference: {page_content: string, metadata: any}}) => {
    const [numPages, setNumPages] = useState<number>(1);
    const [pageNumber, setPageNumber] = useState(1);
    const [loadedData, setLoadedData] = useState<{loaded: number, total: number}>()
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)

    const onDocumentLoadSuccess = (e: any/* {numPages}: {numPages: number} */) => {
        console.log(e)
        setNumPages(e.numPages)
    }

    useEffect(() => {
        console.log(reference)
    }, [reference])

    useEffect(() => {
        if (loadedData) {
            if (loadedData.loaded === loadedData.total) {
                setPageNumber(reference.metadata.page)
                setTimeout(() => {
                    const container = document.getElementById('pdf-content')
                    if (container) {
                        setHeight(container.offsetHeight)
                        setWidth(container.offsetWidth)
                    }
                    setTimeout(() => {
                        const textList = reference.page_content
                        const arrayText = textList.split('\n')
                        const elements = Array.prototype.slice.call(document.getElementsByTagName('span'))
                        console.log(arrayText)
                        elements.forEach((e, i) => {
                            if ((e.innerText.toString()).length > 1) {
                                console.log(arrayText)
                                arrayText.forEach((text, i) => {
                                    if (`${text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1").toString().match(`${e.innerText.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"))) {
                                        e.className = 'backgroundNewColor'
                                    } else {
                                        if (text.length > 0 || text !== ' ') {
                                            if (text.normalize("NFD").replace(/[\u0300-\u036f]/g, "") === e.innerText.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
                                                e.className = 'backgroundNewColor'
                                            } else {
                                                if (text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, '').replace('ñ', 'fi') === e.innerText.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, "").replace('ñ', 'fi')) {
                                                    e.className = 'backgroundNewColor'
                                                }/*  else {
                                                    console.log(e.innerText.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
                                                    console.log(text.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
                                                } */
                                            }
                                        }
                                    }
                                }) 
                            }
                        })
                    }, 500);
                }, 1000)
            }
        }
    }, [loadedData])
    
    return (
        <IonModal
            className='pdfModal'
            isOpen={open}
            onWillDismiss={closeModal}
            backdropDismiss={!loading}
        >
            <IonContent id={'pdf-content'}>
                <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess} onLoadProgress={setLoadedData} >
                    <Page pageNumber={pageNumber + 1} width={width} height={height} />
                </Document>
            </IonContent>
            <IonButton fill={'clear'} style={{ position: 'absolute', top: 10, right: 10 }} onClick={closeModal}>
                <IonIcon icon={close} />
            </IonButton>
            <div style={{ position: 'relative', width: '100%' }}>
                <div style={{position: 'absolute', bottom: 10, left: 10, backgroundColor: '#fff', width: '80%'}}>
                    <IonButtons>
                        <IonButton disabled={pageNumber === 0} onClick={() => {setPageNumber(pageNumber - 1)}}>
                            Prev
                        </IonButton>
                        <IonButton disabled={pageNumber === (numPages)} onClick={() => {setPageNumber(pageNumber + 1)}}>
                            Next
                        </IonButton>
                        <p>
                            Page {pageNumber} of {numPages}
                        </p>
                    </IonButtons>
                </div>
            </div>
        </IonModal>
    )
}

export default PDFModal