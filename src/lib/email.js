import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html }) {
    const requiredVariables = [
        "EMAIL_SERVER_HOST",
        "EMAIL_SERVER_PORT",
        "EMAIL_SERVER_USER",
        "EMAIL_SERVER_PASSWORD",
        "EMAIL_FROM",
    ];

    const missingVariables = requiredVariables.filter(
        (variable) => !process.env[variable]
    );

    if (missingVariables.length > 0) {
        throw new Error(
            `Missing email configuration: ${missingVariables.join(", ")}`
        );
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
        },
    });

    return transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
    });
}