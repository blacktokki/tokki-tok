importScripts("https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js"
);
importScripts('./firebase-config.js');
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const message_set = JSON.parse(payload.data['message_set'])[0]
    self.registration.showNotification(payload.data.channel_name, { body: `${payload.data.name}: ${message_set.content}` })
});