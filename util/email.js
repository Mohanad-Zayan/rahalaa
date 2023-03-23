const nodemailer = require('nodemailer');


const   sendEmail= async options => {
    // 1 transporrter (the party that will send and recieve the email) 

    const  transporter = nodemailer.createTransport({
        host :  process.env.EMAIL_HOST,
        port :  process.env.EMAIL_PORT  ,
        auth: {
            user: process.env.EMAIL_USERNAME , 
            pass: process.env.EMAIL_PASSWORD , 
        }
    })


    const mailOption = {
        from : 'buizznzz name <>' ,
        to : options.email ,
        subject : options.subject ,
        text : options.message 
    }

    await transporter.sendMail(mailOption) ;    

}

module.exports = sendEmail ;