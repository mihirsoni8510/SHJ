import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

    try {
        await resend.emails.send({
            from: 'SHJ <onboarding@resend.dev>', // Change to your verified domain in production
            to: email,
            subject: 'Reset your password - Shree Harikrupa Jewellers',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 10px;">
                    <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
                    <p>Hello,</p>
                    <p>We received a request to reset your password for your SHJ account. Click the button below to set a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background-color: #d4a574; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>If you didn't request this, you can safely ignore this email. This link will expire in 1 hour.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #666; text-align: center;">
                        Shree Harikrupa Jewellers, Main Street, Diamond Lane, Surat, Gujarat
                    </p>
                </div>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('Email send error:', error);
        return { error: 'Failed to send reset email' };
    }
}
