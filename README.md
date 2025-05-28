# Firebase Deployment Guide

## Enabling CORS in Firebase Storage

To enable CORS for Firebase Storage, follow these steps:
https://www.youtube.com/watch?v=tvCIEsk4Uas

1. Create a `cors.json` file with the following content:

   ```json
   [
     {
       "origin": ["*"],
       "method": ["GET"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

2. Run the following command to set the CORS configuration:
   ```sh
   gsutil cors set cors.json gs://katanoff-534f9.firebasestorage.app
   ```

## Deploying Site to Firebase

### Step 1: Initialize Firebase

Run the following command to start the Firebase setup:

```sh
firebase init
```

Follow the prompts:

- **Do you want to use a web framework?** No
- **What do you want to use as your public directory?** `public` (or `build` if applicable)
- **Configure as a single-page app?** No
- **Set up automatic builds and deploys with GitHub?** No

### Step 2: Configure `firebase.json`

Modify the `firebase.json` file as follows:

```json
{
  "hosting": [
    {
      "target": "admin",
      "public": "newAdminPanel/dist",
      "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ],
  "functions": {
    "source": "cloudFunction/functions"
  }
}
```

### Step 3: Apply Firebase Hosting Targets

#### For Admin Panel

```sh
firebase target:apply hosting admin admin-qa-ultimate-jewelry
firebase deploy --only hosting:admin
```

## Configuring reCAPTCHA for Firebase App Check

1. Add all required domains in the reCAPTCHA admin settings:
   [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/site/702004182/settings)

2. For local environment setup, refer to Firebase App Check Debug Provider:
   [Firebase App Check Debug](https://firebase.google.com/docs/app-check/web/debug-provider?authuser=0#web-modular-api)

## Building and Deploying the Application

### Step 1: Build Admin Panel

D:\ultimate jewelry project\ultimate-jewelry

```sh
cd newAdminPanel
npm run build
```

### Step 2: Build User Panel

D:\ultimate jewelry project\ultimate-jewelry

```sh
cd userpanel
npm run build
xcopy .next ..\cloudFunction\functions\.next /E /I /Y
copy package.json ..\cloudFunction\functions\next-package.json
xcopy public ..\cloudFunction\functions\public /E /I /Y
```

### Step 3: Install Dependencies for Cloud Functions

D:\ultimate jewelry project\ultimate-jewelry

```sh
cd cloudFunction\functions
npm install
```

### Step 4: Deploy to Firebase

D:\ultimate jewelry project\ultimate-jewelry

```sh
firebase deploy --only "hosting,functions"
```

This guide provides a step-by-step process for enabling CORS in Firebase Storage, setting up Firebase hosting, configuring App Check, and deploying your site efficiently.
