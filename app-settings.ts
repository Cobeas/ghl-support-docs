export const appSettings = {
    authentication: {
        useTwoFa: true, // Enable or disable two-factor authentication
        useEmailVerification: true, // Enable or disable email verification. A user does not have to have an active session to change their password
        useOauth: [], // An array with OAuth providers compatible with Next Auth V5. Example: ["google", "facebook"] (all lowercase)
    },
    email: {
        from: "support@testmail.cobeas.nl", // The email address that will be used as the sender for all emails. If you want to insert a name use: "Name <email@address>"
        bcc: null, // An email address that will receive a blind carbon copy of all emails sent by the application. For multiple addresses send as array: ["email1", "email2"]
        cc: null, // An email address that will receive a carbon copy of all emails sent by the application. For multiple addresses send as array: ["email1", "email2"]
        reply_to: null, // An email address that will be used as the reply-to address for all emails. For multiple addresses send as array: ["email1", "email2"]
    }
}