// ============================
// Assignment #6: Advanced JavaScript and DOM Manipulation
// Team: Balgyn & Ayana
// Group: SE-2404
// ============================

// ============================
// PART 1: ADVANCED JS
// ============================

// ============================
// 1. DOM MANIPULATION AND STYLING
// ============================

// --------------------------------------------------
// RATING STARS SYSTEM (for menu.html)
// Implemented by: Balgyn
// Using querySelectorAll to select all "Order Now" buttons
// Allows users to click on a star to set their rating
// --------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    
    const orderButtons = document.querySelectorAll('.btn-outline-primary');
    
    orderButtons.forEach((button, index) => {
        // Create a container for stars under each button
        const starsContainer = document.createElement('div');
        starsContainer.className = 'rating-stars mt-2';
        starsContainer.innerHTML = `
            <span class="star" data-rating="1">⭐</span>
            <span class="star" data-rating="2">⭐</span>
            <span class="star" data-rating="3">⭐</span>
            <span class="star" data-rating="4">⭐</span>
            <span class="star" data-rating="5">⭐</span>
        `;
        
        // Insert stars after the button
        button.parentElement.insertBefore(starsContainer, button.nextSibling);
        
        // Click handler for stars
        const stars = starsContainer.querySelectorAll('.star');
        stars.forEach(star => {
            star.style.cursor = 'pointer';
            star.style.opacity = '0.3';
            star.style.transition = 'all 0.3s ease';
            
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                
                // Change color of selected stars
                stars.forEach((s, i) => {
                    if (i < rating) {
                        s.style.opacity = '1';
                        s.style.transform = 'scale(1.2)';
                    } else {
                        s.style.opacity = '0.3';
                        s.style.transform = 'scale(1)';
                    }
                });
                
                // Update text message
                updateRatingMessage(rating);
            });
            
            // Hover effect
            star.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.3)';
            });
            
            star.addEventListener('mouseleave', function() {
                if (this.style.opacity !== '1') {
                    this.style.transform = 'scale(1)';
                }
            });
        });
    });
    
    function updateRatingMessage(rating) {
        const messageElement = document.querySelector('#ratingMessage') || createRatingMessage();
        messageElement.textContent = `You rated this ${rating} stars! Thank you for your feedback.`;
        messageElement.style.display = 'block';
        
        // Hide message after 3 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    }
    
    function createRatingMessage() {
        const message = document.createElement('div');
        message.id = 'ratingMessage';
        message.className = 'alert alert-success mt-3';
        message.style.display = 'none';
        document.querySelector('.container.my-5')?.appendChild(message);
        return message;
    }
});

// --------------------------------------------------
// Dynamic Style Changes - DAY/NIGHT THEME TOGGLE
// Implemented by: Ayana
// Improved dark theme with dynamic style manipulation
// Modifies CSS properties like backgroundColor, color using JavaScript
// --------------------------------------------------
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
            // Dynamically change styles through JavaScript
            body.style.backgroundColor = '#121212';
            body.style.color = '#f0f0f0';
            buttons.forEach(btn => {
                btn.textContent = '☀️ Light Mode';
                btn.style.backgroundColor = '#ffc107';
                btn.style.color = '#000';
            });
            localStorage.setItem('colorMode', 'dark'); 
        } else {
            body.classList.remove('dark-mode');
            body.style.backgroundColor = '#fefffb';
            body.style.color = '#333';
            buttons.forEach(btn => {
                btn.textContent = '🌙 Dark Mode';
                btn.style.backgroundColor = '';
                btn.style.color = '';
            });
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
            updateMode(!isDark);
        });
    });
});

