Feature: Login

  Background: 
    Given I am on the login page

  Scenario: Login with valid credentials
    When I login with valid credentials
    Then I am redirected to the projects page
    And I see the projects page title

  Scenario: Login with invalid credentials
    When I login with invalid credentials
    Then I see an error message
    And I remain on the login page