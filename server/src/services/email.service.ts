import smtp from '@/configs/smtp'
import nodemailer from 'nodemailer'
import { isEmpty } from '@/utils/util'
import Mail from 'nodemailer/lib/mailer'
import { appDomain } from '@/configs/env'

interface AddressObject {
    name: string
    address: string
}

/**
 * Create a new email transporter
 * @param {string} host - SMTP host
 * @param {number} port - SMTP port
 * @param {string} user - SMTP user
 * @param {string} pass - SMTP password
 * @returns {nodemailer.Transporter}
 */
export const createTransporter = (host: string, port: number, user: string, pass: string): nodemailer.Transporter => {
    console.log('APP DOMAIN ', appDomain)
    if (isEmpty(host) || isEmpty(port) || isEmpty(user) || isEmpty(pass)) {
        throw new Error('SMTP credentials are required')
    }
    return nodemailer.createTransport({
        name: host,
        host,
        port,
        secure: true,
        auth: { 
            user, 
            pass 
        },
        tls: {
            rejectUnauthorized: false
        }
        /* name: host,
        host,
        port,
        requireTLS: true,
        auth: { 
            user, 
            pass
        },
        tls: {
            servername: host,
            ciphers: 'SSLv3',
            rejectUnauthorized: false       
        },
        secure: true,
        logger: true,
        debug: true */
     })
}

/**
 * Send a HTML email
 * @param {string} to - The email address to send to
 * @param {string} subject - The subject of the email
 * @param {string} html - The HTML body of the email
 * @param {AddressObject=} from - The email address and name to send from (defaults to the SMTP config)
 */
export const sendHTMLEmail = async (
    to: string,
    subject: string,
    html: string,
    optionals?: {
        from?: AddressObject,
        attachments?: Mail.Attachment[]
    }
): Promise<nodemailer.SentMessageInfo> => {
    const transporter = createTransporter(smtp.host, smtp.port, smtp.user, smtp.pass)
    return await transporter.sendMail({
        from: `${smtp.from_name} <${smtp.from_email}>`/* optionals?.from || { name: smtp.from_name, address: smtp.from_email } */,
        to,
        subject,
        html,
        attachments: optionals?.attachments
    })
}

/**
 * Send a plain text email
 * @param {string} to - The email address to send to
 * @param {string} subject - The subject of the email
 * @param {string} text - The plain text body of the email
 * @param {AddressObject=} from - The email address and name to send from (defaults to the SMTP config)
 */
export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    optionals?: {
        from?: AddressObject
        attachments?: Mail.Attachment[]
    }
): Promise<nodemailer.SentMessageInfo> => {
    const transporter = createTransporter(smtp.host, smtp.port, smtp.user, smtp.pass)
    return await transporter.sendMail({
        from: optionals?.from || { name: smtp.from_name, address: smtp.from_email },
        to,
        subject,
        text,
        attachments: optionals?.attachments
    })
}
