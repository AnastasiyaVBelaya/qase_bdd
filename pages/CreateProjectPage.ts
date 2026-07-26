import { type Locator, type Page } from '@playwright/test';

export class CreateProjectPage {
  readonly page: Page;
  readonly modalTitle: Locator;
  readonly titleInput: Locator;
  readonly codeInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalTitle = page.getByRole('heading', { name: 'Create new project' });
    this.titleInput = page.locator('#project-name');
    this.codeInput = page.locator('#project-code');
    this.submitButton = page.getByRole('button', { name: 'Create project', exact: true });
  }

  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  async fillCode(code: string): Promise<void> {
    await this.codeInput.fill(code);
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}