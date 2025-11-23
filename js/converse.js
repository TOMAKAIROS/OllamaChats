document.getElementById("start_btn").addEventListener("click", () => {
    const apiUrl = document.getElementById("api_url").value; 
    const model = document.getElementById("model").value;
    const prompt = document.getElementById("prompt").value;

    chrome.runtime.sendMessage(
        {
            type: "converse",
            baseUrl: apiUrl,
            model: model,
            prompt: prompt
        },
        (response) => {
            if (!response || !response.success) {
                console.log(response);
                alert("OllamaChats failed to converse, please try again.");
                return;
            }
            // console.log("OllamaChats conversed successfully!");
            // console.log(response);
        }
    );
});
