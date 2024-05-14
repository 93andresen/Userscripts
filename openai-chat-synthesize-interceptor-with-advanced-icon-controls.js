// ==UserScript==
// @name         OpenAI Chat Synthesize Interceptor with Advanced Icon Controls
// @version      0.7
// @description  Capture ChatGPT Synthesize API responses and add advanced playback controls with icons. Forked by Baldoe13 on https://community.openai.com. Original: Winkelmann on https://community.openai.com. I wanted it to update when updates release. Found it on in this thread and hoped someone would find this if thay wanted to make any updates. https://community.openai.com/t/read-aloud-feature-not-working-on-chatgpt-via-firefox/664947/9
// @author       93andresen
// @match        https://chatgpt.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/93andresen/Userscripts/main/openai-chat-synthesize-interceptor-with-advanced-icon-controls.js
// ==/UserScript==

(function () {
    'use strict';
    let audio = null;  // Global audio element
    let playPauseBtn;  // Global play/pause button

    const originalFetch = window.fetch;
    window.fetch = async function (url, options) {
        const response = await originalFetch.apply(this, arguments);
        if (url.startsWith('https://chat.openai.com/backend-api/synthesize')) {
            console.log('Intercepted Synthesize API request for URL:', url);
            try {
                const clone = response.clone();
                const arrayBuffer = await clone.arrayBuffer();
                const aacFile = new Blob([arrayBuffer], { type: 'audio/aac' });
                const fileUrl = URL.createObjectURL(aacFile);
                if (audio) {
                    audio.src = fileUrl;
                } else {
                    audio = new Audio(fileUrl);
                    createControls();
                }
                audio.play().catch(err => {
                    console.error('Audio playback error:', err);
                    playPauseBtn.innerHTML = '▶️'; // Change to Play icon on error
                }).then(() => {
                    if (audio) {
                        playPauseBtn.innerHTML = '⏸'; // Change to Pause icon
                        showControlsTemporarily(); // Show controls when audio starts playing
                    }
                });
            } catch (err) {
                console.error('Error processing audio:', err);
            }
        }
        return response;
    };

    function createControls() {
        const controlsDiv = document.createElement('div');
        controlsDiv.id = 'audioControls';
        controlsDiv.style.position = 'fixed';
        controlsDiv.style.top = '15px';
        controlsDiv.style.left = '50%';
        controlsDiv.style.transform = 'translateX(-50%)';
        controlsDiv.style.zIndex = '10000';
        controlsDiv.style.display = 'flex';
        controlsDiv.style.gap = '10px';
        controlsDiv.style.opacity = '0'; // Initially invisible
        controlsDiv.style.transition = 'opacity 0.5s ease'; // Smooth transition for opacity

        controlsDiv.onmouseover = function() {
            controlsDiv.style.opacity = '1';
        };

        controlsDiv.onmouseout = function() {
            controlsDiv.style.opacity = '0';
        };

        const startOverBtn = createButton('⏮', 'Start over', () => {
            audio.currentTime = 0;
            audio.play();
            playPauseBtn.innerHTML = '⏸';
        });

        playPauseBtn = createButton('▶️', 'Play/Pause', () => {
            if (audio.paused || audio.ended) {
                audio.play();
                playPauseBtn.innerHTML = '⏸';
            } else {
                audio.pause();
                playPauseBtn.innerHTML = '▶️';
            }
        });

        const rewindBtn = createButton('⏪', 'Rewind 10 seconds', () => {
            audio.currentTime = Math.max(0, audio.currentTime - 10);
            if (audio.paused) {
                audio.play();
                playPauseBtn.innerHTML = '⏸';
            }
        });

        const stopBtn = createButton('⏹', 'Stop', () => {
            audio.pause();
            audio.currentTime = 0;
            playPauseBtn.innerHTML = '▶️';
        });

        controlsDiv.appendChild(startOverBtn);
        controlsDiv.appendChild(rewindBtn);
        controlsDiv.appendChild(playPauseBtn);
        controlsDiv.appendChild(stopBtn);

        document.body.appendChild(controlsDiv);
        showControlsTemporarily();
    }

    function createButton(icon, title, action) {
        const button = document.createElement('button');
        button.innerHTML = icon;
        button.title = title;
        button.style.cursor = 'pointer';
        button.style.background = 'none';
        button.style.border = 'none';
        button.onclick = action;
        return button;
    }

    function showControlsTemporarily() {
        const controlsDiv = document.getElementById('audioControls');
        if (controlsDiv) {
            controlsDiv.style.opacity = '1';
            setTimeout(() => {
                if (!controlsDiv.matches(':hover')) {
                    controlsDiv.style.opacity = '0';
                }
            }, 2000);
        }
    }
})();
