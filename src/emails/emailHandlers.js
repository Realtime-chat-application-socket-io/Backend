import { resendClient } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";
import {ENV} from "../lib/env.js";

export const sendWelcomeEmail=async(email,name,clientURL)=>{
    const {data,error}=await resendClient.emails.send({
        from:`${ENV.EMAIL_FROM_NAME}<${ENV.EMAIL_FROM}>`,
        to:email,
        subject:"welcome to chatify",
        html:createWelcomeEmailTemplate(name,clientURL)

    });
    if(error){
        console.error("Error sending welcome email:",error);
        throw new Error("failed to send welcome email");
    }
    console.log("Welcome Email send succesfully",data);
}


