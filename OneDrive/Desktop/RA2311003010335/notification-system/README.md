# Notification System

## Overview
This project fetches notifications from an API and displays the top 10 based on priority.

## Priority Logic
Placement > Result > Event

If same type, latest notifications are shown first.

## Logging Middleware
A custom logging middleware is implemented to log:
- Function calls
- Inputs and outputs
- Execution time

Middleware is applied to all functions.

## How to Run
1. Install dependencies:
   npm install

2. Run:
   node index.js