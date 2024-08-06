function getUsernameFromMail(email: string): string {
    const atIndex = email.indexOf('@');

    if (atIndex === -1) {
        return '';
    }

    return email.substring(0, atIndex);
}

export default getUsernameFromMail