'use strict';

var countdownProgress = new Set();

function audioNotification() {
     var notificationSound = new Audio('audio/notification.mp3');
     notificationSound.play();
}

chrome.runtime.onInstalled.addListener(function() {
     chrome.storage.sync.set({alarmToggle: false, minutes: 20}, function() {
          console.log("Eye Rest Timer extension installed. Alarm is currently off.");
     });
});

chrome.alarms.onAlarm.addListener(function() {
     chrome.browserAction.setBadgeText({text: ''});
     chrome.notifications.create({
          type:     'basic',
          iconUrl:  'images/EyeRest_Logo.png',
          requireInteraction: true,
          title:    'Eye Rest Notification',
          message:  'Rest your eyes! Click the notification to begin.',
          buttons: [
          {title: 'Turn off alarm.'}
          ],
          priority: 2},
          function () {
               audioNotification();
          });
});

function sleep(ms) {
     return new Promise(resolve => setTimeout(resolve, ms));
}

chrome.notifications.onClicked.addListener(async function(id) {
     if (countdownProgress.has(id)) {
          return;
     }

     countdownProgress.add(id);
     var secondsLeft = 21;
     while (secondsLeft) {
          secondsLeft -= 1;
          chrome.notifications.update(id, {
          type:     'basic',
          iconUrl:  'images/EyeRest_Logo.png',
          requireInteraction: true,
          title:    'Eye Rest Notification',
          message:  'Rest your eyes!\n' + secondsLeft + ' seconds left.',
          buttons: [
          {title: 'Turn off alarm.'}
          ],
          priority: 2});
          await sleep(1000);
     }
     countdownProgress.delete(id);
});

chrome.notifications.onClosed.addListener(function() {
     chrome.storage.sync.get(['minutes', 'alarmToggle'], function(item) {
          if (item.alarmToggle) {
               chrome.browserAction.setBadgeText({text: 'ON'});
               chrome.alarms.create({delayInMinutes: item.minutes});
          }
     });
});

chrome.notifications.onButtonClicked.addListener(function() {
     chrome.storage.sync.set({alarmToggle: false});
     chrome.browserAction.setBadgeText({text: ''});
     chrome.alarms.clearAll();
});
