// ==UserScript==
// @version      0.1
// @description  try to take over the world!
// @author       You
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @name         ChatGPT Hotkey
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Wait for element to load, paste text, and submit
// @match        *://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Event listener for hotkey (Ctrl + Shift + G)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'G') {
            var chatUrl = 'https://chatgpt.com';
            window.open(chatUrl, '_blank');
        }
    });

    // Function to handle the message sending once the page is loaded
    function handleMessageSending() {
        navigator.clipboard.readText().then(text => {
            let messageBox = document.querySelector('textarea');
            if (messageBox) {
                messageBox.value = text;
                let event = new Event('input', { bubbles: true });
                messageBox.dispatchEvent(event);
                let sendButton = document.querySelector('button[type="submit"]');
                if (sendButton) {
                    sendButton.click();
                }
            }
        });
    }

    // Use MutationObserver to detect when the chat page is loaded and ready
    if (window.location.href.includes('chatgpt.com')) {
        let observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.addedNodes.length) {
                    let messageBox = document.querySelector('textarea');
                    if (messageBox) {
                        handleMessageSending();
                        observer.disconnect();
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
