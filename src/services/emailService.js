require('dotenv').config()
const nodemailer = require("nodemailer");

const sendSimpleEmail = async (data) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        // host: "smtp.gmail.com",
        // port: 587,
        // secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.MAIL_APP_PASSWORD,
            // clientId: '779476470898-56kf9kgejgg8k9c80ih906jpoioq6vt6.apps.googleusercontent.com',
            // clientSecret: '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',
            // refreshToken: ''
        },
    });

    let mailOptions = {
        from: 'Minh Pham 👻 <ngocminhpham2004hn@gmail.com>', // sender address
        to: data.receiverEmail, // list of receiverssubject: "Hello ✔", // Subject line
        text: "Thông tin đặt lịch khám bệnh", // plain text body
        html: getBodyHTMLEmail(data)

    }

    await transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log('Error');
        } else {
            console.log('Email sent')
        }
    })
}

const getBodyHTMLEmail = (data) => {
    let result = ''
    if (data.language === 'vi') {
        result =
            `
        <h3>Xin chào ${data.patientName} </h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online qua chúng tôi</p>
        <p>Thông tin đặt lịch khám bệnh: </p>
        <div><b>Thời gian: ${data.time}</b></div>
        <div><b>Bác sĩ: ${data.doctorName}</b></div>
        <p>Nếu những thông tin trên đã chính xác, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
        <div>
        <a href=${data.redirectLink} target="_blank">Nhấn vào đây để xác nhận lịch hẹn</a>
        </div>
        <div>Xin chân thành cảm ơn!</div>
        `
    }
    if (data.language === 'en') {
        result =
            `
        <h3>Dear ${data.patientName} </h3>
        <p>You receive this email as having booked online via our website</p>
        <p>Appointment information: </p>
        <div><b>Time: ${data.time}</b></div>
        <div><b>Doctor: ${data.doctorName}</b></div>
        <p>If the above information about your booking is true, please click in the link below to confirm and fulfill the procedure booking an appointment</p>
        <div>
        <a href=${data.redirectLink} target="_blank">Click here to confirm appointment</a>
        </div>
        <div>Best regards!</div>
        `
    }
    return result
}

const sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.MAIL_APP_PASSWORD,
        },
    });

    let mailOptions = {
        from: 'Minh Pham 👻 <ngocminhpham2004hn@gmail.com>', // sender address
        to: dataSend.email, // list of receiverssubject: "Hello ✔", // Subject line
        text: "Kết quả đặt lịch khám bệnh", // plain text body
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
            {
                filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split("base64,")[1],
                encoding: 'base64'
            }
        ]
    }

    await transporter.sendMail(mailOptions, function (err, res) {
        if (err) {
            console.log('Error');
        } else {
            console.log('Email sent')
        }
    })
}

const getBodyHTMLEmailRemedy = (data) => {
    let result = ''
    if (data.language === 'vi') {
        result =
            `
        <h3>Xin chào ${data.patientName}!</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online thành công</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kém</p>
        <div>Xin chân thành cảm ơn!</div>
        `
    }
    if (data.language === 'en') {
        result =
            `
        <h3>Dear ${data.patientName}!</h3>
        <p>You receive this email as having booked online successfully</p>
        <p>Information related to your remedy is sent in the attached file below</p>
        
        <div>Best regards!</div>
        `
    }
    return result
}

module.exports = {
    sendSimpleEmail,
    sendAttachment
}