import nodemailer from 'nodemailer';

export const sendEmail = async (recipientEmail, subject, text,htmlContent) => {
   
    let transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: "projecttest088@gmail.com", 
            pass: "vyzl bowj hshd apbo", 
        },
    });

   
    let mailOptions = {
        from: "sanjana.nim2001@gmail.com", 
        to: recipientEmail, 
        subject: subject, 
        text: text,
        html: htmlContent,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${recipientEmail}`);
    } catch (error) {
        console.log(`Error sending email: ${error.message}`);
    }
};
