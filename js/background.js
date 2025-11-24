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

async function startConverse(msg, sendResponse) {
    try {
        // console.log("Ollama has started conversing...");
        const response = await fetch(msg.baseUrl + "/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: msg.model,
                messages: [
                    { role: "user", content: msg.prompt }
                ],
                stream: false
            })
        });

        // FOR DEBUGGING
        console.log("Me: " + msg.prompt);
        // console.log("response.ok:", response.ok);
        // console.log("response.status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            sendResponse({
                success: false,
                status: response.status,
                error: errorText
            });
            return;
        }

        const ollamaResponse = await response.json();
        const content = ollamaResponse.message.content;

        console.log(msg.model + ":", content);

        // Send response back to popup or sender
        sendResponse({
            success: true,
            response: content
        });

        // ALSO send the response "content" variable to content.js which can only be retrieved by chatgpt.com (see manifest for more info on how this is done.)
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { action: "insert_into_chat", text: content },
                (response) => {
                    if (chrome.runtime.lastError) {
                        console.warn("⚠️ sendMessage error:", chrome.runtime.lastError.message);
                    }
                }
            );
        });


    } catch (err) {
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

    if (msg.type === "converse") {
        // console.log("START CONVERSE FUNCTION CALLED");
        startConverse(msg, sendResponse);
        return true;
    }

});
