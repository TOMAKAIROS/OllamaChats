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
        console.log(msg.model + ":", ollamaResponse.message.content);

        sendResponse({
            success: true,
            response: ollamaResponse.message.content || "missing message?"
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
