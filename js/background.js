chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    console.log(msg); // Testing if msg object did come through from search.js

  return true; // required for async sendResponse
});
