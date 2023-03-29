chrome.runtime.connect().onMessage.addListener((message) => {
  if (message.type === 'API_RESPONSE') {
    const responseDiv = document.getElementById('response');
    const converter = new showdown.Converter();

    const jsonString = `{"response": ${message.response}}`; // Create a JSON string
    const parsedJson = JSON.parse(jsonString); // Parse the JSON string
    const cleanedResponse = parsedJson.response; // Extract the cleaned response

    const htmlResponse = converter.makeHtml(cleanedResponse);

    responseDiv.innerHTML = `In Summary:<br>${htmlResponse}`;
  }
});


