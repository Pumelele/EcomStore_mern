import nodemailer from nodemailer;
import { useCart } from "../client/src/context/cart";
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    export const sendEmailController = (req, res) => {
      try {
        const { name, email} = req.body;
        const msg = useCart.toString()
    
        //validation
        if (!name || !email || !msg) {
          return res.status(500).send({
            success: false,
            message: "Please Provide All Fields",
          });
        }
        //email matter
        transporter.sendMail({
          to: "rktechnicalplus@gmail.com",
          from: "rktechnicalplus@gmail.com",
          subject: "Regarding Mern Portfolio App",
          html: `
            <h5>Detail Information</h5>
            <ul>
              <li><p>Name : ${name}</p></li>
              <li><p>Email : ${email}</p></li>
              <li><p>Message : ${msg}</p></li>
            </ul>
          `,
        });
    
        return res.status(200).send({
          success: true,
          message: "Your Message Send Successfully",
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({
          success: false,
          message: "Send Email API Error",
          error,
        });
      }
    };
  