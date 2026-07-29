import { Page } from '@playwright/test';

export const AI_ALERT_TEXT = 'Failed to load AI generation jobs';
const CLOSE_BUTTON_TIMEOUT = 300;

export const getAIAlert = (page: Page) =>
    page.getByRole('alert').filter({ hasText: AI_ALERT_TEXT });

export const closeAIAlertIfVisible = async (page: Page): Promise<void> => {
    if (page.isClosed()) return;
    try {
        const closeButton = getAIAlert(page).getByRole('button', { name: 'Close' });
        await closeButton.waitFor({ state: 'visible', timeout: CLOSE_BUTTON_TIMEOUT });
        await closeButton.click({ timeout: 1000 });
    } catch { }
};

export const handleAIResponse = async (page: Page, url: string, status: number): Promise<void> => {
    if (!url.includes('ai') || status !== 200) return;
    await closeAIAlertIfVisible(page);
};