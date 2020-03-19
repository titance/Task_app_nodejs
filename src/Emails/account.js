// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//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

const welcomeemail = (email, name) => {

    sgMail.send({
        to: email,
        from: 'anonymoustu24@gmail.com',
        subject: 'Welcome to family ',
        text: 'Welcome to the app,' + name + '. Let me know you enjoyed app.'
    })
}

const goodbyeemail = (email, name) => {

    sgMail.send({
        to: email,
        from: 'anonymoustu24@gmail.com',
        subject: 'you can Go  ',
        text: 'Good bye,' + name + '. we will miss you. :)'
    })
}

module.exports = {
    welcomeemail,
    goodbyeemail
}

// const msg = (email)=>{
//     to: 'anonymoustu24@gmail.com',
//     from: 'anonymoustu24@gmail.com',
//     subject: 'Sending with Twilio SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
// sgMail.send(msg);