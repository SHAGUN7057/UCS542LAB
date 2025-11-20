// ============================================
// PACKAGES DATA & TABLE RENDERING
// ============================================

// Array of package objects
const packages = [
    {
        id: 1,
        name: "Tropical Paradise",
        destination: "Bali, Indonesia",
        durationDays: 7,
        basePrice: 1299,
        season: "peak"
    },
    {
        id: 2,
        name: "European Romance",
        destination: "Paris, France",
        durationDays: 5,
        basePrice: 1899,
        season: "peak"
    },
    {
        id: 3,
        name: "Cultural Discovery",
        destination: "Tokyo, Japan",
        durationDays: 8,
        basePrice: 2199,
        season: "peak"
    },
    {
        id: 4,
        name: "Greek Island Escape",
        destination: "Santorini, Greece",
        durationDays: 6,
        basePrice: 1599,
        season: "peak"
    },
    {
        id: 5,
        name: "Mountain Adventure",
        destination: "Machu Picchu, Peru",
        durationDays: 10,
        basePrice: 2499,
        season: "peak"
    },
    {
        id: 6,
        name: "Luxury Dubai",
        destination: "Dubai, UAE",
        durationDays: 6,
        basePrice: 1799,
        season: "peak"
    },
    {
        id: 7,
        name: "Nature's Wonder",
        destination: "New Zealand",
        durationDays: 12,
        basePrice: 3299,
        season: "peak"
    },
    {
        id: 8,
        name: "Northern Lights",
        destination: "Iceland",
        durationDays: 7,
        basePrice: 2699,
        season: "peak"
    },
    {
        id: 9,
        name: "African Safari",
        destination: "Serengeti, Tanzania",
        durationDays: 9,
        basePrice: 3599,
        season: "peak"
    },
    {
        id: 10,
        name: "Mediterranean Cruise",
        destination: "Multiple Ports",
        durationDays: 10,
        basePrice: 2899,
        season: "peak"
    }
];

// Function to calculate final price with seasonal multiplier and weekend surcharge
function calculateFinalPrice(basePrice, season, isWeekend = false) {
    let finalPrice = basePrice;
    
    // Seasonal multiplier using switch statement
    switch(season) {
        case "peak":
            finalPrice = basePrice * 1.2; // 20% increase for peak season
            break;
        case "shoulder":
            finalPrice = basePrice * 1.1; // 10% increase for shoulder season
            break;
        case "off":
            finalPrice = basePrice * 0.9; // 10% discount for off season
            break;
        default:
            finalPrice = basePrice; // No change for normal season
    }
    
    // Weekend surcharge using if statement
    if (isWeekend) {
        finalPrice = finalPrice * 1.15; // 15% weekend surcharge
    }
    
    return Math.round(finalPrice);
}

// Function to format price as currency
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(price);
}

