import bcrypt from 'bcrypt';

class Utils {
  saltRounds: number = 10;
  generateSalt(saltRounds: number = this.saltRounds): string {
    return bcrypt.genSaltSync(saltRounds);
  }
  hashedPassword(password: string, salt: string): string {
    return bcrypt.hashSync(password, salt);
  }
  generatePassword(): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  }

  generateOTP(): string {
    const characters = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }
    return otp;
  }
}
export default new Utils();
