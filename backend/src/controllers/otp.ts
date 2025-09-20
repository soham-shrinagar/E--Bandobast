// otp.ts
const otpStore: Record<string, string> = {};

export function sendOtpDev(phoneNumber: string): string {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[phoneNumber] = otp;
  console.log(`📱 [DEV] OTP for ${phoneNumber}: ${otp}`);
  return otp;
}

export function verifyOtpDev(phoneNumber: string, enteredOtp: string): boolean {
  const validOtp = otpStore[phoneNumber];
  if (!validOtp) return false;
  if (validOtp === enteredOtp) {
    delete otpStore[phoneNumber]; // OTP used, clear it
    return true;
  }
  return false;
}
