# Husky Setup Guide (Monorepo & Subdirectory)

This document provides a step-by-step guide on how to correctly set up Husky. This guide is specifically tailored for projects that follow a **Monorepo** or sub-directory structure (meaning the `.git` directory is in the root folder, while your `package.json` is located inside a sub-folder like `frontend` or `backend`).

## Step 1: Install Husky

First, navigate to the folder containing your `package.json` (e.g., `frontend`) in your terminal and install Husky:

```bash
cd frontend
npm install --save-dev husky
```

## Step 2: Add Script to `package.json`

Since your `.git` folder is at the root, Git needs to know that the Husky hooks are located in `frontend/.husky`. To configure this, add the following to the `scripts` section of your `frontend/package.json`:

```json
{
  "scripts": {
    "prepare": "cd .. && husky frontend/.husky"
  }
}
```

> [!NOTE]
> The `cd ..` command navigates back to the root directory, and from there, it specifies the `frontend/.husky` path to set up the Git hooks properly.

## Step 3: Initialize Husky

Now, while still inside the `frontend` folder, run the `prepare` script:

```bash
npm run prepare
```
Running this command will create a new `.husky` folder inside your `frontend` directory and configure the hooks path in the Git configuration at the root level.

## Step 4: Create a Pre-commit Hook

We want to ensure that code is linted whenever a developer makes a commit. Therefore, we will create a `pre-commit` hook. 
Create a new file named `pre-commit` (without any extension) inside the `frontend/.husky` folder.

## Step 5: Change Directory Inside the Hook (Crucial Step)

Git always runs hook commands from the root directory (where the `.git` folder is located). So, if we directly run `npm run lint`, it will look for `package.json` in the root and fail with an error.

To solve this, add the following code to your `frontend/.husky/pre-commit` file:

```sh
#!/usr/bin/env sh

# 1. First, navigate to the frontend folder
cd frontend

# 2. Then, run your command
npm run lint
```

> [!IMPORTANT]
> If you are setting up Husky for a `backend` project, you will need to use `cd backend` instead of `cd frontend`.

## Step 6: Test the Hook

Your Husky setup is now completely configured!

Whenever you run `git commit -m "Your message"`, it will automatically execute `npm run lint` before committing.
- If there are any linting errors in the code, the commit will Fail.
- If there are no errors, the commit will proceed successfully.

If you want to test whether the hook is working without making an actual commit, you can run the following command from the root directory:
```bash
git hook run pre-commit
```
