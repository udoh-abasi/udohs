import { createTransport } from "nodemailer";

const sendMail = async (email: string, code: string) => {
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL // Use `true` for port 465, `false` for all other ports
    auth: {
      user: "tropyganty0@gmail.com",
      pass: process.env.TROPYGANTY0_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Udoh from udohs" <tropyganty0@gmail.com>',
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is ${code}`,
  };

  // send mail with defined transport options
  await transporter.sendMail(mailOptions);
};

export default sendMail;
