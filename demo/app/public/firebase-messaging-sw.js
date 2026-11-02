/* eslint-disable no-undef */
/**
 * Firebase Cloud Messaging — alohida service worker.
 * Shablon; `viteFirebaseMessagingSwEnv` build/dev da `%PLACEHOLDER%` larni yozadi.
 * Versiya CDN: `11.10.0` — `node_modules/firebase` bilan mos.
 * @see https://firebase.google.com/docs/cloud-messaging/js/client
 */
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyD9D0ahCaZcKJ8Sb2LAqeTCiTkXS7ifi8s',
  authDomain: 'uysot-dev-8e4cd.firebaseapp.com',
  projectId: 'uysot-dev-8e4cd',
  storageBucket: 'uysot-dev-8e4cd.firebasestorage.app',
  messagingSenderId: '552414123448',
  appId: '1:552414123448:web:7e7bae0408289193842b4d',
  measurementId: 'G-1FD9SVWYVN'
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

firebase.messaging();
