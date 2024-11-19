function getUsernameFromMail(email: string): string {
  if (!email) return "";
  const atIndex = email.indexOf("@");

  if (atIndex === -1) {
    return "";
  }

  return email.substring(0, atIndex);
}

export default getUsernameFromMail;
