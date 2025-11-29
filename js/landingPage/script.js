const dropdownItems = document.querySelectorAll(".dropdown-item");

dropdownItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    const selectedFlag = this.getAttribute("data-flag");
    const selectedCountry = this.getAttribute("data-name");

    const currentFlag = document.getElementById("currentFlag");
    currentFlag.src = selectedFlag;
    currentFlag.alt = selectedCountry;
  });
});

const gradeData = {
  kindergarten: [
    { subject: "Mathematics", questions: 10 },
    { subject: "Science", questions: 10 }
  ],
  grade1: [
    { subject: "Mathematics", questions: 10 },
    { subject: "Science", questions: 10 }
  ],
  grade2: [
    { subject: "Mathematics", questions: 10 },
    { subject: "History", questions: 10 }
  ],
  grade3: [
    { subject: "English", questions: 10 },
    { subject: "Science", questions: 10 }
  ],
  grade4: [
    { subject: "Mathematics", questions: 10 },
    { subject: "Social Studies", questions: 10 }
  ],
  grade5: [
    { subject: "Mathematics", questions: 10 },
    { subject: "Science", questions: 10 },
    { subject: "History", questions: 10 }
  ]
};

document.addEventListener("DOMContentLoaded", function() {
  const loggedInUser  = localStorage.getItem("loggedInUser");
  const loginForm = document.getElementById("login-form");
  const welcomeContainer = document.getElementById("welcome-container");
  const usernameDisplay = document.getElementById("welcome-text");
  const logoutBtn = document.getElementById("logout-btn");
  const headerSection = document.querySelector(".header-section");

  if (loggedInUser) {
      if (loginForm) loginForm.style.display = "none"; // Hide login form
      if (welcomeContainer) welcomeContainer.style.display = "flex"; // Show welcome container

      // Parse the loggedInUser JSON if it's a string
      const userInfo = typeof loggedInUser === 'string' ? JSON.parse(loggedInUser) : loggedInUser;
      const displayName = userInfo.username || '';

      // Fix: Use correct id for username display
      const usernameDisplay = document.getElementById("username-display");
      if (usernameDisplay) {
        // Wrap each letter in a span with animation delay for wave effect
        usernameDisplay.innerHTML = '';
        for (let i = 0; i < displayName.length; i++) {
          const span = document.createElement('span');
          // Preserve spaces as normal spaces
          span.textContent = displayName[i] === ' ' ? '\u00A0' : displayName[i];
          span.style.animationDelay = (i * 0.1) + 's';
          usernameDisplay.appendChild(span);
        }
      }

      // Remove logout button from DOM
      if (logoutBtn && logoutBtn.parentNode) {
        logoutBtn.parentNode.removeChild(logoutBtn);
      }

      // Add repeated animation to welcome message
      const welcomeMessage = document.querySelector(".welcome-message");
      if (welcomeMessage) {
        welcomeMessage.classList.add("text-shimmer");
      }

      // Set user initials in dropdown button
      const userInitialSpan = document.getElementById("userInitial");
      const userDropdownDiv = document.querySelector(".user-profile-dropdown");
      if (userInitialSpan) {
        // Parse the loggedInUser JSON if it's a string
        const userInfo = typeof loggedInUser === 'string' ? JSON.parse(loggedInUser) : loggedInUser;
        const displayName = userInfo.username || '';
        
        const names = displayName.split(" ");
        let initials = "";
        if (names.length > 0 && names[0].length > 0) {
          initials = names[0].charAt(0).toUpperCase();
        }
        userInitialSpan.textContent = initials;
      }
      if (userDropdownDiv) {
        userDropdownDiv.style.display = "block"; // Show dropdown for logged-in user
      }

      // Add logged-in class to header to hide elements except logo
      if (headerSection) {
        headerSection.classList.add("logged-in");
      }
  } else {
      if (loginForm) loginForm.style.display = "block"; // Show login form
      if (welcomeContainer) welcomeContainer.style.display = "none"; // Hide welcome container
      const userDropdownDiv = document.querySelector(".user-profile-dropdown");
      if (userDropdownDiv) {
        userDropdownDiv.style.display = "none"; // Hide dropdown for logged-out user
      }
      if (logoutBtn) {
        logoutBtn.style.display = "none"; // Hide logout button for non-logged-in user
      }
  }
  
  // Function to render subjects and questions in grade cards
  function renderGradeSubjects() {
    Object.keys(gradeData).forEach(gradeClass => {
      const gradeCard = document.querySelector(`.grade-card.${gradeClass}`);
      if (gradeCard) {
        const subjectListContainer = gradeCard.querySelector(".grade-subject-list");
        if (subjectListContainer) {
          subjectListContainer.innerHTML = ""; // Clear existing content
          gradeData[gradeClass].forEach(item => {
            const subjectItem = document.createElement("div");
            subjectItem.classList.add("subject-item");
            subjectItem.innerHTML = `
              <span class="subject-name">${item.subject}</span>
              <span class="question-count">${item.questions}</span>
            `;
            subjectListContainer.appendChild(subjectItem);
          });
        }
      }
    });
  }

  renderGradeSubjects();

  if (document.getElementById("login-btn")) {
    document.getElementById("login-btn").addEventListener("click", function() {
        const usernameInput = document.getElementById("username").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();
        const selectedUserType = (localStorage.getItem('selectedUserType') || "").trim().toLowerCase();

        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Match by email (case-insensitive)
        const matchedUser = users.find(user => {
          const emailMatch = (user.email || '').trim().toLowerCase() === usernameInput;
          const passwordMatch = user.password === password;
          const userTypeMatch = user.userType && user.userType.toLowerCase() === selectedUserType;
          return emailMatch && passwordMatch && userTypeMatch;
        });

        if (matchedUser) {
            // For individual registration, use student name as the username
            let displayName = matchedUser.email;
            
            // If this is an individual student registration and has studentName
            if (selectedUserType.toLowerCase() === "student" && matchedUser.studentName) {
                displayName = matchedUser.studentName;
            }
            
            // Store user info for session
            localStorage.setItem("loggedInUser", JSON.stringify({
              username: displayName,
              userType: matchedUser.userType
            }));
            window.location.reload();
        } else {
            alert("Invalid email, password, or user type. Please try again.");
        }
    });
  }

  // Function for logout
  const handleLogout = function() {
    localStorage.removeItem("loggedInUser"); // Remove the logged-in user
    window.location.reload(); // Reload the page to show the login form
  };

  // Add event listener to main logout button
  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }
  
  // Add event listener to dropdown logout button
  const dropdownLogoutBtn = document.getElementById("dropdown-logout-btn");
  if (dropdownLogoutBtn) {
    dropdownLogoutBtn.addEventListener("click", handleLogout);
  }
});

