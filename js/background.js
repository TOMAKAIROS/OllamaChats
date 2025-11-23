async function getModels(msg, sendResponse) {
    try {
        // API request to Ollama server to retrieve the models.
        const response = await fetch(msg.baseUrl + "/api/tags");

        // Converts response of models to JSON
        const data = await response.json();

        // Sends models response back to the sender
        sendResponse({
            success: true,
            models: data.models
        });

    } catch (err) {
        console.log("Error fetching models:", err);

        // Send error response
        sendResponse({
            success: false,
            error: err.toString()
        });
    }
}

// Listen for messages sent from any javscript parts of the extension.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    // Check if message received is the correct request type
    if (msg.type === "getModels") {

        // Call our async getModels function
        getModels(msg, sendResponse);

        // Must return true so Chrome keeps the message channel open
        return true;
    }

});
