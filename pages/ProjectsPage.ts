import { type Locator, type Page } from '@playwright/test';
import * as endpoints from '../constants/endpoints';

export class ProjectsPage {
    readonly page: Page;
    readonly title: Locator;
    readonly createNewProjectButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.getByRole('heading', { name: 'Projects', level: 1, exact: true });
        this.createNewProjectButton = page.getByRole('button', { name: 'Create new project', exact: true });
    }

    async openCreateProjectForm(): Promise<void> {
        await this.createNewProjectButton.click();
    }

    async openProject(code: string): Promise<void> {
        await this.page.goto(`${endpoints.PROJECT_PAGE}/${code}`);
    }
}