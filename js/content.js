console.log("Content script loaded!");
// This is needed because the submit button is created inside a shadow DOM
// only AFTER text is inserted. Without waiting for it to appear, the script
// would miss the button on the first attempt and require clicking "start"
// twice before the message is actually sent.
function waitForButton(selector, timeout = 2000) {
    return new Promise((resolve, reject) => {
        const start = performance.now();

        const check = () => {
            const btn = document.querySelector(selector);
            if (btn) return resolve(btn);

            if (performance.now() - start > timeout)
                return reject("Button not found in time");

            requestAnimationFrame(check);
        };

        check();
    });
}

//listens to msg action "insert_into_chat"
//which triggers the msg.txt to be sent. the msg.txt was received from startConverse function found in background.js
chrome.runtime.onMessage.addListener(async (msg) => {
    if (msg.action === "insert_into_chat") {

        const text = msg.text;

        //looks for div with an id that says "prompt-textarea"
        const targetDiv = document.getElementById("prompt-textarea");

        //if it does not exist then warning shows and script stops.
        if (!targetDiv) {
            console.warn("❌ div#prompt-textarea not found on this page");
            return;
        }

        //if found then add the msg.txt now known as "text" into the div with the "prompt-textarea".
        targetDiv.innerText = text;

        console.log("Inserted Ollama text into chatbox.");

        //do not stop here...wait until submit button shows up due to the shadow dom that appears once the text was injected into the div.
        try {
            const submitButton = await waitForButton("#composer-submit-button", 2000);
            console.log("Clicking submit button...");
            submitButton.click();
        } catch (err) {
            console.warn("❌ Submit button not found in time:", err);
        }
    }
});