// Function to render packages table
function renderPackagesTable() {
    const tableBody = document.querySelector('.packages-table tbody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Check if it's weekend (Saturday = 6, Sunday = 0)
    const today = new Date();
    const dayOfWeek = today.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Loop through packages array to render table rows
    packages.forEach(package => {
        const finalPrice = calculateFinalPrice(package.basePrice, package.season, isWeekend);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${package.name}</td>
            <td>${package.destination}</td>
            <td>${package.durationDays} Days / ${package.durationDays - 1} Nights</td>
            <td>${formatPrice(package.basePrice)}</td>
            <td class="final-price">${formatPrice(finalPrice)}</td>
            <td>${getPackageHighlights(package.id)}</td>
            <td><a href="booking.html" class="btn-small">Book Now</a></td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Helper function to get package highlights
function getPackageHighlights(packageId) {
    const highlights = {
        1: "Beach resorts, temple tours, water sports",
        2: "Eiffel Tower, Louvre Museum, Seine cruise",
        3: "Cherry blossoms, sushi making, bullet train",
        4: "Sunset views, wine tasting, ancient ruins",
        5: "Inca Trail, Sacred Valley, Cusco city tour",
        6: "Burj Khalifa, desert safari, luxury shopping",
        7: "Milford Sound, bungee jumping, Maori culture",
        8: "Aurora viewing, Blue Lagoon, Golden Circle",
        9: "Wildlife viewing, game drives, Maasai culture",
        10: "Multiple countries, luxury cruise, shore excursions"
    };
    return highlights[packageId] || "Amazing experiences";
}

// ============================================
// BOOKING PRICE ESTIMATOR
// ============================================

// Function to calculate estimated total
function calculateEstimatedTotal() {
    const packageSelect = document.getElementById('package');
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');
    const guestsInput = document.getElementById('guests');
    const promoCodeInput = document.getElementById('promoCode');
    const totalDisplay = document.getElementById('estimatedTotal');
    const submitButton = document.querySelector('.booking-form button[type="submit"]');
    
    if (!packageSelect || !checkInInput || !checkOutInput || !guestsInput || !totalDisplay) {
        return;
    }
    
    // Get selected package
    const selectedPackageId = packageSelect.value;
    if (!selectedPackageId) {
        totalDisplay.textContent = '$0.00';
        if (submitButton) submitButton.disabled = true;
        return;
    }
    
    const selectedPackage = packages.find(p => p.id === parseInt(selectedPackageId));
    if (!selectedPackage) {
        totalDisplay.textContent = '$0.00';
        if (submitButton) submitButton.disabled = true;
        return;
    }
    
    // Calculate nights using Date math
    let nights = 0;
    if (checkInInput.value && checkOutInput.value) {
        const checkIn = new Date(checkInInput.value);
        const checkOut = new Date(checkOutInput.value);
        
        if (checkOut > checkIn) {
            const timeDiff = checkOut - checkIn;
            nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        }
    }
    
    // If no dates, use package duration
    if (nights === 0) {
        nights = selectedPackage.durationDays - 1;
    }
    
    // Get number of guests
    const guests = parseInt(guestsInput.value) || 1;
    
    // Base calculation
    let total = selectedPackage.basePrice * guests;
    
    // Guests multiplier (if > 2, add 20%)
    if (guests > 2) {
        total = total * 1.2;
    }
    
    // Apply seasonal multiplier
    total = calculateFinalPrice(total / guests, selectedPackage.season, false) * guests;
    
    // Check if weekend
    if (checkInInput.value) {
        const checkIn = new Date(checkInInput.value);
        const dayOfWeek = checkIn.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        if (isWeekend) {
            total = total * 1.15;
        }
    }
    
    // Promo code discount using switch/case
    const promoCode = promoCodeInput ? promoCodeInput.value.toUpperCase().trim() : '';
    let discount = 0;
    
    switch(promoCode) {
        case 'EARLYBIRD':
            discount = 0.10; // 10% discount
            break;
        case 'SUMMER2024':
            discount = 0.15; // 15% discount
            break;
        case 'WANDERLUST':
            discount = 0.20; // 20% discount
            break;
        case 'TRAVEL10':
            discount = 0.10; // 10% discount
            break;
        default:
            discount = 0;
    }
    
    if (discount > 0) {
        total = total * (1 - discount);
    }
    
    // Display total
    totalDisplay.textContent = formatPrice(total);
    
    // Form validation - disable submit if invalid
    const isValid = validateBookingForm();
    if (submitButton) {
        submitButton.disabled = !isValid;
    }
}

// Function to validate booking form
function validateBookingForm() {
    const requiredFields = [
        document.getElementById('fullName'),
        document.getElementById('email'),
        document.getElementById('phone'),
        document.getElementById('package'),
        document.getElementById('checkIn'),
        document.getElementById('checkOut'),
        document.getElementById('guests')
    ];
    
    for (let field of requiredFields) {
        if (!field || !field.value || field.value.trim() === '') {
            return false;
        }
    }
    
    // Validate email format
    const email = document.getElementById('email');
    if (email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            return false;
        }
    }
    
    // Validate dates
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    if (checkIn && checkOut && checkIn.value && checkOut.value) {
        const checkInDate = new Date(checkIn.value);
        const checkOutDate = new Date(checkOut.value);
        if (checkOutDate <= checkInDate) {
            return false;
        }
    }
    
    // Validate terms checkbox
    const termsCheckbox = document.querySelector('input[name="terms"]');
    if (termsCheckbox && !termsCheckbox.checked) {
        return false;
    }
    
    return true;
}

// ============================================
// GALLERY MODAL FUNCTIONALITY
// ============================================

// Function to initialize gallery modal
function initGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(img => {
        // Set data-large attribute if not already set
        if (!img.hasAttribute('data-large')) {
            img.setAttribute('data-large', img.src);
        }
        
        // Add click event listener
        img.addEventListener('click', function() {
            openGalleryModal(this);
        });
        
        // Add cursor pointer style
        img.style.cursor = 'pointer';
    });
}

// Function to open gallery modal
function openGalleryModal(imgElement) {
    const largeImageUrl = imgElement.getAttribute('data-large');
    const altText = imgElement.getAttribute('alt') || 'Gallery Image';
    const titleText = imgElement.closest('.gallery-item')?.querySelector('h3')?.textContent || altText;
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('galleryModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'galleryModal';
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="gallery-modal-content">
                <span class="gallery-modal-close">&times;</span>
                <img class="gallery-modal-image" src="" alt="" />
                <div class="gallery-modal-caption">
                    <h3></h3>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add close event listeners
        const closeBtn = modal.querySelector('.gallery-modal-close');
        closeBtn.addEventListener('click', closeGalleryModal);
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeGalleryModal();
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeGalleryModal();
            }
        });
    }
    
    // Set image source and attributes
    const modalImage = modal.querySelector('.gallery-modal-image');
    const modalCaption = modal.querySelector('.gallery-modal-caption h3');
    
    modalImage.setAttribute('src', largeImageUrl);
    modalImage.setAttribute('alt', altText);
    modalImage.setAttribute('title', titleText);
    modalCaption.textContent = titleText;
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Function to close gallery modal
function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// ============================================
// NAVIGATION ACTIVE CLASS MANAGEMENT
// ============================================

