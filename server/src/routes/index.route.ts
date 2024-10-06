import { Router } from 'express'
import AuthRouter from './auth.route'
import UsersRouter from './users.route'
import IaRouter from './ia.route'
import FilesRouter from './files.route'
import OrganizationRouter from './organizations.route'
import RolesRouter from './roles.route'
import ImagesRouter from './images.route'

const router = Router()

router.use('/api', AuthRouter)
router.use('/api/users', UsersRouter)
router.use('/api/ia', IaRouter)
router.use('/api/files', FilesRouter)
router.use('/api/organization', OrganizationRouter)
router.use('/api/roles', RolesRouter)
router.use('/api/images', ImagesRouter)

export default router
