import nodemailer from "nodemailer"

import {config} from "dotenv"

config();

export const mailer = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODE_EMAIL,
        pass: process.env.EMAIL_KEY
    }
})

export  const sendMail = (to:string, subject:string, html:any) => {
    mailer.sendMail({
        from: process.env.NODE_EMAIL,
        to: to,
        subject: subject,
        html:html
    })
}
