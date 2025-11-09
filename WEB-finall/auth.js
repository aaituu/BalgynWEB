// ============================
// AUTHENTICATION & PROFILE MANAGEMENT - FIXED VERSION

// UTILITY FUNCTIONS

// Function to get user initials from name
function getInitials(name) {
  const names = name.trim().split(" ");
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// Function to format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

// Function to format time
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ============================
// VALIDATION FUNCTIONS

// Email validation
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Password validation
function validatePassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}

// Phone validation (Kazakhstan format)
function validatePhone(phone) {
  if (!phone) return true; // Optional field
  const regex = /^\+?7\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
  return regex.test(phone);
}

// ============================
// CHECK LOGIN STATUS & UPDATE NAV

document.addEventListener("DOMContentLoaded", function () {
  updateNavigationLinks();
});

function updateNavigationLinks() {
  // Check if user is logged in
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") ||
      sessionStorage.getItem("currentUser") ||
      "null"
  );

  // Get navbar
  const navbar = document.querySelector(".navbar-nav");
  if (!navbar) return;

  // Remove existing auth links
  const existingAuthLinks = navbar.querySelectorAll(".auth-nav-item");
  existingAuthLinks.forEach((link) => link.remove());

  // Remove existing cart link
  const existingCartLink = navbar.querySelector(".cart-nav-item");
  if (existingCartLink) existingCartLink.remove();

  if (currentUser) {
    // User is logged in - show Cart, Profile and Logout
    const cartLink = document.createElement("li");
    cartLink.className = "nav-item cart-nav-item";
    cartLink.innerHTML = `
            <a class="nav-link" href="cart.html">
                🛒 Cart (<span id="cartCount">0</span>)
            </a>
        `;

    const profileLink = document.createElement("li");
    profileLink.className = "nav-item auth-nav-item";
    profileLink.innerHTML = `
            <a class="nav-link" href="profile.html">
                👤 Profile
            </a>
        `;

    const logoutLink = document.createElement("li");
    logoutLink.className = "nav-item auth-nav-item";
    logoutLink.innerHTML = `
            <button id="navLogoutBtn" class="btn btn-sm btn-outline-danger ms-2 mt-2 mt-lg-0">
                Logout
            </button>
        `;

    navbar.appendChild(cartLink);
    navbar.appendChild(profileLink);
    navbar.appendChild(logoutLink);

    // Update cart count if function exists
    if (typeof updateCartCount === "function") {
      updateCartCount();
    }

    // Add logout handler
    document
      .getElementById("navLogoutBtn")
      ?.addEventListener("click", function () {
        if (confirm("Are you sure you want to logout?")) {
          localStorage.removeItem("currentUser");
          sessionStorage.removeItem("currentUser");
          window.location.href = "index.html";
        }
      });
  } else {
    // User is NOT logged in - show Sign Up and Log In
    const signupLink = document.createElement("li");
    signupLink.className = "nav-item auth-nav-item";
    signupLink.innerHTML = `
            <a class="nav-link" href="signup.html">Sign Up</a>
        `;

    const loginLink = document.createElement("li");
    loginLink.className = "nav-item auth-nav-item";
    loginLink.innerHTML = `
            <a class="nav-link" href="login.html">Log In</a>
        `;

    navbar.appendChild(signupLink);
    navbar.appendChild(loginLink);
  }
}

// ============================
// SIGN UP FORM HANDLER

document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.getElementById("signupForm");

  if (signupForm) {
    // Toggle password visibility
    const togglePassword = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    togglePassword?.addEventListener("click", function () {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      this.textContent = type === "password" ? "👁️" : "🙈";
    });

    // Form submission
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Clear previous errors
      clearFormErrors(signupForm);

      let isValid = true;

      // Get form values
      const fullName = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const phone = document.getElementById("phone").value.trim();
      const termsAccepted = document.getElementById("terms").checked;

      // Validate Full Name
      if (fullName.length < 2) {
        showFieldError("fullName", "Name must be at least 2 characters long");
        isValid = false;
      }

      // Validate Email
      if (!validateEmail(email)) {
        showFieldError("email", "Please enter a valid email address");
        isValid = false;
      } else {
        // Check if email already exists
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        if (users.some((user) => user.email === email)) {
          showFieldError("email", "This email is already registered");
          isValid = false;
        }
      }

      // Validate Password
      if (!validatePassword(password)) {
        showFieldError(
          "password",
          "Password must be at least 8 characters with uppercase, lowercase, and number"
        );
        isValid = false;
      }

      // Validate Confirm Password
      if (password !== confirmPassword) {
        showFieldError("confirmPassword", "Passwords do not match");
        isValid = false;
      }

      // Validate Phone (optional)
      if (phone && !validatePhone(phone)) {
        showFieldError("phone", "Please enter a valid phone number");
        isValid = false;
      }

      // Validate Terms
      if (!termsAccepted) {
        showFieldError("terms", "You must accept the terms and conditions");
        isValid = false;
      }

      // If valid, save user data
      if (isValid) {
        // Show loading state
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector(".btn-text");
        const spinner = submitBtn.querySelector(".spinner-border");

        btnText.classList.add("d-none");
        spinner.classList.remove("d-none");
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
          // Create user object
          const user = {
            id: Date.now(),
            fullName: fullName,
            email: email,
            password: password, // In real app, this would be hashed
            phone: phone,
            createdAt: new Date().toISOString(),
            visits: 0,
            feedback: [],
          };

          // Save to localStorage
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          users.push(user);
          localStorage.setItem("users", JSON.stringify(users));

          // Show success message
          document.getElementById("successMessage").classList.remove("d-none");
          signupForm.reset();

          // Redirect to login after 2 seconds
          setTimeout(() => {
            window.location.href = "login.html";
          }, 2000);
        }, 1500);
      }
    });
  }
});

