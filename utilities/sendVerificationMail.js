const createHttpError = require("http-errors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendVerificationMail = async (receiver, data, cb) => {
  try {
    //send mail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PWD,
      },
    });

    //option
    const options = {
      from: process.env.EMAIL,
      to: receiver.join(","),
      subject: data.subject,
      html: data.template,
      attachments: data.attachments,
    };

    transporter.sendMail(options, cb);
  } catch (error) {
    throw createHttpError(500, "Internal Server Error");
  }
};
module.exports = sendVerificationMail;
