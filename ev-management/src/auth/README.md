# Authentication Context

This folder contains user authentication helpers and application context wrappers managing state across components.

## Responsibility

- Stores current authenticated user payload (token, role, email).
- Provides context providers to allow page controllers to check if a visitor has Employee or Owner level authorization checks.
- Controls storage of JWT access keys inside client localStorage.
