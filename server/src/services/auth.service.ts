import { env, keys } from '@configs/index'
import { HttpException } from '@exceptions/HttpException'
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface'
import { User } from '@interfaces/users.interface'
import userModel from '@models/users.model'
import { asset, frontendAsset, isEmpty } from '@utils/util'
import { logger } from '@/utils/logger'
import { generateHTML } from '@/utils/html'
import bcrypt from 'bcrypt'
import { __ } from 'i18n'
import jwt from 'jsonwebtoken'
import { sendHTMLEmail } from './email.service'
import path from 'path'
import { ObjectId } from 'mongoose'
import { environment } from '@/configs/env'
import smtp from '@/configs/smtp'
import { Role } from '@/interfaces/roles.interface'
/* import avatarModel from '@/models/avatares.model' */

const user = userModel

const signup = async (
    userData: User,
    locale: string = env.locale
) => {
    if (isEmpty(userData)) throw new HttpException(400, __({ phrase: 'Credentials are required', locale }))

    const findUser: User = await user.findOne({ email: userData.email }).populate('roles')
    if (findUser)
        throw new HttpException(
            409,
            __({ phrase: 'Email {{email}} already exists', locale }, { email: userData.email })
        )

    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const createUserData: User = await user.create({ ...userData, password: hashedPassword })
    const loginToken = createToken(createUserData)
    const cookie = createCookie(loginToken)

    const verificationToken = createToken(createUserData, 0)
    const args = {
        fullName: `${createUserData.name} ${createUserData.lastName}` ,
        email: createUserData.email,
        verifyLink: asset(`/verify?token=${verificationToken.token}`),
        platformURL: env.url,
        platformName: env.platformName
    }
    sendHTMLEmail(
        createUserData.email,
        __({ phrase: 'Verify your email', locale }),
        generateHTML(path.join(__dirname, `/../email.templates/verify.email.template/${locale}.html`), args),
        { attachments: [{ filename: 'logo.png', path: frontendAsset('images/logo.png'), cid: 'logo' }] }
    ).catch(err => logger.error(__({ phrase: err.message, locale })))

    return { cookie, createdUser: createUserData }
}

const login = async (
    userData: User,
    orgId?: string,
    locale: string = env.locale
) => {
    console.log(userData, locale)
    if (isEmpty(userData)) throw new HttpException(400, __({ phrase: 'Credentials are required', locale }))

    const findUser: User = (await user.findOne({ email: userData.email }).populate('roles').populate('speciality').populate('organization').populate('userOtherData'))
    if (!findUser)
        throw new HttpException(410, __({ phrase: 'Email {{email}} not found', locale }, { email: userData.email }))

    const userOrgId: any = findUser.organization[0]
    const role = findUser.roles[0] as Role
    /* const avatars = await avatarModel.find({users: {'$in': [findUser._id]}}) */

    if (role.name === 'SuperAdmin') {
        console.log(findUser.roles[0])
        const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password)
        if (!isPasswordMatching) throw new HttpException(409, __({ phrase: 'Wrong password', locale }))
    
        const token = createToken(findUser, 86400)
        const cookie = createCookie(token)

        /* const avatars = await avatarModel.find({users: {'$in': [findUser._id]}}) */
    
        return { cookie, findUser, token }
    } else if ((userOrgId && orgId) && (userOrgId.toString() === orgId.toString())) {
        const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password)
        if (!isPasswordMatching) throw new HttpException(409, __({ phrase: 'Wrong password', locale }))
    
        const token = createToken(findUser, 86400)
        const cookie = createCookie(token)

    
        return { cookie, findUser, token }
    } else {
        const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password)
        if (!isPasswordMatching) throw new HttpException(409, __({ phrase: 'Wrong password', locale }))
    
        const token = createToken(findUser, 86400)
        const cookie = createCookie(token)

        /* const avatars = await avatarModel.find({users: {'$in': [findUser._id]}}) */
    
        return { cookie, findUser, token }
        /* throw new HttpException(410, __({ phrase: 'organization not user', locale }, { email: userData.email })) */
    }
}

