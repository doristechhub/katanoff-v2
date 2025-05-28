# start emulator in local

firebase emulators:start

# only functions deploy of firebase cloud functions

firebase deploy --only functions

# deploy of firebase cloud functions

firebase deploy

# How to install stripe in window

https://www.youtube.com/watch?v=jJu8vQH7hLY

# steps for listening webhook in local environment

step 1. open cmd
step 2. open url (https://dashboard.stripe.com/test/webhooks/create?endpoint_location=local)
step 3. enter command "stripe listen --forward-to (local env endpoint)/stripe/webhook"

stpe 4. open another cmd
step 5. enter command "stripe trigger payment_intent.succeeded"
