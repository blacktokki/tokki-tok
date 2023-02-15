#!/usr/bin/env node

const fs = require('fs')

const env = `API_URL="https://blacktokki.com"
FCM_PUBLIC_VAPID_KEY=""
FCM_API_KEY=""
`
const firebaseConfig = `firebaseConfig = {
    "authDomain": "",
    "projectId": "",
    "storageBucket": "",
    "messagingSenderId": "",
    "appId": "",
    "measurementId": ""
}
if (typeof module !== 'undefined') {
    module.exports = firebaseConfig
}
`

fs.writeFileSync('.env', env, 'utf8');
fs.writeFileSync('web/firebase-config.js', firebaseConfig, 'utf8');
