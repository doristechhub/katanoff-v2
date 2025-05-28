const nodemailer = require("nodemailer");

const sendMail = (toMail, subject, body) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailData = {
      from: process.env.EMAIL, // sender address
      to: toMail, // list of receivers
      subject, // Subject line
      // text: body, // plain text body
      html: body, // html body
    };

    transporter.sendMail(mailData, (error, info) => {
      if (error) {
        reject(error);
      } else {
        console.log("email sent" + info.response);
        resolve(info.response);
      }
    });
  });
};

module.exports = { sendMail };