// --------------------------------------------------
// READ MORE BUTTON (Manipulating Attributes)
// Implemented by: Balgyn
// Toggles visibility of additional content by changing style.display
// --------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Add "Read More" functionality to cards on the main page
    const cardTexts = document.querySelectorAll('.card-text');
    
    cardTexts.forEach(text => {
        if (text.textContent.length > 100) {
            const fullText = text.textContent;
            const shortText = fullText.substring(0, 100) + '...';
            
            text.textContent = shortText;
            
            const readMoreBtn = document.createElement('button');
            readMoreBtn.className = 'btn btn-sm btn-link p-0 mt-1';
            readMoreBtn.textContent = 'Read More';
            readMoreBtn.style.fontSize = '0.9rem';
            
            text.parentElement.appendChild(readMoreBtn);
            
            let isExpanded = false;
            
            readMoreBtn.addEventListener('click', function() {
                if (isExpanded) {
                    text.textContent = shortText;
                    readMoreBtn.textContent = 'Read More';
                    text.style.display = 'block';
                } else {
                    text.textContent = fullText;
                    readMoreBtn.textContent = 'Show Less';
                    text.style.display = 'block';
                }
                isExpanded = !isExpanded;
            });
        }
    });
});

// ============================
// 2. EVENT HANDLING
// ============================

// --------------------------------------------------
// Event Listeners on Buttons - CURRENT TIME DISPLAY
// Implemented by: Ayana
// Displays current time in a designated area when button is clicked
// Uses new Date().toLocaleTimeString() to get current time
// --------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const dateTimeDisplay = document.getElementById('dateTimeDisplay');
    
    if (dateTimeDisplay) {
        // Create button to show current time
        const showTimeBtn = document.createElement('button');
        showTimeBtn.className = 'btn btn-warning btn-sm mt-2';
        showTimeBtn.textContent = '🕐 Show Current Time';
        showTimeBtn.id = 'showTimeBtn';
        
        dateTimeDisplay.parentElement.appendChild(showTimeBtn);
        
        showTimeBtn.addEventListener('click', function() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            
            // Create temporary notification
            const timeAlert = document.createElement('div');
            timeAlert.className = 'alert alert-info mt-2';
            timeAlert.innerHTML = `<strong>Current Time:</strong> ${timeString}`;
            
            showTimeBtn.parentElement.appendChild(timeAlert);
            
            setTimeout(() => {
                timeAlert.remove();
            }, 3000);
        });
        
        // Update existing dateTimeDisplay
        updateDateTime();
        setInterval(updateDateTime, 1000);
    }
});

function updateDateTime() {
    const dateTimeDisplay = document.getElementById('dateTimeDisplay');
    if (!dateTimeDisplay) return;
    
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    const dateStr = now.toLocaleDateString('en-US', options);
    
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeStr = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    
    dateTimeDisplay.innerHTML = `
        <div class="date-display">
            <i class="bi bi-calendar3"></i> ${dateStr}
        </div>
        <div class="time-display">
            <i class="bi bi-clock"></i> ${timeStr}
        </div>
    `;
}

// --------------------------------------------------
// Keyboard Event Handling - NAVIGATION MENU
// Implemented by: Balgyn
// Uses keydown event to detect key presses
// Arrow keys to move between menu items
// --------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    let currentIndex = -1;
    
    document.addEventListener('keydown', function(event) {
        // Use left/right arrow keys for navigation
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            currentIndex = (currentIndex + 1) % navLinks.length;
            navLinks[currentIndex].focus();
            
            // Add visual effect
            navLinks[currentIndex].style.transform = 'scale(1.1)';
            setTimeout(() => {
                navLinks[currentIndex].style.transform = '';
            }, 300);
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            currentIndex = currentIndex <= 0 ? navLinks.length - 1 : currentIndex - 1;
            navLinks[currentIndex].focus();
            
            navLinks[currentIndex].style.transform = 'scale(1.1)';
            setTimeout(() => {
                navLinks[currentIndex].style.transform = '';
            }, 300);
        } else if (event.key === 'Enter' && currentIndex >= 0) {
            navLinks[currentIndex].click();
        }
    });
});

// --------------------------------------------------
// Responding to Events with Callbacks - CONTACT FORM
// Implemented by: Ayana
// Submits form data asynchronously and displays success message
// Uses callback function to handle user interactions
// --------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
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
            
            // Callback function for successful submission
            if (isValid) {
                submitFormWithCallback(function(success) {
                    if (success) {
                        showSuccessMessage();
                        contactForm.reset();
                        playSuccessSound();
                    }
                });
            }
        });
    }
});

