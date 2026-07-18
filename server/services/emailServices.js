import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport(
  {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_KEY,
    },
      tls: { rejectUnauthorized: false },
  }
);

const sendEmail = async (email, template) => {
  try {
    await transporter.verify();
    await transporter.sendMail({
      from: `JoveJobs <${process.env.EMAIL_USER}>`,
      to: email,
      subject: template.subject,
      text: template.textPlain,
      html: template.html,
    })
    console.log('Email enviado a ', email)
  } catch (error) {
    console.log('Error al enviar email: ', error)
  }
};

export default sendEmail;
