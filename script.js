 let Mode=""
 const easyMode = document.getElementById("easyMode");
 const detailedMode = document.getElementById("detailedMode");
 const solveMode = document.getElementById("solveMode");

    // Add event listeners to detect changes
    easyMode.addEventListener("change", checkMode);
    detailedMode.addEventListener("change", checkMode);
    solveMode.addEventListener("change", checkMode);
  // Step 1: Create an array of your video links
  const videoLinks = [
    "video(1).mp4",
    "video(2).mp4",
    "video(3).mp4"
  ];

  // Step 2: Pick a random video from the array
  const randomIndex = Math.floor(Math.random() * videoLinks.length);
  const randomVideo = videoLinks[randomIndex]; 
  const video = document.getElementById("myVideo");
  const source = document.getElementById("videoSource");

  source.src = randomVideo;
  video.load();
  video.play()
   // optional: start playing

    function checkMode() {
      if (easyMode.checked) {
        Mode="Explain this concept in details Mode: give a detailed and complete explanation including definitions, conceptual breakdowns, real-life applications, multiple examples, and step-by-step working. Assume I am a beginner but curious to understand deeply. Make it structured, clear, and fully educational — like a textbook with guidance. words limits 200-250";
  
      } else if (detailedMode.checked) {
        Mode="Explain this concept in very simple and short form, minimum 10-20 words to maximum 50–60 words. Use basic vocabulary that even a 12-year-old can understand. Avoid any unnecessary details. Just make it short, clear, and easy to understand — like a first-time learner or a revision summary.";
        
      }
      else if (solveMode.checked) {
        Mode="Act like a professional teacher solving a math or physics problem on a board, using only numerical methods, formulas, steps, calculations, and values — no wordy explanations. Do not include definitions or long descriptions. Focus only on solving step-by-step with clarity, like a student watching a board. Avoid poetic or abstract language. Just clean, classroom-style numerical solving.";
        
      }
      
    }

    // Check the selected mode once on page load
    checkMode();

 const submitBtn = document.getElementById("submit-btn");
    const inputField = document.getElementById("question-input");
    const micBtn = document.getElementById("mic-btn");
    const micIcon = document.getElementById("mic-icon");
    const summaryBtn = document.getElementById("summary-btn");
    const summaryOutput = document.getElementById("summary-output");

    let recognition;
    let isListening = false;

    if ('webkitSpeechRecognition' in window) {
      recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
      recognition = new SpeechRecognition();
    } else {
      alert("Sorry, your browser does not support Speech Recognition");
    }

    if (recognition) {
      recognition.continuous = true; // Keep recognizing until stopped
      recognition.interimResults = true; // Show live text
      recognition.lang = 'en-US';

      micBtn.addEventListener('click', () => {
        if (!isListening) {
          startListening();
        } else {
          stopListening();
        }
      });

      function startListening() {
        recognition.start();
        isListening = true;
        micIcon.classList.add("listening");
        inputField.placeholder = "Listening...";
      }

      function stopListening() {
        recognition.stop();
        isListening = false;
        micIcon.classList.remove("listening");
        inputField.placeholder = "Gain Your Knowledge...";
      }

      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            inputField.value = event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
            inputField.value = interimTranscript;
          }
        }
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        stopListening();
      };
    }

    submitBtn.addEventListener("click", async () => {
      const questionOnly = inputField.value.trim();
      const question = questionOnly+" "+Mode
      if (!questionOnly) return;

      const originalIcon = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="loading"></span>';
      submitBtn.disabled = true;
      const video = document.getElementById("myVideo");
      const source = document.getElementById("videoSource");

      source.src = "https://cdn.pixabay.com/video/2021/05/27/75439-556022158_large.mp4";
      video.removeAttribute("controls");
      video.load();

      try {
        const res = await fetch("https://newgateway.onrender.com/ask", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Secret-Token": "rkmentormindzofficalstokens12345"
  },
  body: JSON.stringify({ question })
});


        const data = await res.json();
        if (data.answer) {
          summaryOutput.innerHTML = marked.parse("<br><br>" + data.answer);
          summaryOutput.style.display = "none";

         const response = await fetch('https://gateway-bynk.onrender.com/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': 'rkmentormindzofficaltokenkey12345' // Example: "abc12345"
  },
  body: JSON.stringify({ duration: data.answer })
});
            const blob = await response.blob();
          const url = URL.createObjectURL(blob);

  const video = document.getElementById("myVideo");
  const source = document.getElementById("videoSource");

  source.src = url;
  video.setAttribute("controls", true);
  video.load(); // reload the video with new source
        }

        else {
          summaryOutput.innerHTML = "<p><br><br>No response received.</p>";
          summaryOutput.style.display = "none";
          const video = document.getElementById("myVideo");
          const source = document.getElementById("videoSource");

          source.src = " https://videos.pexels.com/video-files/6923433/6923433-sd_640_360_30fps.mp4";
          video.load();
        }
      } catch (err) {
        summaryOutput.innerHTML = "<p><br><br>Error: " + err.message + "</p>";
        summaryOutput.style.display = "none";
        const video = document.getElementById("myVideo");
        const source = document.getElementById("videoSource");

        source.src = " https://videos.pexels.com/video-files/6923433/6923433-sd_640_360_30fps.mp4";
        video.load();

      } finally {
        submitBtn.innerHTML = originalIcon;
        submitBtn.disabled = false;
      }
    });

    summaryBtn.addEventListener("click", () => {
      summaryOutput.style.display = summaryOutput.style.display === "block" ? "none" : "block";
    });
   