import { type Locator, type Page } from '@playwright/test';

export class CreateCasePage {
    readonly page: Page;
    readonly titleInput: Locator;
    readonly statusDropdown: Locator;
    readonly severityDropdown: Locator;
    readonly priorityDropdown: Locator;
    readonly typeDropdown: Locator;
    readonly layerDropdown: Locator;
    readonly isFlakyDropdown: Locator;
    readonly behaviorDropdown: Locator;
    readonly automationStatusDropdown: Locator;
    readonly automationCheckbox: Locator;
    readonly newStepButton: Locator;
    readonly saveButton: Locator;
    readonly attachmentButton: Locator;
    readonly manualTestButton: Locator;
    readonly createManuallyMenuItem: Locator;

    constructor(page: Page) {
        this.page = page;
        this.titleInput = page.getByLabel('Title');
        this.statusDropdown = this.fieldDropdown('Status');
        this.severityDropdown = this.fieldDropdown('Severity');
        this.priorityDropdown = this.fieldDropdown('Priority');
        this.typeDropdown = this.fieldDropdown('Type');
        this.layerDropdown = this.fieldDropdown('Layer');
        this.isFlakyDropdown = this.fieldDropdown('Is flaky');
        this.behaviorDropdown = this.fieldDropdown('Behavior');
        this.automationStatusDropdown = this.fieldDropdown('Automation status');
        this.automationCheckbox = page.getByRole('checkbox', { name: 'To be automated' });
        this.newStepButton = page.getByRole('button', { name: 'New step', exact: true });
        this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
        this.attachmentButton = page.getByRole('button', { name: 'Add attachment' });
        this.manualTestButton = page.getByRole('button', { name: 'Manual test' });
        this.createManuallyMenuItem = page.getByRole('menuitem', { name: 'Create manually' });
    }

    async fillTitle(title: string): Promise<void> {
        await this.titleInput.fill(title);
    }

    async openCreateCaseForm(): Promise<void> {
        await this.manualTestButton.click();
        await this.createManuallyMenuItem.click();
    }

    private async selectDropdownOption(dropdown: Locator, optionName: string): Promise<void> {
        await dropdown.click();
        await this.page.getByRole('option', { name: optionName, exact: true }).click();
    }

    async selectStatus(value: string): Promise<void> {
        await this.selectDropdownOption(this.statusDropdown, value);
    }

    async selectSeverity(value: string): Promise<void> {
        await this.selectDropdownOption(this.severityDropdown, value);
    }

    async selectPriority(value: string): Promise<void> {
        await this.selectDropdownOption(this.priorityDropdown, value);
    }

    async selectType(value: string): Promise<void> {
        await this.selectDropdownOption(this.typeDropdown, value);
    }

    async selectLayer(value: string): Promise<void> {
        await this.selectDropdownOption(this.layerDropdown, value);
    }

    async selectIsFlaky(value: string): Promise<void> {
        await this.selectDropdownOption(this.isFlakyDropdown, value);
    }

    async selectBehavior(value: string): Promise<void> {
        await this.selectDropdownOption(this.behaviorDropdown, value);
    }

    async selectAutomationStatus(value: string): Promise<void> {
        await this.selectDropdownOption(this.automationStatusDropdown, value);
    }

    async enableAutomation(): Promise<void> {
        await this.page.getByText('To be automated', { exact: true }).click();
    }

    async addStep(action: string, data: string, expected: string): Promise<void> {
        await this.newStepButton.click();
        const lastStep = this.page.locator('[id^="edit-step-"]').last();
        await lastStep.waitFor({ state: 'visible' });
        await lastStep.locator('[id^="action-"]').fill(action);
        await lastStep.locator('[id^="data-"]').fill(data);
        await lastStep.locator('[id^="expected_result-"]').fill(expected);
    }

    async uploadAttachment(filePath: string, stepNumber: number): Promise<void> {
        const step = this.page.locator('[id^="edit-step-"]').nth(stepNumber - 1);
        const attachmentButton = step.locator('button:has(svg[data-icon="image"])');
        await attachmentButton.click();
        const fileInput = this.page.locator('input[type="file"]');
        await fileInput.setInputFiles(filePath);
        await this.page.keyboard.press('Escape');
    }

    async save(): Promise<void> {
        await this.saveButton.click();
    }

    private fieldDropdown(labelText: string): Locator {
        return this.page
            .locator(`label:text-is("${labelText}")`)
            .locator('..')
            .getByRole('combobox');
    }
}