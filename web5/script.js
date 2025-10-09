
// ============================
// Assignment #5: JavaScript Features
// Team: Balgyn & Ayana
// Group: SE-2404
// ============================

// ============================
// TASK 1: Form Validation
// Implemented by: Balgyn
// ============================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Clear previous error messages
            clearErrors();
            
            let isValid = true;
            
            // Validate Name
            const name = document.getElementById('name');
            if (name.value.trim() === '') {
                showError('name', 'Name is required');
                isValid = false;
            } else if (name.value.trim().length < 2) {
                showError('name', 'Name must be at least 2 characters');
                isValid = false;
            }
            
            // Validate Email
            const email = document.getElementById('email');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() === '') {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!emailPattern.test(email.value)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate Message
            const message = document.getElementById('message');
            if (message.value.trim() === '') {
                showError('message', 'Message is required');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                showError('message', 'Message must be at least 10 characters');
                isValid = false;
            }
            
            // If form is valid, show success message
            if (isValid) {
                showSuccessMessage();
                contactForm.reset();
            }
        });
    }
});

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-danger mt-1';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
    field.classList.add('is-invalid');
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    const invalidFields = document.querySelectorAll('.is-invalid');
    invalidFields.forEach(field => field.classList.remove('is-invalid'));
}

function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success alert-dismissible fade show mt-3';
    successDiv.innerHTML = `
        <strong>Success!</strong> Your message has been sent successfully.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.getElementById('contactForm').parentElement.insertBefore(
        successDiv, 
        document.getElementById('contactForm')
    );
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// ============================
// TASK 2: Accordion for FAQs
// Implemented by: Ayana
// ============================

document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion-item-custom');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header-custom');
        const content = item.querySelector('.accordion-content-custom');
        
        if (header && content) {
            header.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all accordion items
                accordionItems.forEach(i => {
                    i.classList.remove('active');
                    const c = i.querySelector('.accordion-content-custom');
                    if (c) {
                        c.style.maxHeight = null;
                    }
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });
});

// ============================
// TASK 3: Popup Subscription Form
// Implemented by: Balgyn
// ============================

document.addEventListener('DOMContentLoaded', function() {
    const subscribeBtn = document.getElementById('subscribeBtn');
    const popup = document.getElementById('subscriptionPopup');
    const closePopup = document.getElementById('closePopup');
    const popupOverlay = document.getElementById('popupOverlay');
    const subscribeForm = document.getElementById('subscribeForm');
    
    // Open popup
    if (subscribeBtn && popup) {
        subscribeBtn.addEventListener('click', function() {
            popup.style.display = 'block';
            popupOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close popup
    function closeSubscriptionPopup() {
        if (popup && popupOverlay) {
            popup.style.display = 'none';
            popupOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    if (closePopup) {
        closePopup.addEventListener('click', closeSubscriptionPopup);
    }
    
    if (popupOverlay) {
        popupOverlay.addEventListener('click', closeSubscriptionPopup);
    }
    
    // Handle subscription form submit
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('popupEmail').value;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailPattern.test(email)) {
                alert('Thank you for subscribing! We will send updates to ' + email);
                subscribeForm.reset();
                closeSubscriptionPopup();
            } else {
                alert('Please enter a valid email address');
            }
        });
    }
    
    // Close popup on Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && popup && popup.style.display === 'block') {
            closeSubscriptionPopup();
        }
    });
});

// ============================
// TASK 4: Dark/Light Mode Toggle
// ============================

document.addEventListener('DOMContentLoaded', function() {
    const colorChangeBtnMobile = document.getElementById('colorChangeBtn');
    const colorChangeBtnDesktop = document.getElementById('colorChangeBtn-desktop');
    const buttons = [];
    if (colorChangeBtnMobile) buttons.push(colorChangeBtnMobile);
    if (colorChangeBtnDesktop) buttons.push(colorChangeBtnDesktop);

    const body = document.body;

    function updateMode(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
            buttons.forEach(btn => btn.textContent = '☀️ Light Mode');
            localStorage.setItem('colorMode', 'dark'); 
        } else {
            body.classList.remove('dark-mode');
            buttons.forEach(btn => btn.textContent = '🌙 Dark Mode');
            localStorage.setItem('colorMode', 'light');
        }
    }
    
    const savedMode = localStorage.getItem('colorMode');
    if (savedMode === 'dark') {
        updateMode(true);
    } else {
        updateMode(false);
    }
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const isDark = body.classList.contains('dark-mode');
            updateMode(!isDark); // Переключаем на противоположный режим
        });
    });
});

// ============================
// TASK 5: Display Current Date and Time
// Implemented by: Balgyn
// ============================

document.addEventListener('DOMContentLoaded', function() {
    const dateTimeDisplay = document.getElementById('dateTimeDisplay');
    
    if (dateTimeDisplay) {
        updateDateTime();
        // Update every second
        setInterval(updateDateTime, 1000);
    }
});

function updateDateTime() {
    const dateTimeDisplay = document.getElementById('dateTimeDisplay');
    if (!dateTimeDisplay) return;
    
    const now = new Date();
    
    // Format date
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    const dateStr = now.toLocaleDateString('en-US', options);
    
    // Format time
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    const timeStr = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    
    // Update display
    dateTimeDisplay.innerHTML = `
        <div class="date-display">
            <i class="bi bi-calendar3"></i> ${dateStr}
        </div>
        <div class="time-display">
            <i class="bi bi-clock"></i> ${timeStr}
        </div>
    `;
}

