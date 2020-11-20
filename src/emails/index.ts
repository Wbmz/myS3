import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import confirmationTemplate from './templates/confirmationTemplate';
import passwordResetTemplate from './templates/passwordResetTemplate';
import passwordChangedTemplate from './templates/passwordChangedTemplate';

dotenv.config();
const API_KEY = process.env.SENDGRID_API_KEY;

export async function send(to: string, subject: string, body: string): Promise<boolean> {
    const msg = {
        to,
        from: 'wafaa.boumaaz@efrei.net',
        subject,
        html: body,
    };

    if (!API_KEY) {
        console.log('API_KEY not found');
        return false;
    }
    sgMail.setApiKey(API_KEY);

    try {
        await sgMail.send(msg);
        return Promise.resolve(true);
    } catch (error) {
        if (error.response) {
            console.error(error.response.body);
        }
        return Promise.reject(error);
    }
}

export async function sendConfirmationEmail(
    to: string,
    options: { nickname: string },
): Promise<boolean> {
    return send(to, 'Account successfully created', confirmationTemplate(options));
}

export async function sendPasswordReset(
    to: string,
    options: { nickname: string; token: string },
): Promise<boolean> {
    return send(to, 'Reset your password', passwordResetTemplate(options));
}

export async function sendPasswordChanged(
    to: string,
    options: { nickname: string },
): Promise<boolean> {
    return send(to, 'Password changed', passwordChangedTemplate(options));
}

export default {
    send,
    sendConfirmationEmail,
    sendPasswordReset,
    sendPasswordChanged,
};
