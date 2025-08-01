const nodemailer = require("nodemailer");

const sendMail = (toMail, subject, body) => {
  return new Promise((resolve, reject) => {
    // for gmail
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

    // for hostinger
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.hostinger.com", // Replace with your SMTP server host
    //   port: 465, // Replace with your SMTP server port (587 or 465)
    //   secure: true, // true for 465, false for 587
    //   auth: {
    //     user: process.env.EMAIL, // Your email address
    //     pass: process.env.PASSWORD, // Your email password or app-specific password
    //   },
    //   tls: {
    //     rejectUnauthorized: false, // Use only if necessary
    //   },
    // });

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
