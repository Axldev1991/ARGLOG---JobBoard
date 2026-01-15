export const PROTECTED_EMAILS = [
    "castellanoaxl@gmail.com",
    "admin@jobboard.com"
];

export function isProtectedUser(email: string | null | undefined): boolean {
    if (!email) return false;
    return PROTECTED_EMAILS.includes(email);
}
