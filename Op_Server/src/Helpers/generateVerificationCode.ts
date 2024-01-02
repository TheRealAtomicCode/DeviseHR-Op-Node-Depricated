export function generateVerificationCode(): string {
  return String(Math.floor(Math.random() * 900000000) + 100000000);
}
