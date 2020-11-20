import sgMail from '@sendgrid/mail';

const API_KEY = process.env.SENDGRID_API_KEY;

async function send(to: string, subject: string, body: string) {
    const msg = {
        to,
        from: '',
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

export default {
    send,
};
