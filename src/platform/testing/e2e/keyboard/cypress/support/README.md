# Cypress Keyboard E2E Testing

## Table of Contents

1. [Overview](#overview)
2. [Configuration](#configuration)
3. [Commands](#functions)
   1. [.realPress()](#real-press)
      1. [tab](#tab)
      2. [Space](#space)
      3. [ArrowDown](#arrow-down)
      4. [ArrowUp](#arrow-up)
   2. [tabToElem](#tab-to-elem)
   3. [chooseSelectOption](#choose-select-option)
   4. [testSelect](#test-select)
   5. [chooseRadio](#choose-radio)
   6. [testRadios](#test-radios)
   7. [typeInFocused](#type-in-focused)
   8. [testTextInput](#test-text-input)
4. [Future Updates](#future-updates)

## Overview

The Keyboard E2E (KE2E) is a utility that auto automates Cypress end-to-end (E2E) tests on a VA.gov form app using only keyboard presses.

The goal of this utility is to mimic the real use case of a disabled user navigating the app without a mouse

Using native JavaScript is not good enough to serve this purpose because they do not mimic user interactions 1-to-1.

This utility utilizes a package called `cypress-real-events` which uses the Chrome API to simulate real keyboard events

## Configuration

No major configurations are needed at this time. Some configurations may be needed at a later date as this code expands.

## Commands

There are several commands added to Cypress to help the user navigate around the app as well as interacting with form elements

### .realPress()

The `cypress-real-events` package includes a new command for Cypress called `realPress`. It is the main command this utility uses and it mimics a real user key press. Below are some examples.

#### Tab

Tabs focus to the next element

```js
cy.realPress('Tab');
```
#### Space

Triggers a button or form field

```js
cy.realPress('Space');
```

#### ArrowDown

Moves focus to the next option in a radio group or select box

```js
cy.realPress('ArrowDown');
```
#### ArrowUp

Moves focus to the previous option in a radio group or select box

```js
cy.realPress('ArrowUp');
```

### tabToElem

This command tabs to an element on the page based on the `selector` passed in

```js
cy.tabToElem(selector);
```

### chooseSelectOption

When a select box is focused, this command selects on option based on the `value` passed in

```js
cy.chooseSelectOption(value);
```

### testSelect

When a select box is focused, this command rotates selecting each option as a test. This may not have much value initially but can be expanded on later

```js
cy.testSelect();
```

### chooseRadio

When a radio in a radio group is focused, this command selects the radio option based on the `value` passed in

```js
cy.chooseRadio(value);
```

### testRadios

When a radio in a radio group is focused, this command rotates selecting each radio as a test. This may not have much value initially but can be expanded on later

```js
cy.testRadios();
```

### typeInFocused

When a text input or textarea is selected, this command types the text passed in. This uses the native Cypress `.type()` command but may be updated later to use a series of `.realPress()` commands if deemed beneficial

```js
cy.typeInFocused(text);
```

### testTextInput

When a text input or textarea is selected, this command types the text passed in. This uses the native Cypress `.type()` command but may be updated later to use a series of `.realPress()` commands if deemed beneficial

```js
cy.testTextInput();
```

## Future Updates

This is the initial commit of this project. There will be updates later on to add new features, fix bugs, and make testing more robust.