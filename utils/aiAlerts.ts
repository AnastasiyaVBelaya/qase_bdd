import { Page } from '@playwright/test';

export const AI_ALERT_TEXT = 'Failed to load AI generation jobs';
const CLOSE_BUTTON_VISIBLE_TIMEOUT = 100;

export const getAIAlert = (page: Page) =>
    page.getByRole('alert').filter({ hasText: AI_ALERT_TEXT });

export const closeAIAlertIfVisible = async (page: Page): Promise<void> => {
    const closeButton = getAIAlert(page).getByRole('button', { name: 'Close' });
    if (await closeButton.isVisible({ timeout: CLOSE_BUTTON_VISIBLE_TIMEOUT })) {
        await closeButton.click();
    }
};

export const handleAIResponse = async (page: Page, url: string, status: number): Promise<void> => {
    if (!url.includes('ai') || status !== 200) return;
    await closeAIAlertIfVisible(page);
};