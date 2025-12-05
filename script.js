const video = document.getElementById("myVideo");
const source = document.getElementById("videoSource");
const videos = [
  { src: "video.mp4", audio: true, loop: false },
  { src: "https://videos.pexels.com/video-files/3173312/3173312-uhd_2560_1440_30fps.mp4", audio: false, loop: true }
];
let index = 0;
function playVideo(i) {
  if (i >= videos.length) return;
  const vid = videos[i];
  source.src = vid.src;
  video.loop = vid.loop;
  video.controls = false;
  video.load();
  video.play().catch(() => {
    // Autoplay policy: user interaction may be required
    console.log("User interaction required for video autoplay.");
  });
}
// When video ends (only for non-looping ones)
video.addEventListener("ended", () => {
  if (!video.loop) {
    index++;
    playVideo(index);
  }
});
// Start first video
playVideo(index);
const appContainer = document.querySelector('.app-container');
const chatInput = document.querySelector('.chat-input');
const content = document.querySelector('.content');
const sendButton = document.querySelector('.send');
const sendIcon = sendButton.querySelector('i');
function updateSendIcon() {
  if (chatInput.value.trim() === '') {
    sendIcon.className = 'fa-solid fa-microphone';
  } else {
    sendIcon.className = 'fa-solid fa-paper-plane';
  }
}
updateSendIcon();
chatInput.addEventListener('input', updateSendIcon);
chatInput.addEventListener('focus', () => {
  setTimeout(() => {
    appContainer.classList.add('chat-focused');
  }, 100);
});
chatInput.addEventListener('blur', () => {
  appContainer.classList.remove('chat-focused');
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.chat-box')) {
    chatInput.blur();
    appContainer.classList.remove('chat-focused');
  }
});
// Like/Dislike
const likeBtn = document.querySelector('.like-btn i');
const dislikeBtn = document.querySelector('.dislike-btn i');
likeBtn.parentNode.addEventListener('click', () => {
  const isActive = likeBtn.classList.toggle('active');
  if (isActive) dislikeBtn.classList.remove('active');
});
dislikeBtn.parentNode.addEventListener('click', () => {
  const isActive = dislikeBtn.classList.toggle('active');
  if (isActive) likeBtn.classList.remove('active');
});
// Action buttons radio
/*const actionRadios = Array.from(document.querySelectorAll('.action'));
actionRadios.forEach(btn => {
  btn.addEventListener('click', function () {
    const icon = this.querySelector('i');
    if (icon.classList.contains('active')) {
      icon.classList.remove('active');
    } else {
      actionRadios.forEach(b => b.querySelector('i').classList.remove('active'));
      icon.classList.add('active');
    }
  });
});*/
// Send message or voice
sendButton.addEventListener('click', () => {
  if (sendIcon.classList.contains('fa-microphone')) {
    // Voice input
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onstart = () => {
        sendIcon.className = 'fa-solid fa-microphone-lines';
        sendIcon.style.color = 'red';
        chatInput.placeholder = 'Listening...';
      };
      recognition.onend = () => {
        sendIcon.className = 'fa-solid fa-microphone';
        sendIcon.style.color = '';
        chatInput.placeholder = 'Ask anything';
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript.trim()) {
          chatInput.value = transcript;
          updateSendIcon();
          streamResponse(transcript);
          chatInput.value = '';
        }
      };
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        recognition.onend();
      };
      recognition.start();
    } else {
      alert('Voice input not supported in this browser.');
    }
  } else {
    // Send text
    const val = chatInput.value.trim();
    if (val) {
      chatInput.value = '';
      streamResponse(val);
      updateSendIcon();
    }
  }
});
//backend code
let input='';
const panelEl = document.getElementById("bottomPanel");
const overlayEl = document.getElementById("maskLayer");
const headerTouch = document.getElementById("dragArea");
let touchStartY = 0;
let fullResponse = '';
let parsedArray = [];
let selectedLanguage = "English";
let selectedMode = "Simple Learn";
const out = document.getElementById("response");
let controller = null;
let uploadedImageFile = null;
// Configure marked.js for proper rendering
marked.setOptions({
  breaks: true,
  gfm: true,
  smartypants: true
});
async function loadVideo() {
  panelEl.classList.remove("opened");
  overlayEl.classList.remove("show");
  document.querySelector('.actions .fa-file-lines').classList.remove('active');
  const durationText = input;
  try {
    const response = await fetch('https://sreepathi-ravikumar-backendprocesssuper.hf.space/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'rkmentormindzofficaltokenkey12345' // Example: "abc12345"
      },
      body: JSON.stringify({ duration: durationText })
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    source.src = url;
    console.log(url)
    video.controls = true;
    video.load();
    window.sharedVideoUrl = url;
  } catch (error) {
    console.error('Error loading video:', error);
  }
}
async function loadVideomath() {
  if (panelEl) panelEl.classList.remove("opened");
  if (overlayEl) overlayEl.classList.remove("show");

  const fileIcon = document.querySelector('.actions .fa-file-lines');
  if (fileIcon) fileIcon.classList.remove('active');

  if (!video || !source) {
    console.error('Video elements not found');
    return;
  }

  try {
    const response = await fetch(
      `https://sreepathi-ravikumar-backendprocessmath.hf.space/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'rkmentormindzofficaltokenkey12345'
        },
        body: JSON.stringify({jsondata: fullResponse }) // 🔥 send plain string, not JSON
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    source.src = url;
    video.controls = true;
    video.load();
    window.sharedVideoUrl = url;
  } catch (error) {
    console.error('Error loading video:', error);
    //out.textContent = 'Error loading video. Please try again.';
  }
}
const BACKEND_URL_TEXT = "https://sreepathi-ravikumar-sample1.hf.space/ask";
const BACKEND_URL_IMAGE = "https://sreepathi-ravikumar-sample1.hf.space/askimage";
async function streamAsk(question, selectedLanguage, selectedMode) {
  panelEl.classList.add("opened", "default-size");
  overlayEl.classList.add("show");
 
  out.innerHTML = `
    <details open style="margin: 10px 0;">
      <summary style="cursor: pointer; font-weight: bold;">View Note</summary>
      <div id="note-toggle"><div class="loading-squares"><span></span><span></span><span></span></div></div>
    </details>
  `;
  const noteToggle = document.getElementById("note-toggle");
 

  let controller = new AbortController();

  if (selectedMode=="Solve Smart"){

  try {
    const response = await fetch(BACKEND_URL_TEXT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, selectedLanguage, selectedMode }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // Buffers / state
    let buffer = "";
    let fullResponseRaw = "";   // ALWAYS append cleaned chunk here (final full response)
    let englishBlock = "";      // English array section before &&&& (cleaned)
    let tamilBlock = "";        // Tamil section after &&&& (cleaned)
    let tamilStarted = false;

    let parsedList = [];        // parsed nested list when possible
    let displayContent = "";    // joined second elements for UI

    // Helper: try to safely parse / normalize incoming 'data' string
    function normalizeChunk(data) {
      // 1) Try JSON.parse safely. If it yields object -> stringify, if string -> use it.
      try {
        const parsed = JSON.parse(data);
        if (typeof parsed === "string") return parsed;
        // if it's an object/array/number/boolean -> stringify to stable string
        return JSON.stringify(parsed);
      } catch {
        // 2) If JSON.parse fails, clean double-escaped wrapping quotes and common escape sequences
        // Remove only matching leading/trailing quotes (one or many)
        let s = data.replace(/^"+|"+$/g, "");
        // Convert escaped quotes \" => "
        s = s.replace(/\\"/g, '"');
        // Unescape common escaped newlines \n -> actual newline
        s = s.replace(/\\n/g, "\n");
        // Unescape escaped tabs etc if present
        s = s.replace(/\\t/g, "\t");
        return s;
      }
    }

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (!line.startsWith("data: ")) continue;
        const rawData = line.slice(6);

        if (rawData === "[DONE]") {
          // Finalize full response using the raw canonical accumulator
          fullResponse = fullResponseRaw;
          console.log("Final stored input:", fullResponse);

          // Try final parse of englishBlock to extract display content (defensive)
          try {
            parsedList = JSON.parse(englishBlock);
            displayContent = parsedList
              .filter(item => Array.isArray(item) && item.length >= 2)
              .map(item => item[1])
              .join("\n\n");
          } catch (e) {
            // If parsing fails, fallback: try to extract second elements with regex (best-effort)
            console.warn("Final JSON parse failed, falling back:", e);
            // naive fallback: find matches of ["type","content",...]
            const fallbackMatches = [...englishBlock.matchAll(/\[ *"(?:[^"\\]|\\.)*" *, *"(?:[^"\\]|\\.)*"/g)];
            displayContent = fallbackMatches
              .map(m => {
                const inner = m[0];
                const parts = inner.split(/",\s*"/).map(p => p.replace(/^\[ *"/, "").replace(/"$/, ""));
                return parts[1] || "";
              })
              .join("\n\n");
          }

          noteToggle.innerHTML = marked.parse(displayContent);
          // Optionally you might want to store fullResponse somewhere global:
          window.LAST_FULL_RESPONSE = fullResponse;
          return;
        }

        // Normalize incoming chunk in a single canonical string form
        const clean = normalizeChunk(rawData);

        // Append to canonical full response => ALWAYS
        fullResponseRaw += clean;

        // If separator exists inside this chunk, split and route pieces
        if (!tamilStarted && clean.includes("&&&&")) {
          tamilStarted = true;
          const [before, after] = clean.split("&&&&", 2);
          englishBlock += before;
          tamilBlock += after || "";
        } else {
          if (!tamilStarted) {
            englishBlock += clean;
          } else {
            tamilBlock += clean;
          }
        }

        // Try parsing the englishBlock progressively to update the live UI.
        // This will succeed only once englishBlock contains a valid JSON array.
        try {
          const arr = JSON.parse(englishBlock);
          if (Array.isArray(arr)) {
            parsedList = arr;
            // Build displayContent from second element of each inner list
            displayContent = arr
              .filter(item => Array.isArray(item) && item.length >= 2)
              .map(item => item[1])
              .join("\n\n");

            // Progressive update
            noteToggle.innerHTML = marked.parse(displayContent);
          }
        } catch {
          // Not yet a complete JSON — ignore and wait for more chunks
        }
      }

      // leftover partial line remains in buffer
      buffer = lines[lines.length - 1];
    }

  } catch (e) {
    // show what we have so far
    noteToggle.innerHTML = marked.parse(
      (typeof displayContent === "string" ? displayContent : "") + "\n\n[Error / Stopped]"
    );

    if (e.name === "AbortError") {
      console.warn("Request aborted by user.");
    } else {
      out.innerHTML = `Error: ${e.message}`;
      console.error("Stream error:", e);
    }
  } finally {
    controller = null;
  }}
  else{
     try {
    const response = await fetch(BACKEND_URL_TEXT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: question, selectedLanguage: selectedLanguage, selectedMode: selectedMode }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = ''; // Background storage for complete response
    let displayContent = ''; // Content to display (English only)
    let isEnglish = true; // Flag to track if still in English

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            // Final render
            noteToggle.innerHTML = marked.parse(displayContent);
            input = fullResponse + "&&&" + selectedLanguage.trim();

            // Available for later use
            return;
          }

          try {
            const content = JSON.parse(data);
            fullResponse += content; // Always store
            if (isEnglish) {
              // Detect non-English (non-ASCII chars)
              if (/[^\x00-\x7F]/.test(content)) {
                isEnglish = false;
              } else {
                displayContent += content;
                noteToggle.innerHTML = marked.parse(displayContent); // Update display with markdown
              }
            }
          } catch (e) {
            // If not JSON, add raw
            fullResponse += data;
            if (isEnglish) {
              if (/[^\x00-\x7F]/.test(data)) {
                isEnglish = false;
              } else {
                displayContent += data;
                noteToggle.innerHTML = marked.parse(displayContent);
              }
            }
          }
        }
      }
      buffer = lines[lines.length - 1];
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      noteToggle.innerHTML = marked.parse(displayContent) + '\n[Stopped by user]';
    } else {
      out.innerHTML = `Error: ${e.message}`;
      console.error('Stream error:', e);
    }
  } finally {
    controller = null;
  }
}

  }

// Fixed streamAskImage: changed split('\n') to split('\n\n') for consistency with SSE format;
// added .trim() to data extraction to handle whitespace in 'data: ' lines
async function streamAskImage(imageFile, selectedLanguage, selectedMode) {
  fullResponse = '';
  parsedArray = [];
  panelEl.classList.add("opened", "default-size");
  overlayEl.classList.add("show");
 
  out.innerHTML = `
    <details open style="margin: 10px 0;">
      <summary style="cursor: pointer; font-weight: bold;">View Note</summary>
      <div id="note-toggle"><div class="loading-squares"><span></span><span></span><span></span></div></div>
    </details>
  `;
  const noteToggle = document.getElementById("note-toggle");
 
  controller = new AbortController();
  
  if (selectedMode == "Solve Smart") {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('selectedLanguage', selectedLanguage);
      formData.append('selectedMode', selectedMode);
      const response = await fetch(BACKEND_URL_IMAGE, {
        method: "POST",
        body: formData,
        signal: controller.signal
      });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    // Buffers / state
    let buffer = "";
    let fullResponseRaw = "";   // ALWAYS append cleaned chunk here (final full response)
    let englishBlock = "";      // English array section before &&&& (cleaned)
    let tamilBlock = "";        // Tamil section after &&&& (cleaned)
    let tamilStarted = false;

    let parsedList = [];        // parsed nested list when possible
    let displayContent = "";    // joined second elements for UI

    // Helper: try to safely parse / normalize incoming 'data' string
    function normalizeChunk(data) {
      // 1) Try JSON.parse safely. If it yields object -> stringify, if string -> use it.
      try {
        const parsed = JSON.parse(data);
        if (typeof parsed === "string") return parsed;
        // if it's an object/array/number/boolean -> stringify to stable string
        return JSON.stringify(parsed);
      } catch {
        // 2) If JSON.parse fails, clean double-escaped wrapping quotes and common escape sequences
        // Remove only matching leading/trailing quotes (one or many)
        let s = data.replace(/^"+|"+$/g, "");
        // Convert escaped quotes \" => "
        s = s.replace(/\\"/g, '"');
        // Unescape common escaped newlines \n -> actual newline
        s = s.replace(/\\n/g, "\n");
        // Unescape escaped tabs etc if present
        s = s.replace(/\\t/g, "\t");
        return s;
      }
    }

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (!line.startsWith("data: ")) continue;
        const rawData = line.slice(6);

        if (rawData === "[DONE]") {
          // Finalize full response using the raw canonical accumulator
          fullResponse = fullResponseRaw;
          console.log("Final stored input:", fullResponse);

          // Try final parse of englishBlock to extract display content (defensive)
          try {
            parsedList = JSON.parse(englishBlock);
            displayContent = parsedList
              .filter(item => Array.isArray(item) && item.length >= 2)
              .map(item => item[1])
              .join("\n\n");
          } catch (e) {
            // If parsing fails, fallback: try to extract second elements with regex (best-effort)
            console.warn("Final JSON parse failed, falling back:", e);
            // naive fallback: find matches of ["type","content",...]
            const fallbackMatches = [...englishBlock.matchAll(/\[ *"(?:[^"\\]|\\.)*" *, *"(?:[^"\\]|\\.)*"/g)];
            displayContent = fallbackMatches
              .map(m => {
                const inner = m[0];
                const parts = inner.split(/",\s*"/).map(p => p.replace(/^\[ *"/, "").replace(/"$/, ""));
                return parts[1] || "";
              })
              .join("\n\n");
          }

          noteToggle.innerHTML = marked.parse(displayContent);
          // Optionally you might want to store fullResponse somewhere global:
          window.LAST_FULL_RESPONSE = fullResponse;
          return;
        }

        // Normalize incoming chunk in a single canonical string form
        const clean = normalizeChunk(rawData);

        // Append to canonical full response => ALWAYS
        fullResponseRaw += clean;

        // If separator exists inside this chunk, split and route pieces
        if (!tamilStarted && clean.includes("&&&&")) {
          tamilStarted = true;
          const [before, after] = clean.split("&&&&", 2);
          englishBlock += before;
          tamilBlock += after || "";
        } else {
          if (!tamilStarted) {
            englishBlock += clean;
          } else {
            tamilBlock += clean;
          }
        }

        // Try parsing the englishBlock progressively to update the live UI.
        // This will succeed only once englishBlock contains a valid JSON array.
        try {
          const arr = JSON.parse(englishBlock);
          if (Array.isArray(arr)) {
            parsedList = arr;
            // Build displayContent from second element of each inner list
            displayContent = arr
              .filter(item => Array.isArray(item) && item.length >= 2)
              .map(item => item[1])
              .join("\n\n");

            // Progressive update
            noteToggle.innerHTML = marked.parse(displayContent);
          }
        } catch {
          // Not yet a complete JSON — ignore and wait for more chunks
        }
      }

      // leftover partial line remains in buffer
      buffer = lines[lines.length - 1];
    }

  } catch (e) {
    // show what we have so far
    noteToggle.innerHTML = marked.parse(
      (typeof displayContent === "string" ? displayContent : "") + "\n\n[Error / Stopped]"
    );

    if (e.name === "AbortError") {
      console.warn("Request aborted by user.");
    } else {
      out.innerHTML = `Error: ${e.message}`;
      console.error("Stream error:", e);
    }
  } finally {
    controller = null;
  }}
  else{
     try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('selectedLanguage', selectedLanguage);
    formData.append('selectedMode', selectedMode);
    const response = await fetch(BACKEND_URL_IMAGE, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = ''; // Background storage for complete response
    let displayContent = ''; // Content to display (English only)
    let isEnglish = true; // Flag to track if still in English

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            // Final render
            noteToggle.innerHTML = marked.parse(displayContent);
            input = fullResponse + "&&&" + selectedLanguage.trim();
            // Available for later use
            return;
          }

          try {
            const content = JSON.parse(data);
            fullResponse += content; // Always store
            if (isEnglish) {
              // Detect non-English (non-ASCII chars)
              if (/[^\x00-\x7F]/.test(content)) {
                isEnglish = false;
              } else {
                displayContent += content;
                noteToggle.innerHTML = marked.parse(displayContent); // Update display with markdown
              }
            }
          } catch (e) {
            // If not JSON, add raw
            fullResponse += data;
            if (isEnglish) {
              if (/[^\x00-\x7F]/.test(data)) {
                isEnglish = false;
              } else {
                displayContent += data;
                noteToggle.innerHTML = marked.parse(displayContent);
              }
            }
          }
        }
      }
      buffer = lines[lines.length - 1];
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      noteToggle.innerHTML = marked.parse(displayContent) + '\n[Stopped by user]';
    } else {
      out.innerHTML = `Error: ${e.message}`;
      console.error('Stream error:', e);
    }
  } finally {
    controller = null;
  }
}

}
async function streamResponse(userPrompt = '') {
  source.src = "processing.mp4";
  video.removeAttribute("controls");
  video.load();
  out.innerHTML = '<div class="loading-squares"><span></span><span></span><span></span></div>';
  if (uploadedImageFile) {
    await streamAskImage(uploadedImageFile, selectedLanguage, selectedMode);
    uploadedImageFile = null;
    chatInput.value = '';
  }
  else {
    // Text-only request - send to /ask
    const question = userPrompt.trim() || chatInput.value.trim() || "Say hello in one sentence.";
    if (!question) {
      out.innerHTML = "⚠️ Please enter a prompt.";
      return;
    }
    await streamAsk(question, selectedLanguage, selectedMode);
  }
 
  if (selectedMode=="Solve Smart"){
    loadVideomath();
  }
  else{
    loadVideo();
  }
 
  updateSendIcon();
}
// Settings menu
const settingsBtn = document.querySelector('.file');
const settingsMenu = document.querySelector('.settings-menu');
const overlay = document.querySelector('.overlay');
const cancelOption = document.querySelector('.cancel-opt');
settingsBtn.addEventListener('click', () => {
  settingsMenu.classList.add('open');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
});
overlay.addEventListener('click', closeSettings);
cancelOption.addEventListener('click', closeSettings);
function closeSettings() {
  settingsMenu.classList.remove('open');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}
// Attachment options
const imageOpt = document.querySelector('.image-opt');
const cameraOpt = document.querySelector('.camera-opt');
imageOpt.addEventListener('click', () => {
  document.getElementById('upload-image').click();
  closeSettings();
});

cameraOpt.addEventListener('click', () => {
  document.getElementById('take-photo').click();
  closeSettings();
});

// Handle uploads with image resizing to fix low memory issues and improve speed
function handleUpload(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    // Create a resized/compressed version to avoid low memory errors (esp. on mobile camera)
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set max dimensions to prevent memory issues (adjust as needed)
        const maxWidth = 1024;
        const maxHeight = 1024;
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress (quality 0.85)
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(function(blob) {
          const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
          uploadedImageFile = resizedFile;
          chatInput.value = `📷 Image uploaded: ${file.name} (resized for speed)`;
          updateSendIcon();
        }, 'image/jpeg', 0.85);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  } else if (file) {
    uploadedImageFile = file;
    chatInput.value = `File uploaded: ${file.name} (not an image)`;
    updateSendIcon();
  }
}

document.getElementById('upload-image').addEventListener('change', handleUpload);
document.getElementById('take-photo').addEventListener('change', handleUpload);
// document.getElementById('upload-file').addEventListener('change', handleUpload);
// Sidebar logic
const userAvatar = document.querySelector('.top-bar .avatar');
const sidebar = document.querySelector('.sidebar-drawer');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
userAvatar.addEventListener('click', function(e){
  sidebar.classList.add('open');
  sidebarOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  e.stopPropagation();
});
sidebarOverlay.addEventListener('click', closeSidebar);
function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
  document.body.style.overflow = '';
}
sidebar.addEventListener('click', function(e){
  e.stopPropagation();
});
// Sidebar actions
document.querySelectorAll('.sidebar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.textContent === 'New') {
      window.open("home.html","_self")
    } else if (btn.textContent === 'Feedback') {
      window.open("feedback.html","_self")
    } else if (btn.textContent === 'ToggleMode') {
      document.body.classList.toggle('dark');
    }
    closeSidebar();
  });
});
document.querySelector('.sidebar-settings').addEventListener('click', () => {
  alert('Settings page opened');
  closeSidebar();
});
const settingsSheet = document.getElementById("settingsSheet");
const languageList = document.getElementById("languageList");
const allLanguages = [
  'English','Tamil','Hindi','Malayalam','Kannada','Telugu','Bengali','Marathi','Gujarati','Punjabi','Urdu','French','German','Spanish','Italian','Russian','Japanese','Korean','Chinese','Arabic','Portuguese','Dutch','Greek','Hebrew','Turkish','Polish','Thai','Vietnamese','Swedish','Finnish','Czech','Hungarian'
];
// Show Languages
function filterLanguages(query) {
  const filtered = allLanguages.filter(lang => lang.toLowerCase().startsWith(query.toLowerCase()));
  displayLanguages(filtered);
}
function displayLanguages(list) {
  languageList.innerHTML = "";
  list.forEach(lang => {
    const div = document.createElement("div");
    div.className = "language-option";
    if (selectedLanguage === lang) div.classList.add("selected");
    div.onclick = () => {
      selectedLanguage = lang;
      displayLanguages(list);
    };
    const title = document.createElement("span");
    title.textContent = lang;
    const radio = document.createElement("div");
    radio.className = "radio";
    div.appendChild(title);
    div.appendChild(radio);
    languageList.appendChild(div);
  });
}
// Mode Select
function selectMode(mode) {
  selectedMode = mode;
  [...document.querySelectorAll("#modeContent .mode-option")].forEach(opt => {
    opt.classList.remove("selected");
  });
  const selectedDiv = [...document.querySelectorAll("#modeContent .mode-option")].find(opt =>
    opt.innerText.includes(mode)
  );
  if (selectedDiv) selectedDiv.classList.add("selected");
}
// Toggle Panel
const settingsOverlay = document.getElementById("settingsOverlay");
function toggleSheet() {
  const isOpening = !settingsSheet.classList.contains("open");
  if (isOpening) {
    const currentHeight = document.getElementById("languageTab").classList.contains("active") ? "default-height" : "mode-height";
    settingsSheet.classList.remove("default-height", "mode-height");
    settingsSheet.classList.add("open", currentHeight);
    settingsOverlay.classList.add("active");
  } else {
    closeSheet();
  }
}
function closeSheet() {
  settingsSheet.classList.remove("open");
  settingsOverlay.classList.remove("active");
}
function switchTab(tab) {
  document.getElementById("languageTab").classList.remove("active");
  document.getElementById("modeTab").classList.remove("active");
  document.getElementById("languageContent").style.display = 'none';
  document.getElementById("modeContent").style.display = 'none';
  settingsSheet.classList.remove("default-height", "mode-height");
  if (tab === 'language') {
    document.getElementById("languageTab").classList.add("active");
    document.getElementById("languageContent").style.display = 'block';
    settingsSheet.classList.add("default-height");
  } else {
    document.getElementById("modeTab").classList.add("active");
    document.getElementById("modeContent").style.display = 'block';
    settingsSheet.classList.add("mode-height");
  }
}
// Touch to drag down — from entire header area
const dragRegion = document.getElementById("settingsHeader");
let startY = 0;
dragRegion.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
});
dragRegion.addEventListener("touchend", (e) => {
  const endY = e.changedTouches[0].clientY;
  if (endY - startY > 100) closeSheet();
});
// Swipe tabs left/right
let startX = 0;
settingsSheet.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});
settingsSheet.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = endX - startX;
  if (diff > 60) switchTab('language');
  else if (diff < -60) switchTab('mode');
});
// Init
// === INIT VALUES ===
window.addEventListener("DOMContentLoaded", () => {
  // Show language tab by default with correct height
  switchTab('language');
  // Pre-select language
  selectedLanguage = "English";
  displayLanguages(allLanguages);
  // Pre-select mode
  selectedMode = "Simple Learn";
  selectMode("Simple Learn");
});
function togglePanel(){
  if(!panelEl.classList.contains("opened")){
    panelEl.classList.add("opened","default-size");
    overlayEl.classList.add("show");
  }else hidePanel();
}
function hidePanel(){
  panelEl.classList.remove("opened");
  overlayEl.classList.remove("show");
  // Add this new line here:
  document.querySelector('.actions .fa-file-lines').classList.remove('active');
}
headerTouch.addEventListener("touchstart",e=>touchStartY=e.touches[0].clientY);
headerTouch.addEventListener("touchend",e=>{
  if(e.changedTouches[0].clientY-touchStartY>100) hidePanel();
});
