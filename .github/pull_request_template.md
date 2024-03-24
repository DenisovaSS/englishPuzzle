# Pull request - implement Login Form(feat: RSS-PZ-0-2)

## Overview

This pull request introduced the implementation of the login form.

## Features Implement

- Both input fields only accept English alphabet letters and the hyphen ('-') symbol.
- The first letter of each field (first name and surname) is in uppercase
- The minimum length of 3 characters for the first name field and 4 characters for the surname field.
- Create error messages for each validation rule.
- Realised messages near the respective input field
- If validation fails use pink color in the input

## Technical Details

First check if input is blank, if it's not true, check to accept English alphabet(use regular expression( /^[A-Za-z-]+$/)),next first letter(charAt(0)), next use value.length.

## Screenshots
