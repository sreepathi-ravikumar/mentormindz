const video = document.getElementById("myVideo");
const source = document.getElementById("videoSource");
const videos = [
  { src: "video.mp4", audio: true, loop: false },
  { src: "videopage.mp4", audio: false, loop: true }
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
    const url = "error.mp4"
    source.src = url;
    video.load();
    panelEl.classList.remove("opened");
    overlayEl.classList.remove("show");
    document.querySelector('.actions .fa-file-lines').classList.remove('active');
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
    const url = "error.mp4"
    source.src = url;
    video.load();
    panelEl.classList.remove("opened");
    overlayEl.classList.remove("show");
    document.querySelector('.actions .fa-file-lines').classList.remove('active');
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
  let fullResponseRaw = "";
  let englishBlock = "";
  let tamilBlock = "";
  let tamilStarted = false;

  let parsedList = [];
  let displayContent = "";

  // Helper: normalize incoming chunk
  function normalizeChunk(data) {
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed === "string") return parsed;
      return JSON.stringify(parsed);
    } catch {
      let s = data.replace(/^"+|"+$/g, "");
      s = s.replace(/\\"/g, '"');
      s = s.replace(/\\n/g, "\n");
      s = s.replace(/\\t/g, "\t");
      return s;
    }
  }

  // Helper: Remove # and % symbols
  function processLatexText(text) {
    if (!text) return "";
    return text
      .replace(/#%/g, '')  // Remove #% combination first
      .replace(/#/g, '')   // Remove all # symbols
      .replace(/%/g, '')   // Remove all % symbols
      .trim();
  }

  // Helper: Format content items
  function formatContentItem(item) {
    if (!Array.isArray(item) || item.length < 2) return "";
    
    const [type, content] = item;
    const processed = processLatexText(content);
    
    // Skip empty content
    if (!processed) return "";
    
    switch (type) {
      case "title":
        return `<div class="content-title">
          <h1>${processed}</h1>
        </div>`;
      
      case "text":
        return `<div class="content-text">
          <p>${processed}</p>
        </div>`;
      
      case "equation":
        return `<div class="content-equation">
          $$${processed}$$
        </div>`;
      
      case "code":
        return `<div class="content-code">
          <pre><code>${content}</code></pre>
        </div>`;
      
      case "list":
        return `<div class="content-list">
          ${processed}
        </div>`;
      
      default:
        return `<div class="content-default">
          <p>${processed}</p>
        </div>`;
    }
  }

  // Helper: Render LaTeX in DOM element (FIXED VERSION)
  function renderLatexInElement(element) {
    if (typeof renderMathInElement !== 'undefined') {
      try {
        // Call renderMathInElement on the actual DOM element
        renderMathInElement(element, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false,
          errorColor: '#cc0000',
          trust: true,
          strict: false,
          macros: {
            "\\RR": "\\mathbb{R}",
            "\\NN": "\\mathbb{N}",
            "\\ZZ": "\\mathbb{Z}",
            "\\QQ": "\\mathbb{Q}"
          }
        });
      } catch (e) {
        console.error("KaTeX rendering error:", e);
      }
    } else {
      console.warn("renderMathInElement is not available. Make sure KaTeX auto-render is loaded.");
    }
  }

  // Helper: Build display content from parsed array
  function buildDisplayContent(arr) {
    const items = arr
      .filter(item => Array.isArray(item) && item.length >= 2)
      .map(formatContentItem)
      .filter(html => html.trim() !== "") // Remove empty items
      .join("\n");
    
    return `<div class="math-content-wrapper">${items}</div>`;
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
        fullResponse = fullResponseRaw + "&&&" + selectedLanguage.trim();
        console.log("Final stored input:", fullResponse);

        try {
          // Parse the JSON
          parsedList = JSON.parse(englishBlock);
          
          if (Array.isArray(parsedList) && parsedList.length > 0) {
            // Build HTML content
            const htmlContent = buildDisplayContent(parsedList);
            displayContent = htmlContent;
            
            // STEP 1: Set HTML first
            noteToggle.innerHTML = htmlContent;
            
            // STEP 2: Then render LaTeX on the DOM element
            renderLatexInElement(noteToggle);
            
            console.log("Rendering complete with LaTeX!");
          } else {
            throw new Error("Parsed result is not a valid array");
          }
        } catch (e) {
          console.error("JSON parse error:", e);
          console.log("English block:", englishBlock);
          
          noteToggle.innerHTML = `<div class="error-message">
            <p><strong>Content processing error</strong></p>
            <p>Error: ${e.message}</p>
          </div>`;
        }

        window.LAST_FULL_RESPONSE = fullResponse;
        window.LAST_PARSED_DATA = {
          english: parsedList,
          tamil: tamilBlock.trim()
        };
        
        return;
      }

      const clean = normalizeChunk(rawData);
      fullResponseRaw += clean;

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

      // Progressive rendering
      try {
        const arr = JSON.parse(englishBlock);
        
        if (Array.isArray(arr) && arr.length > 0) {
          parsedList = arr;
          const htmlContent = buildDisplayContent(arr);
          displayContent = htmlContent;
          
          // STEP 1: Set HTML first
          noteToggle.innerHTML = htmlContent;
          
          // STEP 2: Then render LaTeX
          renderLatexInElement(noteToggle);
        }
      } catch (parseError) {
        // Not ready yet, silent fail during progressive parsing
      }
    }

    buffer = lines[lines.length - 1];
  }

} catch (e) {
  const errorContent = displayContent || "<p>An error occurred</p>";
  noteToggle.innerHTML = `${errorContent}<div class="error-message"><strong>[Error / Stopped]</strong><br>${e.message}</div>`;

  if (e.name === "AbortError") {
    console.warn("Request aborted by user.");
  } else {
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

  // Helper function to extract English content from full response
  function extractEnglishContent(text) {
    // Split by #### to get individual sections
    const sections = text.split('####');
    
    let englishParts = [];
    
    for (let section of sections) {
      section = section.trim();
      if (!section) continue;
      
      // Check if section contains &&&
      if (true) {
        // Split at first occurrence of \n\n to separate English from Tamil
        const parts = section.split('\n\n');
        if (parts.length > 0) {
          englishParts.push(parts[0].trim());
        }
      } else {
        // No separator yet, include the whole section
        englishParts.push(section.trim());
      }
    }
    
    return englishParts.join('\n\n\n'); // Join with double line gaps
  }

  // Helper function to process display content (remove ### and make blue/bold)
  function processDisplayContent(text) {
    // Remove ### and make that line bold with blue color
    return text.replace(/^###\s*(.+)$/gm, '<h2 style="color: #4a90e2; font-weight: bold; margin: 1.5em 0 0.5em 0; padding-bottom: 0.3em; border-bottom: 2px solid #4a90e2;">$1</h2>');
  }

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
          // Extract English content from full response
          displayContent = extractEnglishContent(fullResponse);
          
          // Process and render final display content
          const processedContent = processDisplayContent(displayContent);
          noteToggle.innerHTML = marked.parse(processedContent);
          
          // Store full response with language appended (remove trailing #### if present)
          const cleanedResponse = fullResponse.trim().replace(/####\s*$/, '').trim();
          input = cleanedResponse + (cleanedResponse.endsWith('&&&' + selectedLanguage.trim()) ? '' : '\n&&&' + selectedLanguage.trim());
          

          return;
        }

        try {
          const content = JSON.parse(data);
          fullResponse += content; // Always store in full response
          
          // Progressive update: extract and display English content
          displayContent = extractEnglishContent(fullResponse);
          const processedContent = processDisplayContent(displayContent);
          noteToggle.innerHTML = marked.parse(processedContent);
          
        } catch (e) {
          // If not JSON, add raw data
          fullResponse += data;
          
          // Progressive update: extract and display English content
          displayContent = extractEnglishContent(fullResponse);
          const processedContent = processDisplayContent(displayContent);
          noteToggle.innerHTML = marked.parse(processedContent);
        }
      }
    }
    buffer = lines[lines.length - 1];
  }
} catch (e) {
  if (e.name === 'AbortError') {
    displayContent = extractEnglishContent(fullResponse);
    const processedContent = processDisplayContent(displayContent);
    noteToggle.innerHTML = marked.parse(processedContent) + '<p style="color: #cc0000; margin-top: 1em;">[Stopped by user]</p>';
  } else {
    out.innerHTML = `<span style="color: #cc0000;">Error: ${e.message}</span>`;
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
  let fullResponseRaw = "";
  let englishBlock = "";
  let tamilBlock = "";
  let tamilStarted = false;

  let parsedList = [];
  let displayContent = "";

  // Helper: normalize incoming chunk
  function normalizeChunk(data) {
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed === "string") return parsed;
      return JSON.stringify(parsed);
    } catch {
      let s = data.replace(/^"+|"+$/g, "");
      s = s.replace(/\\"/g, '"');
      s = s.replace(/\\n/g, "\n");
      s = s.replace(/\\t/g, "\t");
      return s;
    }
  }

  // Helper: Remove # and % symbols
  function processLatexText(text) {
    if (!text) return "";
    return text
      .replace(/#%/g, '')  // Remove #% combination first
      .replace(/#/g, '')   // Remove all # symbols
      .replace(/%/g, '')   // Remove all % symbols
      .trim();
  }

  // Helper: Format content items
  function formatContentItem(item) {
    if (!Array.isArray(item) || item.length < 2) return "";
    
    const [type, content] = item;
    const processed = processLatexText(content);
    
    // Skip empty content
    if (!processed) return "";
    
    switch (type) {
      case "title":
        return `<div class="content-title">
          <h1>${processed}</h1>
        </div>`;
      
      case "text":
        return `<div class="content-text">
          <p>${processed}</p>
        </div>`;
      
      case "equation":
        return `<div class="content-equation">
          $$${processed}$$
        </div>`;
      
      case "code":
        return `<div class="content-code">
          <pre><code>${content}</code></pre>
        </div>`;
      
      case "list":
        return `<div class="content-list">
          ${processed}
        </div>`;
      
      default:
        return `<div class="content-default">
          <p>${processed}</p>
        </div>`;
    }
  }

  // Helper: Render LaTeX in DOM element (FIXED VERSION)
  function renderLatexInElement(element) {
    if (typeof renderMathInElement !== 'undefined') {
      try {
        // Call renderMathInElement on the actual DOM element
        renderMathInElement(element, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\[', right: '\\]', display: true },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false,
          errorColor: '#cc0000',
          trust: true,
          strict: false,
          macros: {
            "\\RR": "\\mathbb{R}",
            "\\NN": "\\mathbb{N}",
            "\\ZZ": "\\mathbb{Z}",
            "\\QQ": "\\mathbb{Q}"
          }
        });
      } catch (e) {
        console.error("KaTeX rendering error:", e);
      }
    } else {
      console.warn("renderMathInElement is not available. Make sure KaTeX auto-render is loaded.");
    }
  }

  // Helper: Build display content from parsed array
  function buildDisplayContent(arr) {
    const items = arr
      .filter(item => Array.isArray(item) && item.length >= 2)
      .map(formatContentItem)
      .filter(html => html.trim() !== "") // Remove empty items
      .join("\n");
    
    return `<div class="math-content-wrapper">${items}</div>`;
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
        fullResponse = fullResponseRaw + "&&&" + selectedLanguage.trim();
        console.log("Final stored input:", fullResponse);

        try {
          // Parse the JSON
          parsedList = JSON.parse(englishBlock);
          
          if (Array.isArray(parsedList) && parsedList.length > 0) {
            // Build HTML content
            const htmlContent = buildDisplayContent(parsedList);
            displayContent = htmlContent;
            
            // STEP 1: Set HTML first
            noteToggle.innerHTML = htmlContent;
            
            // STEP 2: Then render LaTeX on the DOM element
            renderLatexInElement(noteToggle);
            
            console.log("Rendering complete with LaTeX!");
          } else {
            throw new Error("Parsed result is not a valid array");
          }
        } catch (e) {
          console.error("JSON parse error:", e);
          console.log("English block:", englishBlock);
          
          noteToggle.innerHTML = `<div class="error-message">
            <p><strong>Content processing error</strong></p>
            <p>Error: ${e.message}</p>
          </div>`;
        }

        window.LAST_FULL_RESPONSE = fullResponse;
        window.LAST_PARSED_DATA = {
          english: parsedList,
          tamil: tamilBlock.trim()
        };
        
        return;
      }

      const clean = normalizeChunk(rawData);
      fullResponseRaw += clean;

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

      // Progressive rendering
      try {
        const arr = JSON.parse(englishBlock);
        
        if (Array.isArray(arr) && arr.length > 0) {
          parsedList = arr;
          const htmlContent = buildDisplayContent(arr);
          displayContent = htmlContent;
          
          // STEP 1: Set HTML first
          noteToggle.innerHTML = htmlContent;
          
          // STEP 2: Then render LaTeX
          renderLatexInElement(noteToggle);
        }
      } catch (parseError) {
        // Not ready yet, silent fail during progressive parsing
      }
    }

    buffer = lines[lines.length - 1];
  }

} catch (e) {
  const errorContent = displayContent || "<p>An error occurred</p>";
  noteToggle.innerHTML = `${errorContent}<div class="error-message"><strong>[Error / Stopped]</strong><br>${e.message}</div>`;

  if (e.name === "AbortError") {
    console.warn("Request aborted by user.");
  } else {
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

  // Helper function to extract English content from full response
  function extractEnglishContent(text) {
    // Split by #### to get individual sections
    const sections = text.split('####');
    
    let englishParts = [];
    
    for (let section of sections) {
      section = section.trim();
      if (!section) continue;
      
      // Check if section contains &&&
      if (true) {
        // Split at first occurrence of \n\n to separate English from Tamil
        const parts = section.split('\n\n');
        if (parts.length > 0) {
          englishParts.push(parts[0].trim());
        }
      } else {
        // No separator yet, include the whole section
        englishParts.push(section.trim());
      }
    }
    
    return englishParts.join('\n\n\n'); // Join with double line gaps
  }

  // Helper function to process display content (remove ### and make blue/bold)
  function processDisplayContent(text) {
    // Remove ### and make that line bold with blue color
    return text.replace(/^###\s*(.+)$/gm, '<h2 style="color: #4a90e2; font-weight: bold; margin: 1.5em 0 0.5em 0; padding-bottom: 0.3em; border-bottom: 2px solid #4a90e2;">$1</h2>');
  }

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
          // Extract English content from full response
          displayContent = extractEnglishContent(fullResponse);
          
          // Process and render final display content
          const processedContent = processDisplayContent(displayContent);
          noteToggle.innerHTML = marked.parse(processedContent);
          
          // Store full response with language appended (remove trailing #### if present)
          const cleanedResponse = fullResponse.trim().replace(/####\s*$/, '').trim();
          input = cleanedResponse + (cleanedResponse.endsWith('&&&' + selectedLanguage.trim()) ? '' : '\n&&&' + selectedLanguage.trim());
          

          return;
        }

        try {
          const content = JSON.parse(data);
          fullResponse += content; // Always store in full response
          
          // Progressive update: extract and display English content
          displayContent = extractEnglishContent(fullResponse);
          const processedContent = processDisplayContent(displayContent);
          noteToggle.innerHTML = marked.parse(processedContent);
          
        } catch (e) {
          // If not JSON, add raw data
          fullResponse += data;
          
          // Progressive update: extract and display English content
          displayContent = extractEnglishContent(fullResponse);
          const processedContent = processDisplayContent(displayContent);
          noteToggle.innerHTML = marked.parse(processedContent);
        }
      }
    }
    buffer = lines[lines.length - 1];
  }
} catch (e) {
  if (e.name === 'AbortError') {
    displayContent = extractEnglishContent(fullResponse);
    const processedContent = processDisplayContent(displayContent);
    noteToggle.innerHTML = marked.parse(processedContent) + '<p style="color: #cc0000; margin-top: 1em;">[Stopped by user]</p>';
  } else {
    out.innerHTML = `<span style="color: #cc0000;">Error: ${e.message}</span>`;
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
// const fileOpt = document.querySelector('.file-opt');
//const cameraOpt = document.querySelector('.camera-opt');
imageOpt.addEventListener('click', () => {
  document.getElementById('upload-image').click();
  closeSettings();
});
// fileOpt.addEventListener('click', () => {
// document.getElementById('upload-file').click();
// closeSettings();
// });
//cameraOpt.addEventListener('click', () => {
  //document.getElementById('take-photo').click();
  //closeSettings();
//});
// Handle uploads
function handleUpload(e) {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    uploadedImageFile = file;
    chatInput.value = `📷 Image uploaded: ${file.name}`;
    updateSendIcon();
  } else if (file) {
    chatInput.value = `File uploaded: ${file.name} (not an image)`;
  }
}
document.getElementById('upload-image').addEventListener('change', handleUpload);
//document.getElementById('take-photo').addEventListener('change', handleUpload);
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
    const action = btn.dataset.action;
    const logo = document.querySelector(".logo");

    if (action === "new") {
      window.open("home.html", "_self");
    } 
    else if (action === "feedback") {
      window.open("feedback.html", "_self");
    } 
    else if (action === "toggle-theme") {
      document.body.classList.toggle("dark");

      // Logo switch based on theme
      if (document.body.classList.contains("dark")) {
        logo.src = "logoimgl.jpg";
      } else {
        logo.src = "logoimg.jpg";
      }
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
  'English', 'Hindi', 'Chinese', 'Spanish', 'Arabic', 'French', 'Bengali', 'Portuguese', 'Russian', 'Tamil'
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
