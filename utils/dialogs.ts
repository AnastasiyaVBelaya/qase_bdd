import { Page } from '@playwright/test';

export const blockCookieBanner = async (page: Page): Promise<void> => {
    await page.route('**/*usercentrics*/**', (route) => route.abort());
};

export const closeAidenDialog = async (page: Page): Promise<void> => {
    const dialog = page.locator('dialog[open]').filter({ hasText: 'Explore AIDEN' });

    try {
        await dialog.waitFor({ state: 'visible', timeout: 5000 });
        await dialog.getByRole('button').last().click();
        await dialog.waitFor({ state: 'hidden', timeout: 5000 });
    } catch {
    }
};