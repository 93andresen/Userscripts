// ==UserScript==
// @name         Custom Text Styling
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Color bold and italic text and add dividers
// @author       You
// @match        https://chatgpt.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Create a style element
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        b, strong {
            color: #ff5733; /* Your desired color for bold text */
        }
        i, em {
            color: #33aaff; /* Your desired color for italic text */
        }
        p {
            display: block;
            margin-bottom: 1em;
            border-bottom: 1px solid #ddd; /* Your desired divider style */
            padding-bottom: 0.5em;
        }
    `;
    // Append the style element to the head
    document.head.appendChild(style);
})();
