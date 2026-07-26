Feature: Create suite

  Background:
    Given I am on the login page
    When I login with valid credentials
    Then I am redirected to the projects page
    And I see the projects page title

  Scenario: Create a new suite via UI
    When I create a project via API
    And I navigate to the project
    And I create a new suite with random data
    Then I see the new suite in the list
    And the suite is created via API