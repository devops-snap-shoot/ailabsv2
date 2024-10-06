import { Router } from 'express'
import azureStorageService from '@/services/azure-storage.service'

const router = Router()

router.post(`/upload_image`, azureStorageService.uploadImage)

export default router