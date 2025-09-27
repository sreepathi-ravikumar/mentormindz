
    // Firebase config - fill with your project's values
    const firebaseConfig = {
      apiKey: API_KEY,
      authDomain: AUTH_DOMAIN,
      projectId:PROJECT_ID,
      storageBucket: STORAGE_BUCKET,
      messagingSenderId: MESSAGINGSENDERID,
      appId: APP_ID,
      measurementId: MEASUREMENTID
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    const avatarDiv = document.querySelector('.avatar');
    const sidebarName = document.querySelector('.sidebar-username');
    const sidebarAvatar = document.querySelector('.sidebar-avatar');
    const logoutBtn = document.getElementById('logoutBtn');

    // Helper to get email username before @
    function emailUsername(email) {
      if (!email) return '';
      return email.split('@')[0];
    }

    // Show UI for logged out state
    function showLoggedOutUI() {
      avatarDiv.innerHTML = `
        <button id="customLoginBtn" style="
          background:#6366f1; 
          color:white; 
          border:none; 
          padding:6px 14px; 
          border-radius:8px; 
          cursor:pointer; 
          margin-left:20px;">Login</button>`;
      sidebarName.textContent = 'Guest';
      sidebarAvatar.innerHTML = '<i class="fa-solid fa-user"></i>';
      logoutBtn.style.display = 'none';

      // Add event listener to login button that closes sidebar THEN navigates
      const loginBtn = document.getElementById('customLoginBtn');
      loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeSidebar();
        // Wait for sidebar animation to finish before redirecting
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 300);
      });
    }

    // Show UI for logged in state
    function showLoggedInUI(user) {
      const photoURL = user.photoURL || 'https://www.gravatar.com/avatar/?d=mp';
      const displayName = user.displayName && user.displayName.trim() !== ''
        ? user.displayName
        : emailUsername(user.email);

      avatarDiv.innerHTML = `<img src="${photoURL}" alt="User Avatar" style="width:36px;height:36px;border-radius:50%;cursor:pointer;">`;
      sidebarName.textContent = displayName;
      sidebarAvatar.innerHTML = `<img src="${photoURL}" alt="User Avatar" style="width:32px;height:32px;border-radius:50%;">`;
      logoutBtn.style.display = 'block';
    }

    logoutBtn.addEventListener('click', () => {
      auth.signOut().then(() => {
        closeSidebar();
        showLoggedOutUI();
      }).catch((error) => {
        console.error('Logout failed:', error);
      });
    });

    // Monitor auth state and update UI accordingly
    auth.onAuthStateChanged(user => {
      if (user) {
        showLoggedInUI(user);
      } else {
        showLoggedOutUI();
      }
    });

    // --- Video Sharing & Download logic remains unchanged ---
    const videoPlayer = document.getElementById('myVideo');
    const shareBtn = document.getElementById('shareBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    let currentFile = null;
    let videoBlobURL = null;
    let fileName = null;

    // Check file share support
    let fileShareSupport = false;
    try {
      fileShareSupport = !!(navigator.canShare && navigator.canShare({ files: [new File([''], 'x.mp4', { type: 'video/mp4' })] }));
    } catch (e) {
      fileShareSupport = false;
    }

    async function fetchVideoAsFile() {
      const videoSrc = videoPlayer.currentSrc || videoPlayer.src;
      if (!videoSrc) return;
      fileName = videoSrc.split('/').pop().split('?')[0] || 'video.mp4';
      try {
        const response = await fetch(videoSrc);
        const blob = await response.blob();
        currentFile = new File([blob], fileName, { type: blob.type || 'video/mp4' });
        videoBlobURL = URL.createObjectURL(blob);
      } catch (err) {
        console.error('Video load failed, using fallback URL', err);
      }
    }
    fetchVideoAsFile();

    shareBtn.addEventListener('click', async () => {
      const videoSrc = videoPlayer.currentSrc || videoPlayer.src;
      if (currentFile && fileShareSupport) {
        try {
          await navigator.share({ files: [currentFile], title: currentFile.name, text: 'Sharing a video file' });
        } catch (err) {
          console.error('Share failed', err);
        }
      } else if (navigator.share) {
        try {
          await navigator.share({ url: videoSrc, title: 'Video', text: 'Sharing a video URL' });
        } catch (err) {
          console.error('Share failed', err);
        }
      } else {
        console.log('Native sharing not supported.');
      }
    });

    downloadBtn.addEventListener('click', () => {
      const videoSrc = videoPlayer.currentSrc || videoPlayer.src;
      if (!videoSrc) return;
      const src = videoBlobURL || videoSrc;
      const dlName = currentFile ? currentFile.name : fileName || 'video.mp4';
      const a = document.createElement('a');
      a.href = src;
      a.download = dlName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    });

    window.addEventListener('beforeunload', () => {
      if (videoBlobURL) URL.revokeObjectURL(videoBlobURL);
    });