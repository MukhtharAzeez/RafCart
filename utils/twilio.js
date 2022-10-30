const client =require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)



let sid

module.exports={
    
       
   
    sendOtp : (phone)=>{
        console.log("otp check",phone)
        client.verify.v2.services
        .create({friendlyName: 'La Bonnz OTP Verification'})
        .then(service =>{
            sid=service.sid;
            client.verify.v2.services(service.sid)
            .verifications
            .create({to: '+91'+phone, channel: 'sms'})
            .then(verification => console.log(verification.status))
        }
           
        ); 
    },
    verifyOtp : async(phone,otp)=>{
        let validation
        console.log("otp check",phone,otp)
        await client.verify.v2.services(sid)
            .verificationChecks
            .create({to: '+91'+phone, code: otp})
            .then(verification_check => {
            validation= verification_check
      });
      return validation
    }
}