// Function to set active navigation link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        const linkPage = linkHref.split('/').pop();
        
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to current page link
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Render packages table if on packages page
    if (document.querySelector('.packages-table')) {
        renderPackagesTable();
    }
    
    // Initialize booking form if on booking page
    if (document.querySelector('.booking-form')) {
        // Set minimum date to today for date inputs
        const today = new Date().toISOString().split('T')[0];
        const checkInInput = document.getElementById('checkIn');
        const checkOutInput = document.getElementById('checkOut');
        
        if (checkInInput) {
            checkInInput.setAttribute('min', today);
            checkInInput.addEventListener('change', function() {
                // Set minimum checkout date to day after check-in
                if (this.value && checkOutInput) {
                    const checkInDate = new Date(this.value);
                    checkInDate.setDate(checkInDate.getDate() + 1);
                    checkOutInput.setAttribute('min', checkInDate.toISOString().split('T')[0]);
                }
                calculateEstimatedTotal();
            });
        }
        
        if (checkOutInput) {
            checkOutInput.setAttribute('min', today);
            checkOutInput.addEventListener('change', calculateEstimatedTotal);
        }
        
        // Add event listeners for price calculation
        const packageSelect = document.getElementById('package');
        const guestsInput = document.getElementById('guests');
        const promoCodeInput = document.getElementById('promoCode');
        
        if (packageSelect) packageSelect.addEventListener('change', calculateEstimatedTotal);
        if (guestsInput) {
            guestsInput.addEventListener('change', calculateEstimatedTotal);
            guestsInput.addEventListener('input', calculateEstimatedTotal);
        }
        if (promoCodeInput) promoCodeInput.addEventListener('input', calculateEstimatedTotal);
        
        // Validate form on input
        const formInputs = document.querySelectorAll('.booking-form input, .booking-form select, .booking-form textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                const submitButton = document.querySelector('.booking-form button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = !validateBookingForm();
                }
                calculateEstimatedTotal();
            });
            input.addEventListener('change', function() {
                const submitButton = document.querySelector('.booking-form button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = !validateBookingForm();
                }
                calculateEstimatedTotal();
            });
        });
        
        // Initial calculation and validation
        calculateEstimatedTotal();
        const submitButton = document.querySelector('.booking-form button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = !validateBookingForm();
        }
    }
    
    // Initialize gallery modal if on gallery page
    if (document.querySelector('.gallery-grid')) {
        initGalleryModal();
    }
    
    // Set active navigation link on all pages
    setActiveNavLink();
});

