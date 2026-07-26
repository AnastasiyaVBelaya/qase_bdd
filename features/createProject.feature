Feature: Create project

  Background:
    Given I am on the login page
    When I login with valid credentials
    Then I am redirected to the projects page
    And I see the projects page title

  Scenario: Create a new project via UI
    When I create a new project with random data
    Then I see the new project in the list