// ============================
// LOGIN FORM HANDLER

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    // Toggle password visibility
    const togglePassword = document.getElementById("toggleLoginPassword");
    const passwordInput = document.getElementById("loginPassword");

    togglePassword?.addEventListener("click", function () {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      this.textContent = type === "password" ? "👁️" : "🙈";
    });

    // Form submission
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Clear previous errors
      clearFormErrors(loginForm);
      document.getElementById("errorMessage").classList.add("d-none");

      let isValid = true;

      // Get form values
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value;
      const rememberMe = document.getElementById("rememberMe").checked;

      // Validate Email
      if (!validateEmail(email)) {
        showFieldError("loginEmail", "Please enter a valid email address");
        isValid = false;
      }

      // Validate Password
      if (password.length < 1) {
        showFieldError("loginPassword", "Please enter your password");
        isValid = false;
      }

      // If valid, check credentials
      if (isValid) {
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector(".btn-text");
        const spinner = submitBtn.querySelector(".spinner-border");

        btnText.classList.add("d-none");
        spinner.classList.remove("d-none");
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
          // Get users from localStorage
          const users = JSON.parse(localStorage.getItem("users") || "[]");
          const user = users.find(
            (u) => u.email === email && u.password === password
          );

          if (user) {
            // Update visit count
            user.visits = (user.visits || 0) + 1;
            const userIndex = users.findIndex((u) => u.id === user.id);
            users[userIndex] = user;
            localStorage.setItem("users", JSON.stringify(users));

            // Set current user session
            const sessionData = {
              userId: user.id,
              email: user.email,
              fullName: user.fullName,
              loginTime: new Date().toISOString(),
            };

            // ВСЕГДА сохраняем в localStorage для постоянной сессии
            localStorage.setItem("currentUser", JSON.stringify(sessionData));

            // Redirect to profile
            window.location.href = "profile.html";
          } else {
            // Show error
            btnText.classList.remove("d-none");
            spinner.classList.add("d-none");
            submitBtn.disabled = false;

            const errorMsg = document.getElementById("errorMessage");
            document.getElementById("errorText").textContent =
              "Invalid email or password";
            errorMsg.classList.remove("d-none");
          }
        }, 1500);
      }
    });
  }
});

// ============================
// PROFILE PAGE HANDLER

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.pathname.includes("profile.html")) {
    // Check if user is logged in
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") ||
        sessionStorage.getItem("currentUser") ||
        "null"
    );

    if (!currentUser) {
      // Redirect to login if not authenticated
      alert("Please log in to view your profile");
      window.location.href = "login.html";
      return;
    }

    // Load user data
    loadProfileData(currentUser.userId);

    // Logout button
    document
      .getElementById("logoutBtn")
      ?.addEventListener("click", function () {
        if (confirm("Are you sure you want to logout?")) {
          localStorage.removeItem("currentUser");
          sessionStorage.removeItem("currentUser");
          window.location.href = "index.html";
        }
      });

    // Edit profile
    document
      .getElementById("saveProfileBtn")
      ?.addEventListener("click", function () {
        saveProfileChanges(currentUser.userId);
      });

    // Clear history
    document
      .getElementById("clearHistoryBtn")
      ?.addEventListener("click", function () {
        if (
          confirm(
            "Are you sure you want to delete all feedback history? This action cannot be undone."
          )
        ) {
          clearFeedbackHistory(currentUser.userId);
        }
      });

    // Search functionality
    document
      .getElementById("searchFeedback")
      ?.addEventListener("input", function () {
        filterFeedback(currentUser.userId);
      });

    // Filter by subject
    document
      .getElementById("filterSubject")
      ?.addEventListener("change", function () {
        filterFeedback(currentUser.userId);
      });
  }
});

