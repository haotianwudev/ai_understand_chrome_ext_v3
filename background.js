const apiEndpoint = "https://lfigmzhb3d.execute-api.us-east-1.amazonaws.com/dev/ai_understand";

function sendSelectedTextToAPI(info, tab) {
  const selectedText = info.selectionText;

  fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: selectedText }),
  })
    .then((response) => response.json())
    .then((data) => {
      const returnedText = data.body;
	  console.log(returnedText);
      showResponsePopup(returnedText);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function showResponsePopup(responseText) {
  const popupURL = chrome.runtime.getURL('response-popup.html');
  chrome.windows.create({
    url: popupURL,
    type: 'popup',
    width: 800,
    height: 500,
  });

  chrome.runtime.onConnect.addListener((port) => {
    port.postMessage({
      type: 'API_RESPONSE',
      response: responseText,
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'sendSelectedTextToAPI',
    title: 'Understand selected text',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'sendSelectedTextToAPI') {
    sendSelectedTextToAPI(info, tab);
  }
});


