// ==UserScript==
// @name         OpenAI Chat Synthesize Interceptor with Advanced Icon Controls
// @version      0.6
// @description  Capture ChatGPT Synthesize API responses and add advanced playback controls with icons.
// @author       Forked by Baldoe13 on https://community.openai.com. Original: Winkelmann on https://community.openai.com. I wanted it to update when updates release. Found it on in this thread and hoped someone would find this if thay wanted to make any updates. https://community.openai.com/t/read-aloud-feature-not-working-on-chatgpt-via-firefox/664947/9
// @match        https://chat.openai.com/*
// @grant        none
// ==/UserScript==

(function () {
    // 'use strict';
    let audio = null; // Global audio element
    let playPauseBtn; // Global play/pause button

    const originalFetch = window.fetch;
    window.fetch = async function (url, options) {
        const response = await originalFetch.apply(this, arguments);
        if (url.startsWith('https://chat.openai.com/backend-api/synthesize')) {
            console.log('Intercepted Synthesize API request for URL:', url);
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
            audio.play().catch(err => console.error('Audio playback error:', err))
                .then(() => {
                    playPauseBtn.innerHTML = '⏸'; // Change to Pause icon
                    showControlsTemporarily(); // Show controls when audio starts playing
                });
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
        controlsDiv.style.opacity = '0'; // Initially invisible, updated to be controlled by showControlsTemporarily
        controlsDiv.style.transition = 'opacity 0.5s ease'; // Smooth transition for opacity

        // Make controls visible on hover
        controlsDiv.onmouseover = function() {
            controlsDiv.style.opacity = '1';
        };

        // Make controls invisible again when not hovered
        controlsDiv.onmouseout = function() {
            controlsDiv.style.opacity = '0';
        };

        // Play from the beginning button
        const startOverBtn = document.createElement('button');
        startOverBtn.innerHTML = '⏮'; // Start over icon
        startOverBtn.style.cursor = 'pointer';
        startOverBtn.style.background = 'none';
        startOverBtn.style.border = 'none';
        startOverBtn.onclick = function() {
            audio.currentTime = 0;
            audio.play();
            playPauseBtn.innerHTML = '⏸'; // Change to Pause icon
        };

        // Play/Pause button
        playPauseBtn = document.createElement('button');
        playPauseBtn.innerHTML = '▶️'; // Play icon, assuming audio is stopped at first
        playPauseBtn.style.cursor = 'pointer';
        playPauseBtn.style.background = 'none';
        playPauseBtn.style.border = 'none';
        playPauseBtn.onclick = function() {
            if (audio.paused || audio.ended) {
                audio.play();
                playPauseBtn.innerHTML = '⏸'; // Change to Pause icon
            } else {
                audio.pause();
                playPauseBtn.innerHTML = '▶️'; // Change to Play icon
            }
        };

        // Rewind 10 seconds button
        const rewindBtn = document.createElement('button');
        rewindBtn.innerHTML = '⏪'; // Rewind icon
        rewindBtn.style.cursor = 'pointer';
        rewindBtn.style.background = 'none';
        rewindBtn.style.border = 'none';
        rewindBtn.onclick = function() {
            audio.currentTime = Math.max(0, audio.currentTime - 10); // Rewind 10 seconds or to the start
            if (audio.paused) {
                audio.play();
                playPauseBtn.innerHTML = '⏸'; // Ensure play/pause button shows Pause icon
            }
        };

        // Stop button
        const stopBtn = document.createElement('button');
        stopBtn.innerHTML = '⏹'; // Stop icon
        stopBtn.style.cursor = 'pointer';
        stopBtn.style.background = 'none';
        stopBtn.style.border = 'none';
        stopBtn.onclick = function() {
            audio.pause();
            audio.currentTime = 0;
            playPauseBtn.innerHTML = '▶️'; // Change to Play icon
        };

        controlsDiv.appendChild(startOverBtn);
        controlsDiv.appendChild(rewindBtn);
        controlsDiv.appendChild(playPauseBtn);
        controlsDiv.appendChild(stopBtn);

        document.body.appendChild(controlsDiv);

        // Call this to initially show controls
        showControlsTemporarily();
    }

    function showControlsTemporarily() {
        const controlsDiv = document.getElementById('audioControls');
        if (controlsDiv) {
            controlsDiv.style.opacity = '1'; // Make controls visible

            // Use setTimeout to fade controls out after 5 seconds
            setTimeout(() => {
                if (!controlsDiv.matches(':hover')) { // Only fade out if not hovering over controls
                    controlsDiv.style.opacity = '0';
                }
            }, 2000); // Adjust time as needed
        }
    }
})();