// Function to load profile data
function loadProfileData(userId) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.id === userId);

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Update profile info
  document.getElementById("profileName").textContent = user.fullName;
  document.getElementById("profileEmail").textContent = user.email;
  document.getElementById("profilePhone").textContent =
    user.phone || "No phone number";
  document.getElementById("avatarInitials").textContent = getInitials(
    user.fullName
  );
  document.getElementById(
    "memberSince"
  ).textContent = `Member since ${formatDate(user.createdAt)}`;
  document.getElementById("feedbackCount").textContent =
    user.feedback?.length || 0;
  document.getElementById("visitCount").textContent = user.visits || 0;

  // Load feedback history
  displayFeedbackHistory(user.feedback || []);

  // Fill edit form
  document.getElementById("editName").value = user.fullName;
  document.getElementById("editPhone").value = user.phone || "";
}

// Function to display feedback history
function displayFeedbackHistory(feedbacks) {
  const feedbackList = document.getElementById("feedbackList");
  const noFeedback = document.getElementById("noFeedback");

  if (feedbacks.length === 0) {
    noFeedback.classList.remove("d-none");
    feedbackList.innerHTML = "";
    feedbackList.appendChild(noFeedback);
    return;
  }

  noFeedback.classList.add("d-none");
  feedbackList.innerHTML = "";

  // Sort by date (newest first)
  feedbacks.sort((a, b) => new Date(b.date) - new Date(a.date));

  feedbacks.forEach((feedback, index) => {
    const feedbackCard = document.createElement("div");
    feedbackCard.className = "feedback-item mb-3";
    feedbackCard.innerHTML = `
            <div class="card border-start border-primary border-4">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <div>
                            <h5 class="card-title mb-1">${
                              feedback.subject || "General Inquiry"
                            }</h5>
                            <p class="text-muted small mb-0">
                                📅 ${formatDate(feedback.date)} at ${formatTime(
      feedback.date
    )}
                            </p>
                        </div>
                        <span class="badge bg-success">Sent</span>
                    </div>
                    <p class="card-text mt-2">${feedback.message}</p>
                    <div class="mt-2">
                        <small class="text-muted">
                            <strong>From:</strong> ${feedback.name}
                        </small>
                    </div>
                </div>
            </div>
        `;
    feedbackList.appendChild(feedbackCard);
  });
}

// Function to filter feedback
function filterFeedback(userId) {
  const searchTerm = document
    .getElementById("searchFeedback")
    .value.toLowerCase();
  const subjectFilter = document.getElementById("filterSubject").value;

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.id === userId);

  if (!user || !user.feedback) return;

  let filteredFeedback = user.feedback;

  // Filter by subject
  if (subjectFilter) {
    filteredFeedback = filteredFeedback.filter(
      (f) => f.subject === subjectFilter
    );
  }

  // Filter by search term
  if (searchTerm) {
    filteredFeedback = filteredFeedback.filter(
      (f) =>
        f.message.toLowerCase().includes(searchTerm) ||
        (f.subject && f.subject.toLowerCase().includes(searchTerm)) ||
        (f.name && f.name.toLowerCase().includes(searchTerm))
    );
  }

  displayFeedbackHistory(filteredFeedback);
}

// Function to save profile changes
function saveProfileChanges(userId) {
  const newName = document.getElementById("editName").value.trim();
  const newPhone = document.getElementById("editPhone").value.trim();

  if (newName.length < 2) {
    alert("Name must be at least 2 characters long");
    return;
  }

  if (newPhone && !validatePhone(newPhone)) {
    alert("Please enter a valid phone number");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex !== -1) {
    users[userIndex].fullName = newName;
    users[userIndex].phone = newPhone;
    localStorage.setItem("users", JSON.stringify(users));

    // Update session
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    currentUser.fullName = newName;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    // Reload profile
    loadProfileData(userId);

    // Close modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("editProfileModal")
    );
    modal.hide();

    // Show success message
    alert("Profile updated successfully!");
  }
}

// Function to clear feedback history
function clearFeedbackHistory(userId) {
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex !== -1) {
    users[userIndex].feedback = [];
    localStorage.setItem("users", JSON.stringify(users));

    // Reload profile
    loadProfileData(userId);

    alert("Feedback history cleared successfully!");
  }
}

// ============================
// HELPER FUNCTIONS

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const feedback = field
    .closest(".mb-3, .mb-4")
    ?.querySelector(".invalid-feedback");

  field.classList.add("is-invalid");
  if (feedback) {
    feedback.textContent = message;
    feedback.style.display = "block";
  }
}

function clearFormErrors(form) {
  form.querySelectorAll(".is-invalid").forEach((field) => {
    field.classList.remove("is-invalid");
  });
  form.querySelectorAll(".invalid-feedback").forEach((feedback) => {
    feedback.style.display = "none";
  });
}
