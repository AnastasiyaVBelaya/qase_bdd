import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
const envFile = process.env.ENV_FILE;
if (envFile) {
  dotenv.config({ path: path.resolve(__dirname, 'environments', envFile) });
}

const testDir = defineBddConfig({
  featuresRoot: './features',
  steps: ['./steps'],
});

export default defineConfig({
  testDir,
  globalSetup: './global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      },
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        actionTimeout: 30000,
        navigationTimeout: 60000,
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        actionTimeout: 30000,
        navigationTimeout: 60000,
      },
    },
  ],
});
