import { errors, type JWTPayload, jwtVerify, SignJWT } from "jose";

class TokenService {
  private readonly secretKey: Uint8Array;

  constructor() {
    const secret = "GOWDAMAN";
    this.secretKey = new TextEncoder().encode(secret);
  }

  private handleError(error: unknown): never {
    if (error instanceof errors.JWTClaimValidationFailed) {
      console.error("JWT Claim Validation Failed:", error.message);
      throw error;
    }
    if (error instanceof errors.JWTInvalid) {
      console.error("JWT Invalid:", error.message);
      throw error;
    }
    if (error instanceof errors.JWTExpired) {
      console.error("JWT Expired:", error.message);
      throw error;
    }
    console.error("JWT Error:", error);
    throw error;
  }

  async verifyToken(token: string): Promise<{ id: number; role: string }> {
    if (!token || token.trim() === "") {
      throw new Error("Token is empty or undefined");
    }
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error(
        "Invalid JWT format: token should have 3 parts separated by dots"
      );
    }

    try {
      console.log("Verifying token:", token.substring(0, 20) + "...");
      const { payload } = await jwtVerify(token, this.secretKey, {
        algorithms: ["HS256"],
      });

      console.log("JWT Verified:", payload);

      if (!payload.id) {
        throw new Error("Token payload is missing 'id' field");
      }

      if (!payload.role) {
        throw new Error("Token payload is missing 'role' field");
      }

      return {
        id: <number>payload.id,
        role: <string>payload.role,
      };
    } catch (error: unknown) {
      console.error("JWT Verification Error:", error);
      this.handleError(error);
    }
  }

  async createToken(payload: JWTPayload, expiry: string): Promise<string> {
    try {
      return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(expiry)
        .sign(this.secretKey);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }
}

const tokenService = new TokenService();
export default tokenService;