// Function to open the forgot password modal
function openModal() {
  document.getElementById('forgot-password-modal').style.display = 'flex';
}

// Function to close the forgot password modal
function closeModal() {
  document.getElementById('forgot-password-modal').style.display = 'none';
}

// Function to send the reset link
function sendResetLink() {
  const email = document.getElementById('reset-email').value;

  if (!email) {
      alert("Please enter your registered email.");
      return;
  }

  // Send the email to the backend
  fetch('/send-reset-link', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email }),
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          alert("A password reset link has been sent to your email.");
          closeModal();
      } else {
          alert("Failed to send reset link. Please try again.");
      }
  })
  .catch(error => {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
  });
}

// Function to handle sign out from dropdown menu
// function signOut(event) {
//   event.preventDefault(); // Prevent the default link behavior
//   localStorage.removeItem("loggedInUser"); // Remove the logged-in user
//   window.location.href = "/"; // Redirect to home page
// }

// Function to handle userType selection (Teacher, Parent, Student)
document.addEventListener("DOMContentLoaded", function() {
  // Get all userType dropdown items
  const userTypeItems = document.querySelectorAll(".dropdown-menu[aria-labelledby='languageDropdown'] .dropdown-item:not(.reset-user-type)");
  // Get the dropdown button
  const userTypeBtn = document.getElementById("languageDropdown");
  // Get the reset button
  const resetBtn = document.querySelector(".reset-user-type");
  
  // Store the original text and HTML
  const originalText = "Who Am I?";
  const originalHTML = '<i class="fas fa-user-circle me-1"></i> Who Am I?';
  
  // Add click event to each item
  userTypeItems.forEach(item => {
    item.addEventListener("click", function(e) {
      e.preventDefault();
      
      // Get the user type from the clicked item
      const userType = this.textContent.trim();
      // Get the icon from the clicked item
      const icon = this.querySelector('i').cloneNode(true);
      
      // Save the current width of the button to maintain it constant
      const currentWidth = userTypeBtn.offsetWidth;
      
      // Replace the button text and icon
      userTypeBtn.innerHTML = '';
      userTypeBtn.appendChild(icon);
      userTypeBtn.innerHTML += ' ' + userType;
      
      // Ensure the button keeps its original width
      userTypeBtn.style.width = currentWidth + 'px';
      
      // Save selection to localStorage
      localStorage.setItem('selectedUserType', userType);
      localStorage.setItem('selectedUserTypeIcon', icon.outerHTML);
    });
  });
  
  // Add click event to reset button
  if (resetBtn) {
    resetBtn.addEventListener("click", function(e) {
      e.preventDefault();
      
      // Save the current width of the button to maintain it constant
      const currentWidth = userTypeBtn.offsetWidth;
      
      // Reset to original state
      userTypeBtn.innerHTML = originalHTML;
      
      // Ensure the button keeps its original width
      userTypeBtn.style.width = currentWidth + 'px';
      
      // Clear selection from localStorage
      localStorage.removeItem('selectedUserType');
      localStorage.removeItem('selectedUserTypeIcon');
    });
  }
  
  // Check if there's a saved user type when page loads
  const savedUserType = localStorage.getItem('selectedUserType');
  const savedUserTypeIcon = localStorage.getItem('selectedUserTypeIcon');
  
  // If no user type is saved, keep "Who Am I?" as default
  if (!savedUserType || !savedUserTypeIcon) {
    userTypeBtn.innerHTML = originalHTML;
  } else {
    // Get the current width to maintain it
    const currentWidth = userTypeBtn.offsetWidth;
    
    // Set the saved user type and icon
    userTypeBtn.innerHTML = savedUserTypeIcon + ' ' + savedUserType;
    
    // Ensure the button keeps its original width
    userTypeBtn.style.width = currentWidth + 'px';
  }
});

function createGradeCards() {
  const gradeCardsContainer = document.getElementById("gradeCardsContainer");
  if (!gradeCardsContainer) return;

  // Clear existing content
  gradeCardsContainer.innerHTML = "";

  // Create grade cards based on the gradeData
  Object.keys(gradeData).forEach(gradeKey => {
    const grade = gradeData[gradeKey][0]; // Get the first subject for the grade name
    gradeCardsContainer.innerHTML += `
      <div class="grade-card" onclick="window.location.href='/src/Home/index.html?grade=${grade.id}'">
        <div class="grade-card-content">
          <h3>${grade.name}</h3>
        </div>
      </div>
    `;
  });
}

// Call the function to create grade cards on page load
document.addEventListener("DOMContentLoaded", function() {
  createGradeCards();
});
