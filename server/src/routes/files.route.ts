import { iaUrl } from '@/configs/env'
import avatarModel from '@/models/avatares.model'
/* import { reviewFileList } from '@/controllers/ia.controller' */
import filesDataModel from '@/models/filesData.model'
import fileJobsModel from '@/models/filesJobs.model'
import axios, { AxiosError } from 'axios'
import { Request, Response, Router } from 'express'

const router = Router()

router.post(`/getFilesByUserId`, async (req: Request, res: Response) => {
    const {userId} = req.body
    try {
        const files = await filesDataModel.find({userId: {$in: [userId]}}).populate('userId')
        res.status(200).json({state: true, files: files})
    } catch (error) {
        res.status(400).json({state: false, error: error})
    }
})

router.post(`/getFilesByCompany`, async (req: Request, res: Response) => {
    const {companyId} = req.body
    try {
        const files = await filesDataModel.find({organization: companyId}).populate('organization')
        console.log('Files_ ', files)
        res.status(200).json({state: true, files: files})
    } catch (error) {
        res.status(400).json({state: false, error: error})
    }
})

router.get(`/getFileByFileID/:id`, async (req: Request, res: Response) => {
    const {id} = req.params
    console.log('ID AVATAR', id)
    try {
        const avatar = await avatarModel.findOne({idAvatar: id}).populate('doc')
        console.log(avatar)
        res.status(200).json({state: true, avatar})
    } catch (error) {
        res.status(400).json({state: false, error: error})
    }
})

router.get(`/getFiles`, async (req: Request, res: Response) => {
    try {
        const files = await filesDataModel.find().populate('userId')
        res.status(200).json({state: true, files: files})
    } catch (error) {
        res.status(400).json({state: false, error: error})
    }
})

router.post('/deleteFile', async (req: Request, res: Response) => {
    const {fileData} = req.body
    const token = req.headers.authorization
    const tokenToServer = `${token}${fileData.id}`
    const client = axios.create({
        baseURL: iaUrl,
        timeout: 100000,
        headers: {
            'content-type': 'application/json',
        }
    })
    client.delete(`/api/sessions/${tokenToServer}`)
    .then(async data => {
        console.log('response: ', data.data)
        if (data) {
            const files = await filesDataModel.findByIdAndDelete(fileData._id)
            await fileJobsModel.findOneAndDelete({idFile: fileData.id})
            res.status(200).json({state: true, msg: 'deleted'})
        }

    })
    .catch(async (err: AxiosError) => {
        if (err.response && err.response.data) {
            const data: any = err.response.data
            if (data.detail === 'Not Found') {
                const files = await filesDataModel.findByIdAndDelete(fileData._id)
                await fileJobsModel.findOneAndDelete({idFile: fileData.id})
                res.status(200).json({state: true, msg: 'deleted'})
            }
        } else {
            res.status(400).json(err)
        }
    })

})

router.post(`/updateFileById`, async (req: Request, res: Response) => {
    const {fileData} = req.body
    const token = req.headers.authorization
    try {
        const file = await filesDataModel.findByIdAndUpdate(fileData._id, {...fileData, wait: false}, {new: true})
        if (file) {
            console.log(file)
            const tokenToServer = `${token}${file.id}`
            const buffer = await axios.get(file.url, {responseType: 'arraybuffer'})
            const fileChecked = {
                originalname: file.name,
                buffer: buffer.data
            }
            const fileToSend = {
                tokenToServer: tokenToServer,
                file: fileChecked,
                token: token,
                idFile: file.id
            }
            const client = axios.create({
                baseURL: iaUrl,
                timeout: 1000000
            })
            client.get(`/api/sessions/`)
            .then(async (data) => {
                console.log(data.data)
                if (data.data.sessions) {
                    const sessions: any[] = data.data.sessions
                    const filterSesion = sessions.filter(x => (x === tokenToServer))
                    let file_: any = file
                    if (filterSesion.length === 0) {
                        res.status(200).json({state: true, file: file_})
                        /* reviewFileList(fileToSend) */
                    } else {
                        file_ = await filesDataModel.findByIdAndUpdate(fileData._id, {...fileData, wait: false}, {new: true})
                        res.status(200).json({state: true, file: file_})
                    }
                } else {
                    res.status(400).json({state: false, error: 'Error response ia'})
                }
            })
            .catch((err) => {
                console.log(err)
                res.status(400).json({state: false, error: err})
            })
        }
        
    } catch (error) {
        console.log(error)
        res.status(400).json({state: false, error: error})
    }
})

export default router