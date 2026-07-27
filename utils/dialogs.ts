import { Page } from '@playwright/test';

export const blockCookieBanner = async (page: Page): Promise<void> => {
    await page.route('**/*usercentrics*/**', (route) => route.abort());
};

export const closeAidenDialog = async (page: Page): Promise<void> => {
    try {
        const dialog = page.locator('dialog[open]').filter({ hasText: 'Explore AIDEN' });
        await dialog.waitFor({ state: 'visible', timeout: 5000 });
        await dialog.locator('button:has(svg[data-icon="xmark"])').click();
        await dialog.waitFor({ state: 'hidden', timeout: 5000 });
    } catch {}
};