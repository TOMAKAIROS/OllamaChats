chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.type === "getModels") {
        console.log(msg);
    }

  return true;
});