function submitFormWithCallback(callback) {
    // Simulate asynchronous form submission
    setTimeout(() => {
        callback(true);
    }, 500);
}

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

// --------------------------------------------------
// Switch Statements - GREETING BASED ON TIME OF DAY
// Implemented by: Balgyn
// Displays different greeting based on time (morning, afternoon, evening)
// --------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.carousel-caption h1');
    
    if (hero) {
        const hour = new Date().getHours();
        let greeting;
        
        switch (true) {
            case (hour >= 5 && hour < 12):
                greeting = '☀️ Good Morning!';
                break;
            case (hour >= 12 && hour < 17):
                greeting = '🌤️ Good Afternoon!';
                break;
            case (hour >= 17 && hour < 22):
                greeting = '🌆 Good Evening!';
                break;
            default:
                greeting = '🌙 Good Night!';
        }
        
        // Create greeting element
        const greetingElement = document.createElement('p');
        greetingElement.className = 'lead mt-2';
        greetingElement.textContent = greeting;
        greetingElement.style.fontSize = '1.5rem';
        greetingElement.style.fontWeight = 'bold';
        
        hero.parentElement.insertBefore(greetingElement, hero.nextSibling);
    }
});

// ============================
// 3. JAVASCRIPT ADVANCED CONCEPTS
// ============================

// --------------------------------------------------
// Objects and Methods
// Implemented by: Ayana
// JavaScript objects with methods to structure data
// Display and manipulate object properties on the page
// --------------------------------------------------
const CoffeeShop = {
    name: 'Coffee PO',
    location: 'Astana, Kazakhstan',
    menu: [
        { name: 'Latte', price: 2500, category: 'hot' },
        { name: 'Cappuccino', price: 2300, category: 'hot' },
        { name: 'Americano', price: 1800, category: 'hot' },
        { name: 'Mocha', price: 2800, category: 'hot' },
        { name: 'Espresso', price: 1500, category: 'hot' }
    ],
    
    getMenuByCategory: function(category) {
        return this.menu.filter(item => item.category === category);
    },
    
    getMostExpensive: function() {
        return this.menu.reduce((max, item) => 
            item.price > max.price ? item : max
        );
    },
    
    calculateTotal: function(items) {
        return items.reduce((sum, item) => sum + item.price, 0);
    },
    
    displayInfo: function() {
        return `Welcome to ${this.name} in ${this.location}!`;
    }
};

// Display coffee shop information on home page
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.carousel-caption');
    if (hero && window.location.pathname.includes('index.html')) {
        const infoText = document.createElement('p');
        infoText.className = 'lead mt-3';
        infoText.textContent = CoffeeShop.displayInfo();
        hero.appendChild(infoText);
    }
});

// --------------------------------------------------
// Arrays and Loops
// Implemented by: Balgyn
// Uses arrays to manage collections of items
// Uses loops (for) to iterate over elements and display dynamically
// --------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const menuContainer = document.querySelector('.container.my-5');
    
    if (menuContainer && window.location.pathname.includes('menu.html')) {
        // Create section with popular drinks
        const popularSection = document.createElement('div');
        popularSection.className = 'row mt-5';
        popularSection.innerHTML = '<h3 class="col-12 text-center mb-4">☕ Popular Drinks</h3>';
        
        const popularDrinks = CoffeeShop.menu.slice(0, 3);
        
        for (let i = 0; i < popularDrinks.length; i++) {
            const drink = popularDrinks[i];
            const col = document.createElement('div');
            col.className = 'col-md-4';
            col.innerHTML = `
                <div class="card text-center shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${drink.name}</h5>
                        <p class="card-text text-muted">${drink.price} ₸</p>
                        <span class="badge bg-success">Popular</span>
                    </div>
                </div>
            `;
            popularSection.appendChild(col);
        }
        
        menuContainer.appendChild(popularSection);
    }
});

