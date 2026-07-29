import { type Locator, type Page } from '@playwright/test';

export class CreateSuitePage {
    readonly page: Page;
    readonly modal: Locator;
    readonly titleInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modal = page.getByRole('dialog');
        this.titleInput = page.getByRole('textbox', { name: 'Suite name' });
        this.submitButton = page.getByRole('button', { name: 'Create', exact: true });
    }

    async fillTitle(title: string): Promise<void> {
        await this.titleInput.fill(title);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
        await this.modal.waitFor({ state: 'hidden' });
    }

    async waitForModalVisible(): Promise<void> {
        await this.modal.waitFor({ state: 'visible' });
    }
}