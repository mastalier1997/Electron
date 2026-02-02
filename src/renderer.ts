/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import { desktopCapturer, Menu } from 'electron';
import './index.css';

const video = document.querySelector('video');
const startButton = document.getElementById('startBtn');
const stopButton = document.getElementById('stopBtn');
const videoSelectButton = document.getElementById('videoSelectBtn');

videoSelectButton.onclick = async () => {
  // Use the bridge we created in preload.ts
  const sources = await (window as any).electronAPI.getVideoSources();
  (window as any).electronAPI.showVideoMenu(sources);
};

// Listen for the selection sent back from the Main process
(window as any).ipcRenderer?.on('source-selected', (event, src) => {
  selectSource(src);
});

async function selectSource(src: any) {
  videoSelectButton.innerText = src.name;

  const constraints: any = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: src.id
      }
    }
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = stream;
  video.play();
}
