// emailTemplates.js

export const membershipAcceptedEmail = (name) => {
    return `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #1d72b8;">Welcome to AmusicBible, ${name}!</h2>
            <p>We are excited to inform you that your membership request has been <strong style="color: #28a745;">accepted</strong>. You are now officially part of our community.</p>
            <p>With your membership, you gain access to exclusive content, curated playlists, and special events just for members.</p>
            <p>We hope you enjoy the benefits of being a member of <strong>AmusicBible</strong>. If you have any questions, feel free to reach out to us at <a href="mailto:support@slqpsg.com">support@amusicbible.com</a>.</p>
            <br>
            <p>Best regards,</p>
            <p>The amusic Bible Team</p>
            <hr>
            <p style="font-size: 12px; color: #555;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
    `;
};

export const membershipRejectedEmail = (name) => {
    return `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #dc3545;">Dear ${name},</h2>
            <p>We regret to inform you that your membership request to <strong>AmusicBible</strong> has been <strong style="color: #dc3545;">rejected</strong> at this time.</p>
            <p>We appreciate your interest and encourage you to stay connected with us. You can still enjoy our free content and updates on our platform.</p>
            <p>If you have any questions or would like to reapply in the future, feel free to contact our support team at <a href="mailto:support@slqpsg.com">support@amusicbible.com</a>.</p>
            <br>
            <p>Best regards,</p>
            <p>The amusic Bible Team</p>
            <hr>
            <p style="font-size: 12px; color: #555;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
    `;
};

export const contactSubmissionEmail = (name, message) => {
    return `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #1d72b8;">Hello ${name},</h2>
            <p>Thank you for getting in touch with us!</p>
            <p>We have received your message and will get back to you shortly. Here is a copy of your message for your reference:</p>
            <blockquote style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #1d72b8; color: #555;">
                ${message}
            </blockquote>
            <p>If you have any further questions or updates, feel free to contact us at <a href="mailto:support@amusicbible.com">support@amusicbible.com</a>.</p>
            <br>
            <p>Best regards,</p>
            <p>The amusic Bible Team</p>
            <hr>
            <p style="font-size: 12px; color: #555;">This is an automated message. Please do not reply directly to this email.</p>
        </div>
    `;
};

