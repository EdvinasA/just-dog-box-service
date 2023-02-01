import { createTransport } from 'nodemailer';

export const sendEmail = async () => {
    let transport = await createTransport({
        host: 'email-smtp.eu-north-1.amazonaws.com',
        port: 587,
        secure: false,
        auth: {
            user: 'AKIA4XW5HWXSGFTXXYNB',
            pass: 'BCPvy7P6hlwiv2AOeHrKGAVk6c9HicQONNIEL4ln/nwx',
        },
    });

    let info = await transport.sendMail({
        from: '"JustDogBox " <justdogbox@gmail.com>',
        to: "justdogbox@gmail.com",
        subject: "Hello",
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
}
