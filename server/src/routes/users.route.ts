import { Router } from 'express'
import UsersController from '@controllers/users.controller'
import authMiddleware from '@/middlewares/auth.middleware'

const router = Router()

router.post(`/createUser`, /* authMiddleware, */ UsersController.createUser)
router.post(`/editUser`, /* authMiddleware, */ UsersController.editUser)
router.get(`/getUsersByCompany/:companyId`, /* authMiddleware, */ UsersController.getUsersByCompany)
router.post(`/getUserById`, authMiddleware, UsersController.getUserById)
router.get(`/deleteUser/:id`, authMiddleware, UsersController.deleteUser)
router.get(`/getUsers`, /* authMiddleware, */ UsersController.getUsers)

export default router
