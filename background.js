chrome.webNavigation.onCompleted.addListener(function(details) {

  if (details.frameId !== 0) return;
  // Use chrome.tabs API to get the tab information
  chrome.tabs.get(details.tabId, function(tab) {
    // Check if you got the tab information successfully
    if (chrome.runtime.lastError) {
      console.error('Error:', chrome.runtime.lastError);
    } else {
      // Now you have access to the tab's title and URL
      const pageTitle = tab.title;
      const pageUrl = tab.url;

      // Retrieve the server URL from storage
      chrome.storage.sync.get('serverUrl', function(data) {
        const serverUrl = data.serverUrl || 'http://localhost:1234/browserhistory'; // Default URL

        // Construct the body of your POST request
        const postData = {
          url: pageUrl,
          title: pageTitle
        };

        // Perform the POST request
        fetch(serverUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
      });
    }
  });
});
