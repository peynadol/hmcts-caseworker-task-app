import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});

test.describe("Task Management", () => {
  test("should add new task", async ({ page }) => {
    // Wait until the 'Add Task' button is available and clickable
    await page.waitForSelector("text=Add Task");
    await page.click("text=Add Task");

    // Wait for the form to be visible
    await page.waitForSelector("#task-title");

    // Fill the form with task details
    await page.fill("#task-title", "Test Task");
    await page.fill("#task-day", "21");
    await page.fill("#task-month", "09");
    await page.fill("#task-year", "2025");
    await page.click("#status-not-started");
    await page.fill("#task-description", "Test description");

    // Wait for the 'Create Task' button to be clickable
    await page.waitForSelector('button:text("Create Task")');
    await page.click('button:text("Create Task")');

    // Wait for task to appear after creation
    await page.waitForSelector("text=Test Task", { state: "visible" });
    await expect(page.locator("text=Test Task")).toBeVisible();
  });

  test("should display edited task", async ({ page }) => {
    // Wait for the 'Edit Task' button to be clickable
    await page.waitForSelector("text=Edit Task");
    await page.click("text=Edit Task");

    // Wait for the edit form to appear
    await page.waitForSelector("#edit-title-input");
    await page.fill("#edit-title-input", "Edited Title");
    await page.fill("#edit-desc-input", "Edited description");
    await page.selectOption("#edit-select", { label: "In Progress" });
    await page.fill("#edit-date", "2025-05-01");

    // Wait for the 'Save' button to be clickable and click it
    await page.waitForSelector("text=Save");
    await page.click("text=Save");

    // Wait for the updated task to appear
    await page.waitForSelector("text=Edited Title", { state: "visible" });
    await expect(page.locator("text=Edited Title")).toBeVisible();
  });

  test("should delete task from view", async ({ page }) => {
    await expect(page.locator("text=Edited Title")).toBeVisible();
    await page.click("text=Delete Task");
    await page.click("text=Edited Title");
    await page.waitForSelector("text=Confirm Delete");
    await page.click("text=Confirm Delete");

    // Wait for the task to disappear
    await expect(page.locator("text=Edited Title")).toBeHidden();
  });
});
