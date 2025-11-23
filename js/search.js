document.getElementById("search_btn").addEventListener("click", () => {
    const apiUrl = document.getElementById("api_url").value; 
    // Gets the current value from the <select id="api_url"> element 
    // and stores it in the apiUrl variable.

    chrome.runtime.sendMessage(
        // This sends a message object from this file to background.js.
        // Whatever we pass here becomes the "msg" argument inside 
        // background.js's onMessage listener (the service worker).
        {
            type: "getModels",
            baseUrl: apiUrl
        },
        // starting from this pointon this is the 
        (response) => {
            // Because sendMessage is asynchronous, this callback 
            // only runs AFTER background.js sends back a response.

            if (!response || !response.success) {
                alert("Failed to fetch models, ensure your Ollama server is up and running. Please try again.");
                return;
            }

            const selectedModel = document.getElementById("model");

            selectedModel.innerHTML = "";
            // Clear all existing <option> tags inside the dropdown.

            response.models.forEach((model) => {
                let option = document.createElement("option");
                option.value = model.name;
                option.textContent = model.name;
                selectedModel.appendChild(option);
            });
            // For each model returned by Ollama in the response, create a new <option> element
            // with the model name as both the value and the visible text,
            // and add it to the dropdown.
        }
    );
});