const logout = async (userData: User, locale: string = env.locale) => {
    if (isEmpty(userData)) throw new HttpException(400, __({ phrase: 'Credentials are required', locale }))
    const findUser: User = await user.findOne({ email: userData.email/* , password: userData.password */ })
    if (!findUser)
        throw new HttpException(409, __({ phrase: 'Email {{email}} not found', locale }, { email: userData.email }))

    return findUser
}

const verifyUserEmail = async (userId: ObjectId, locale: string = env.locale) => {
    if (isEmpty(userId)) throw new HttpException(400, __({ phrase: 'An ID is required', locale }))

    let findUser = await user.findOne({ _id: userId })
    if (!findUser) throw new HttpException(409, __({ phrase: 'User not found', locale }))

    findUser.emailVerifiedAt = new Date()
    findUser = await findUser.save()
    if (!findUser) throw new HttpException(409, __({ phrase: 'Unable to update user', locale }))

    return findUser
}

/**
 * Initiates reset password process for a given email
 * @param {*} email Email for which to initiate the reset password process
 * @returns Object, data to generate email to send (reset token, fullname, email)
 */
const forgotPassword = async (email: string, subdomain: string, locale: string = env.locale, logo: string, iconPage: string) => {
    console.log(email)
    console.log(locale)
    console.log(subdomain)
    const findUser: User = await user.findOneAndUpdate(
        { email },
        { updatedAt: new Date() },
        { new: true, timestamps: false }
    )
    if (isEmpty(findUser))
        throw new HttpException(409, __({ phrase: 'Email {{email}} not found', locale }, { email }))
    const resetToken = createToken(findUser)
    console.log(resetToken.token)
    const args = {
        fullName: `${findUser.name} ${findUser.lastName}`,
        resetLink: (environment==='production') ? `https://app.ai-labhelper.com/login/${resetToken.token}` : `http://localhost:8101/login/${resetToken.token}`,
        logo: 'https://app.ai-labhelper.com/assets/icon/logo-ailab.png',
        buttonStyle: 'default'
        
        
    }
    console.log(frontendAsset('assets/images/Imkchat.png'))
    console.log(path.join(__dirname, `/../../email.templates/reset.password.template/${locale}.html`))
    const optionals = {
        from: {
            name: smtp.from_name,
            address: smtp.from_email
        },
        /* attachments: [{ filename: 'Imkchat.png', path: frontendAsset('assets/images/Imkchat.png'), cid: 'logo' }] */
    }
    const data = await sendHTMLEmail(
        findUser.email,
        'Reset your password',
        generateHTML(path.join(__dirname, `/../../email.templates/reset.password.template/${locale}.html`), args),
        optionals
    )
    
    if (environment === 'development') {
        console.log(data)
    }

    return findUser
}

/**
 * Resets password for a given token
 * @param {string} token Token to reset password
 * @param {string} password New password
 * @returns {User} data of the updated user
 */
const resetPassword = async (token: string, password: string, locale: string = env.locale) => {
    if (isEmpty(token)) throw new HttpException(400, __({ phrase: 'Token is required', locale }))
    if (isEmpty(password)) throw new HttpException(400, __({ phrase: 'Password is required', locale }))

    const tokenData: DataStoredInToken = verifyToken(token)
    if (!tokenData) throw new HttpException(409, __({ phrase: 'Invalid token', locale }))

    const hashedPassword = await bcrypt.hash(password, 10)

    const findUser: User = await user.findOneAndUpdate(
        { _id: tokenData._id },
        { password: hashedPassword },
        { new: true }
    )
    if (!findUser) throw new HttpException(409, __({ phrase: 'User not found', locale }))
    return findUser
}

const createToken = (user: User, expiresIn = 3600) => {
    const dataStoredInToken: DataStoredInToken = { _id: user._id } // user._id, [organizationId, resources]
    const secretKey: string = keys.secretKey

    return { expiresIn, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }) }
}

const verifyToken = (token: string, ignoreExpiration = false) => {
    const secretKey: string = keys.secretKey

    return jwt.verify(token, secretKey, { ignoreExpiration }) as DataStoredInToken
}

const createCookie = (tokenData: TokenData) => {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`
}

export default {
    signup,
    login,
    logout,
    verifyUserEmail,
    forgotPassword,
    resetPassword,
    createToken,
    verifyToken,
    createCookie
}
