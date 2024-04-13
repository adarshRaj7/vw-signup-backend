const { Resend } = require('resend');

const resend = new Resend('re_LKJw86tz_NKECgeDssV4M1YvB4BLdJMRD');

 const sendEmail=async(userEmail, name, username)=>{

  
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: userEmail,
            subject: 'Verify your email address',
            html: `Hey ${name}, <br/> You have successfully created an account on Volkswagen with username ${username}! <br/> Now, just click <a href="/">here</a> to verify your email address and continue exploring our products. <br/>Thanks, <br/> Volkswagen Team`,
        });
        
        if (error) {
            console.log("Error sending email")
            return console.error({ error });
        }
        
        console.log("Email sent successfully");    
}
exports.sendEmail=sendEmail;