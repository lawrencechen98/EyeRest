'use strict';

function setAlarm(event) {
       chrome.browserAction.setBadgeText({text: 'ON'});
     chrome.storage.sync.get(['minutes'], function(item) {
          chrome.alarms.create({delayInMinutes: item.minutes});
     });

}

function clearAlarm() {
  chrome.browserAction.setBadgeText({text: ''});
  chrome.alarms.clearAll();
}

function toggleAlarm() {
     $("#alarm-switch").toggleClass('btn-secondary btn-success');

     let alarmToggle = document.getElementById('alarm-switch').classList.contains('btn-success');
     chrome.storage.sync.set({alarmToggle: alarmToggle});
     var text = "Alarm "
     if (alarmToggle) {
          text += "On";
          setAlarm();
     } else {
          text += "Off";
          clearAlarm();
     }
     document.getElementById('alarm-switch').innerHTML = text;
}

function delayUpdate() {
     let minutes = parseFloat(document.getElementById('minute-input').value);
     chrome.storage.sync.set({minutes: minutes});

     let alarmToggle = document.getElementById('alarm-switch').classList.contains('btn-success');
     if (alarmToggle) {
          toggleAlarm();
     }
}

document.getElementById('alarm-switch').addEventListener('click', toggleAlarm);
document.getElementById('minute-input').addEventListener('change', delayUpdate);


$( document ).ready(function() {
     chrome.storage.sync.get(['minutes'], function(item) {
      document.getElementById('minute-input').value = item.minutes;
    });
    chrome.storage.sync.get(['alarmToggle'], function(item) {
     var btnClass = 'btn-secondary';
     if (item.alarmToggle) {
          btnClass = 'btn-success';
          document.getElementById('alarm-switch').innerHTML = "Alarm On";
     }
     console.log(item);
     document.getElementById('alarm-switch').classList.add(btnClass);
   });
});
