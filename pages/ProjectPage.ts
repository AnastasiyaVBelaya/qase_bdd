import { type Locator, type Page } from '@playwright/test';

export class ProjectPage {
    readonly page: Page;
    readonly createSuiteButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.createSuiteButton = page.getByRole('button', { name: 'Create new suite' });
    }

    async openCreateSuiteForm(): Promise<void> {
        await this.createSuiteButton.click();
    }
}