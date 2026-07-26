import { type Locator, type Page } from '@playwright/test';

export class CreateSuitePage {
    readonly page: Page;
    readonly titleInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.titleInput = page.getByRole('textbox', { name: 'Suite name' });
        this.submitButton = page.getByRole('button', { name: 'Create', exact: true });
    }

    async fillTitle(title: string): Promise<void> {
        await this.titleInput.fill(title);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }
}