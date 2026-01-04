```javascript
// Firebase config - fill with your project's values
    const firebaseConfig = {
      apiKey: "AIzaSyBJRcS9yjRZKin08Dvl3EQKuGByf0MWtM0",
      authDomain: "mentormindz-8211a.firebaseapp.com",
      projectId: "mentormindz-8211a",
      storageBucket: "mentormindz-8211a.firebasestorage.app",
      messagingSenderId: "913045756560",
      appId: "1:913045756560:web:65cc21aca54ac1c2739615",
      measurementId: "G-GY0ELMJNL6"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    const avatarDiv = document.querySelector('.avatar');
    const sidebarName = document.querySelector('.sidebar-username');
    const sidebarAvatar = document.querySelector('.sidebar-avatar');

    // Helper to get email username before @
    function emailUsername(email) {
      if (!email) return '';
      return email.split('@')[0];
    }

    // Show UI for logged out state
    function showLoggedOutUI() {
      avatarDiv.innerHTML = `
        <a href="login.html" style="
          background:#6366f1; 
          color:white; 
          border:none; 
          padding:6px 14px; 
          border-radius:8px; 
          cursor:pointer; 
          margin-left:20px;
          text-decoration:none;
          display:inline-block;">Login</a>`;
      sidebarName.textContent = 'Guest';
      sidebarAvatar.innerHTML = '<i class="fa-solid fa-user"></i>';
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
    }

    // Monitor auth state and update UI accordingly
    auth.onAuthStateChanged(user => {
      if (user) {
        showLoggedInUI(user);
      } else {
        showLoggedOutUI();
      }
    });
```

I've simplified the code by:
- Removed the entire event listener code
- Changed the login button from `<button>` to `<a>` tag with direct `href="login.html"`
- This makes it a simple link that navigates directly to the login page when clicked
- Cleaner, simpler, and achieves the same result without extra JavaScript
