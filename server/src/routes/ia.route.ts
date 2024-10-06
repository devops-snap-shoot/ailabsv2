import { Router } from 'express'
import IaController from '@controllers/ia.controller'

const router = Router()

router.post(`/upload_pdf`, IaController.uploadPdf)
router.post(`/chat`, IaController.chat)
router.post(`/delete_pdf`, IaController.deletePdf)
router.post('/upload_pdf_local', IaController.upload_pdf_local)
router.post('/chat_gpt', IaController.chatGPT)
router.post(`/fileToJson`, IaController.fileToJson)

router.post('/gemini-chat', IaController.geminiChat)

router.get('/testUploadFile', IaController.testUploadFile)
router.get('/geminiDeleteFile', IaController.geminiDeleteFile)
router.get('/createIaContext/:userId', IaController.createIaContext)



router.post('/deleteCacheContent', IaController.deleteCacheContent)
router.get('/getCacheList', IaController.getCacheList)
router.get('/deleteAllCacheList', IaController.deleteAllCacheList)
router.get('/getAllMessages/:userId', IaController.getAllMessages)

export default router