import * as dotenv from 'dotenv';
import * as path from 'path';

export class EnvConfig {
  private static instance: EnvConfig;

  private constructor() {
    this.loadEnvironmentFiles();
  }

  public static getInstance(): EnvConfig {
    if (!EnvConfig.instance) {
      EnvConfig.instance = new EnvConfig();
    }
    return EnvConfig.instance;
  }

  private loadEnvironmentFiles(): void {
    const environment = process.env.ENV || 'dev';

    dotenv.config({ path: path.resolve(process.cwd(), 'env/.env') });

    const envFilePath = path.resolve(process.cwd(), `env/.env.${environment}`);
    dotenv.config({ path: envFilePath, override: true });

    console.log(`Loaded environment: ${environment}`);
    console.log(`Base URL: ${this.getBaseURL()}`);
  }

  public getBaseURL(): string {
    return process.env.BASE_URL || 'http://localhost:3000';
  }

  public getUsername(): string {
    return process.env.TEST_USERNAME || '';
  }

  public getPassword(): string {
    return process.env.TEST_PASSWORD || '';
  }

  public getDefaultTimeout(): number {
    return parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10);
  }

  public getNavigationTimeout(): number {
    return parseInt(process.env.NAVIGATION_TIMEOUT || '30000', 10);
  }

  public isHeadless(): boolean {
    return process.env.HEADLESS === 'true';
  }

  public getSlowMo(): number {
    return parseInt(process.env.SLOW_MO || '0', 10);
  }

  public getWorkers(): number {
    return parseInt(process.env.WORKERS || '4', 10);
  }

  public getEnvironment(): string {
    return process.env.ENV || 'dev';
  }
}

export const envConfig = EnvConfig.getInstance();