// --------------------------------------------------
// Higher-Order Functions
// Implemented by: Ayana
// Uses map, filter, forEach - functions that take other functions as arguments
// --------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Use map to create list of prices
    const prices = CoffeeShop.menu.map(item => item.price);
    
    // Use filter to filter affordable drinks
    const affordableDrinks = CoffeeShop.menu.filter(item => item.price < 2500);
    
    // Use forEach to add event listeners
    const orderButtons = document.querySelectorAll('.btn-outline-primary');
    orderButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const drinkName = this.closest('.card-body').querySelector('.card-title').textContent;
            showOrderConfirmation(drinkName);
            playSuccessSound();
        });
    });
    
    console.log('All prices:', prices);
    console.log('Affordable drinks:', affordableDrinks);
});

function showOrderConfirmation(drinkName) {
    const confirmation = document.createElement('div');
    confirmation.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
    confirmation.style.zIndex = '9999';
    confirmation.innerHTML = `<strong>Order placed!</strong> ${drinkName} will be ready soon! ☕`;
    
    document.body.appendChild(confirmation);
    
    setTimeout(() => {
        confirmation.remove();
    }, 3000);
}

// --------------------------------------------------
// Play Sounds
// Implemented by: Balgyn
// Uses JavaScript to trigger sound effects
// Button that plays notification sound when clicked
// --------------------------------------------------
function playSuccessSound() {
    // Create audio context for notification sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Add sound for theme toggle button
document.addEventListener('DOMContentLoaded', function() {
    const themeButtons = document.querySelectorAll('#colorChangeBtn, #colorChangeBtn-desktop');
    
    themeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            playThemeSound();
        });
    });
});

function playThemeSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 600;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// --------------------------------------------------
// Animations
// Implemented by: Ayana
// Adds animations to elements using style.transform
// Triggered by events (hover, scroll, click)
// --------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Animation for cards on hover
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            this.style.transition = 'all 0.4s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animation for elements appearing on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all cards
    cards.forEach(card => observer.observe(card));
});

// Pulse animation for buttons
document.addEventListener('DOMContentLoaded', function() {
    const primaryButtons = document.querySelectorAll('.btn-primary, .btn-warning');
    
    primaryButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.animation = 'pulse 0.5s ease';
            
            setTimeout(() => {
                this.style.animation = '';
            }, 500);
        });
    });
    
    // Add CSS animation through JavaScript
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});

// ============================
// ASSIGNMENT 5 FEATURES (Preserved from previous assignment)
// ============================

// --------------------------------------------------
// TASK 2: Accordion for FAQs
// Implemented by: Ayana (Assignment 5)
// --------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion-item-custom');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header-custom');
        const content = item.querySelector('.accordion-content-custom');
        
        if (header && content) {
            header.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                accordionItems.forEach(i => {
                    i.classList.remove('active');
                    const c = i.querySelector('.accordion-content-custom');
                    if (c) {
                        c.style.maxHeight = null;
                    }
                });
                
                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });
});

// --------------------------------------------------
// TASK 3: Popup Subscription Form
// Implemented by: Balgyn (Assignment 5)
// --------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const subscribeBtn = document.getElementById('subscribeBtn');
    const popup = document.getElementById('subscriptionPopup');
    const closePopup = document.getElementById('closePopup');
    const popupOverlay = document.getElementById('popupOverlay');
    const subscribeForm = document.getElementById('subscribeForm');
    
    if (subscribeBtn && popup) {
        subscribeBtn.addEventListener('click', function() {
            popup.style.display = 'block';
            popupOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
            playSuccessSound();
        });
    }
    
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
    
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('popupEmail').value;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailPattern.test(email)) {
                alert('Thank you for subscribing! We will send updates to ' + email);
                subscribeForm.reset();
                closeSubscriptionPopup();
                playSuccessSound();
            } else {
                alert('Please enter a valid email address');
            }
        });
    }
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && popup && popup.style.display === 'block') {
            closeSubscriptionPopup();
        }
    });
});