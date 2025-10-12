import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export class PasswordService {
  /**
   * Hash a plaintext password using bcrypt
   * @param password - Plain text password to hash
   * @returns Promise<string> - Hashed password
   */
  static async hash(password: string): Promise<string> {
    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Verify a plaintext password against a hash
   * @param password - Plain text password to verify
   * @param hash - Hashed password to compare against
   * @returns Promise<boolean> - True if password matches
   */
  static async verify(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) {
      return false;
    }
    return bcrypt.compare(password, hash);
  }

  /**
   * Check if password meets complexity requirements
   * @param password - Password to validate
   * @returns Object with validation result and message
   */
  static validateStrength(password: string): { valid: boolean; message: string } {
    if (!password || password.length < 8) {
      return {
        valid: false,
        message: "Password must be at least 8 characters long",
      };
    }

    if (password.length > 128) {
      return {
        valid: false,
        message: "Password must not exceed 128 characters",
      };
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one number",
      };
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
      return {
        valid: false,
        message: "Password must contain at least one letter",
      };
    }

    return {
      valid: true,
      message: "Password meets security requirements",
    };
  }
}
