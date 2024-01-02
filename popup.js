// popup.js
document.getElementById('popupForm').addEventListener('submit', function(e){
  e.preventDefault();
  var url = document.getElementById('serverUrl').value;
  chrome.storage.sync.set({serverUrl: url}, function() {
    console.log('URL is set to ' + url);
  });
});

