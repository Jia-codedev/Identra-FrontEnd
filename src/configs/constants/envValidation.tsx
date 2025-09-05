type Environment = "development" | "production";

class FrontendSettings {
  public readonly environment: Environment;
  public readonly apiBaseUrl: string;
  public readonly appName: string;
  public readonly socketUrl: string;

  constructor() {
    this.environment = (process.env.NODE_ENV as Environment) || "development";
    const envValue = process.env.NEXT_PUBLIC_IDENTRA_BE_URI;
    const socketEnvValue = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (typeof envValue === "string" && envValue.trim() !== "") {
      console.log(
        `✅ Environment variable NEXT_PUBLIC_IDENTRA_BE_URI loaded successfully: ${envValue}`
      );
      this.apiBaseUrl = envValue;
      this.socketUrl = socketEnvValue || "";
    } else {
      console.log(
        `⚠️ Environment variable NEXT_PUBLIC_IDENTRA_BE_URI not found, using fallback: http://localhost:8000`
      );
      this.apiBaseUrl = "http://localhost:8000";
      this.socketUrl = "";
    }

    this.appName = process.env.NEXT_PUBLIC_APP_NAME || "Chronologix";
  }

  private validateEnvVar(name: string, fallback?: string): string {
    let value = process.env[name];

    if (!value && typeof window !== "undefined") {
      value = (window as any).__NEXT_DATA__?.env?.[name];
    }

    console.log(`Validating environment variable: ${name} = ${value}`);

    if (typeof value === "string" && value.trim() !== "") {
      console.log(
        `✅ Environment variable ${name} loaded successfully: ${value}`
      );
      return value;
    }

    if (fallback !== undefined) {
      console.log(
        `⚠️ Environment variable ${name} not found, using fallback: ${fallback}`
      );
      return fallback;
    }

    throw new Error(
      `Environment variable ${name} is required but was not provided and no fallback was set.`
    );
  }
}

const frontendSettings = new FrontendSettings();
export default frontendSettings;
