import 'cypress-real-events';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const timeoutDuration = 100;

Cypress.Commands.add('testRadios', function() {
  cy.get(':focus').then($el => {
    const radioName = $el.attr('name');
    cy.get(`[name="${radioName}"]`)
      .its('length')
      .then(length => {
        // Cycle through it once
        for (let i = 0; i < length; i++) {
          cy.realPress('ArrowDown', { pressDelay: timeoutDuration });
        }
      });
  });
});

Cypress.Commands.add('chooseRadio', function(value) {
  cy.get(':focus').then($el => {
    const radioName = $el.attr('name');
    cy.get(`[name="${radioName}"]`)
      .its('length')
      .then(length => {
        // Cycle through it once
        for (let i = 0; i < length; i++) {
          cy.get(':focus').then($rad => {
            if ($rad.val() !== value) {
              cy.realPress('ArrowDown', { pressDelay: timeoutDuration });
            } else {
              cy.realPress('Space');
            }
          });
        }
      });
  });
});

Cypress.Commands.add('testSelect', function() {
  // Use Space to open, but pressing Enter doesn't select
  // yet so for now we're just using arrows
  cy.realPress('Space', { pressDelay: timeoutDuration });

  cy.get(':focus').then(() => {
    cy.get(':focus option')
      .its('length')
      .then(length => {
        // Cycle through it once
        for (let i = 0; i < length; i++) {
          cy.realPress('ArrowDown', { pressDelay: timeoutDuration });
        }
      });
  });

  cy.realPress('Space', { pressDelay: timeoutDuration });
});

Cypress.Commands.add('chooseSelectOption', function(value) {
  // This condition will need to be updated since
  // an empty value for an option is possible
  // Might want to throw a Cypress error too
  if (!value) {
    return;
  }
  cy.get(':focus')
    .find('option')
    .its('length')
    .then(length => {
      for (let i = 0; i < length; i++) {
        cy.get(':focus').then($el => {
          if ($el.val() !== value) {
            cy.realPress('ArrowDown', { pressDelay: timeoutDuration });
          }
        });
      }
    });
});

Cypress.Commands.add('testTextInput', function() {});

Cypress.Commands.add('typeInFocused', function(text) {
  cy.get(':focus').type(text, { delay: timeoutDuration });
});

// Recursive tab function
// type is the type of selector (name, id, class, etc)
// selector is the actual selector
Cypress.Commands.add('tabToElem', function(
  selector,
  forward = true,
  isRecursive,
) {
  // let foundElem = false;
  // let completeCycle = false;
  // let startingElem = null;

  if (!isRecursive) {
    cy.get(selector).should('exist');
  }

  cy.realPress('Tab', { pressDelay: timeoutDuration }).then((/* event */) => {
    cy.get(':focus').then($el => {
      if ($el.is(selector)) {
        Cypress.log({
          displayName: 'TAB',
          message: 'FOUND',
        });
      } else if (selector === 'original elem') {
        // If original element, quit, will handle later
      } else {
        Cypress.log({
          displayName: 'TAB',
          message: 'NOT FOUND',
        });
        cy.tabToElem(selector, forward, true);
      }
    });
  });
});
