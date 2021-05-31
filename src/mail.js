const mailer = require("nodemailer");
const { Login } = require("./public/login_template");

const getEmailData = (to,template,rand , host) => {
    let data = null;

    switch (template) {
        case "verify":
            const link = `http://${host}/mail/success` ;
            data = {
                from: "Harshit Srivastava <harshit.srivastava2001@gmail.com>",
                to,
                subject: `Hello subject verify ${to}`,
                html: Login(link,rand,to)
            }
            break;

        case "success":
            data = {
                from: "Harshit Srivastava <harshit.srivastava2001@gmail.com>",
                to,
                subject: `Hello success ${to}`,
                html: "Success"
            }
            break;
        default:
            data;
    }
    return data;
}

const sendEmail = (to,type,rand,host) => {

    const smtpTransport = mailer.createTransport({
        service: "gmail",
        auth: {
            user: "harshit.srivastava2001@gmail.com",
            pass: "lenovo@12345"
        }
    })

    const mail = getEmailData(to,type,rand,host);
    console.log(mail);
    smtpTransport.sendMail(mail, function(error, response) {
        if(error) {
            console.log('Error');
            console.log(error);
        } else {
            console.log( " email sent successfully")
        }
        smtpTransport.close();
    })
}

module.exports = { sendEmail };