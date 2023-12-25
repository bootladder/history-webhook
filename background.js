
chrome.webNavigation.onCompleted.addListener(function(details) {
  console.log('Page loaded: ' + details.url);

  // Sending a fetch request to your local server
  fetch('http://localhost:1234/browserhistory', {
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

