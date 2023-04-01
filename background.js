const apiEndpoint = "https://lfigmzhb3d.execute-api.us-east-1.amazonaws.com/dev/ai_understand";

function sendSelectedTextToAPI(info, tab, language) {
  const selectedText = info.selectionText;

  fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message: selectedText, language : language }),
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
    id: 'Understand',
    title: 'English',
    contexts: ['selection'],
  });
  chrome.contextMenus.create({
    id: 'UnderstandInChinese',
    title: '中文',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'Understand') {
    sendSelectedTextToAPI(info, tab, "EN");
  };
  if (info.menuItemId === 'UnderstandInChinese') {
    sendSelectedTextToAPI(info, tab, "CN");
  };
});


