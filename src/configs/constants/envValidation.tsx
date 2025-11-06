type Environment = "development" | "production";

class FrontendSettings {
  public readonly environment: Environment;
  public readonly apiBaseUrl: string;
  public readonly appName: string;
  public readonly socketUrl: string;

  constructor() {
    this.environment = (process.env.NODE_ENV as Environment) || "development";
    const envValue = process.env.NEXT_PUBLIC_IDENTRA_BE_URI;
    const socketEnvValue = process.env.NEXT_PUBLIC_IDENTRA_SOCKET_URL;
    if (typeof envValue === "string" && envValue.trim() !== "") {
      this.apiBaseUrl = envValue;
      this.socketUrl = socketEnvValue || "";
    } else {
      this.apiBaseUrl = "http://localhost:8000";
      this.socketUrl = "";
    }

    this.appName = process.env.NEXT_PUBLIC_APP_NAME || "Identra";
  }

  private validateEnvVar(name: string, fallback?: string): string {
    let value = process.env[name];

    if (!value && typeof window !== "undefined") {
      value = (window as any).__NEXT_DATA__?.env?.[name];
    }

    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }

    if (fallback !== undefined) {
      return fallback;
    }

    throw new Error(
      `Environment variable ${name} is required but was not provided and no fallback was set.`
    );
  }
}

const frontendSettings = new FrontendSettings();
export default frontendSettings;
