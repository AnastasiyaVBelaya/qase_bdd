Feature: Create test case

  Background:
    Given I am on the login page
    When I login with valid credentials
    Then I am redirected to the projects page
    And I see the projects page title

  Scenario: Create a new test case via UI
    Given I create a project via API
    And I create a suite via API
    When I navigate to the project
    And I navigate to the suite
    And I create a new test case with title "Login Test"
    And I select priority "High"
    And I select severity "Critical"
    And I select type "Functional"
    And I select layer "E2E"
    And I select behavior "Positive"
    And I enable the "To be automated" checkbox
    And I add the following steps to the test case:
      | action              | data                | expected                   |
      | Open login page     |                     | Login page is displayed    |
      | Enter email         | user@example.com    | Email is entered           |
      | Enter password      | ValidPass123        | Password is entered        |
      | Click submit        |                     | Dashboard is displayed     |
      | Verify dashboard    |                     | Dashboard is visible       |
      | Attach report file  |                     | File is attached           |
      | Click logout        |                     | Logout is successful       |
    And I attach file "sample.txt" to step 6
    And I submit the test case
    Then I see the test case in the list
    And the test case is created via API