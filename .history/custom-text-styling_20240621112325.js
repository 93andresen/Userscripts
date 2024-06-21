// ==UserScript==
// @name         Custom Text Styling with Options
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Color bold and italic text with user-defined styles
// @author       YourName
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to inject the options panel into the page
    function injectOptionsPanel() {
        const panelHTML = `
            <div id="options-panel" style="position: fixed; top: 10px; right: 10px; background: white; border: 1px solid #ccc; padding: 10px; z-index: 10000;">
                <h3>Text Styling Options</h3>
                <label for="bold-color">Bold Text Color:</label>
                <input type="color" id="bold-color" name="bold-color" value="${localStorage.getItem('boldColor') || '#ff5733'}"><br><br>
                <label for="italic-color">Italic Text Color:</label>
                <input type="color" id="italic-color" name="italic-color" value="${localStorage.getItem('italicColor') || '#33aaff'}"><br><br>
                <label for="divider-style">Divider Style:</label>
                <select id="divider-style" name="divider-style">
                    <option value="solid" ${localStorage.getItem('dividerStyle') === 'solid' ? 'selected' : ''}>Solid</option>
                    <option value="dashed" ${localStorage.getItem('dividerStyle') === 'dashed' ? 'selected' : ''}>Dashed</option>
                    <option value="dotted" ${localStorage.getItem('dividerStyle') === 'dotted' ? 'selected' : ''}>Dotted</option>
                </select><br><br>
                <button id="apply-styles">Apply Styles</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', panelHTML);
    }

    // Function to apply user-selected styles
    function applyStyles() {
        const boldColor = document.getElementById('bold-color').value;
        const italicColor = document.getElementById('italic-color').value;
        const dividerStyle = document.getElementById('divider-style').value;

        // Save settings to localStorage
        localStorage.setItem('boldColor', boldColor);
        localStorage.setItem('italicColor', italicColor);
        localStorage.setItem('dividerStyle', dividerStyle);

        // Apply styles
        let styleElement = document.getElementById('custom-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'custom-styles';
            document.head.appendChild(styleElement);
        }
        styleElement.innerHTML = `
            b, strong {
                color: ${boldColor};
            }
            i, em {
                color: ${italicColor};
            }
            p {
                display: block;
                margin-bottom: 1em;
                border-bottom: 1px ${dividerStyle} #ddd;
                padding-bottom: 0.5em;
            }
        `;
    }

    // Inject the options panel and apply initial styles
    injectOptionsPanel();
    applyStyles();

    // Add event listener to the apply button
    document.getElementById('apply-styles').addEventListener('click', applyStyles);

})();
