import nodemailer from 'nodemailer'

let mail

async function mailInit() {
  try {
    let testAccount = await nodemailer.createTestAccount()
    mail = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
  } catch (e) {
    console.error(e)
  }
}

async function sendEmail({
  from = 'chanaka@example.com',
  to = 'chanaka@example.com',
  subject,
  html,
}) {
  try {
    let info = await mail.sendMail({ from, to, subject, html })
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    console.log('info', info)
  } catch (e) {
    console.error(e)
  }
}

export { mailInit, sendEmail }
