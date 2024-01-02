chrome.webNavigation.onCompleted.addListener(function(details) {
  console.log('Page loaded: ' + details.url);
  
  // Retrieve the URL from storage
  chrome.storage.sync.get('serverUrl', function(data) {
    const serverUrl = data.serverUrl || 'http://localhost:1234/browserhistory'; // Default URL
    
    fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: details.url }),
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
  });
});

