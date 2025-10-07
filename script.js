// Global variables
let map;
let isRecording = false;
let isDetailsRecording = false;
let currentLocation = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    initializeMap();
    loadSampleAddresses();
});

// Initialize event listeners
function initializeEventListeners() {
    // Fire incident reporting buttons
    document.getElementById('startRecording').addEventListener('click', startFireRecording);
    document.getElementById('stopRecording').addEventListener('click', stopFireRecording);
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    
    // Details section buttons
    document.getElementById('startDetails').addEventListener('click', startDetailsRecording);
    document.getElementById('stopDetails').addEventListener('click', stopDetailsRecording);
    
    // Save address button
    document.getElementById('saveAddress').addEventListener('click', saveAddress);
    
    // Address form inputs
    const addressInputs = document.querySelectorAll('.address-form input');
    addressInputs.forEach(input => {
        input.addEventListener('input', validateAddressForm);
    });
}

// Initialize Google Map
function initMap() {
    // Default location (Bangkok, Thailand)
    const defaultLocation = { lat: 13.7563, lng: 100.5018 };
    
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: defaultLocation,
        mapTypeId: 'roadmap',
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });
    
    // Add a marker for the default location
    const marker = new google.maps.Marker({
        position: defaultLocation,
        map: map,
        title: 'ตำแหน่งเริ่มต้น'
    });
    
    // Get user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(currentLocation);
                marker.setPosition(currentLocation);
                marker.setTitle('ตำแหน่งปัจจุบันของคุณ');
            },
            function(error) {
                console.log('Error getting location:', error);
            }
        );
    }
}

// Fire incident recording functions
function startFireRecording() {
    isRecording = true;
    document.getElementById('startRecording').disabled = true;
    document.getElementById('stopRecording').disabled = false;
    
    // Add visual feedback
    document.getElementById('startRecording').classList.add('loading');
    
    // Simulate recording (in real app, this would start actual recording)
    console.log('Fire incident recording started');
    
    // Update text area with placeholder text
    const textArea = document.getElementById('incidentText');
    textArea.value = 'กำลังบันทึกเสียง... กรุณาพูดรายละเอียดเหตุการณ์';
    textArea.classList.add('loading');
}

function stopFireRecording() {
    isRecording = false;
    document.getElementById('startRecording').disabled = false;
    document.getElementById('stopRecording').disabled = true;
    
    // Remove visual feedback
    document.getElementById('startRecording').classList.remove('loading');
    document.getElementById('incidentText').classList.remove('loading');
    
    console.log('Fire incident recording stopped');
}

// Details recording functions
function startDetailsRecording() {
    isDetailsRecording = true;
    document.getElementById('startDetails').disabled = true;
    document.getElementById('stopDetails').disabled = false;
    
    // Add visual feedback
    document.getElementById('startDetails').classList.add('loading');
    
    // Simulate recording
    console.log('Details recording started');
    
    // Update text area with placeholder text
    const textArea = document.getElementById('detailsText');
    textArea.value = 'กำลังบันทึกเสียง... กรุณาพูดรายละเอียดเพิ่มเติม';
    textArea.classList.add('loading');
}

function stopDetailsRecording() {
    isDetailsRecording = false;
    document.getElementById('startDetails').disabled = false;
    document.getElementById('stopDetails').disabled = true;
    
    // Remove visual feedback
    document.getElementById('startDetails').classList.remove('loading');
    document.getElementById('detailsText').classList.remove('loading');
    
    console.log('Details recording stopped');
}

// Search functionality
function performSearch() {
    const searchTerm = document.getElementById('incidentText').value;
    
    if (!searchTerm.trim()) {
        alert('กรุณาใส่คำค้นหาในช่องรายละเอียดเหตุการณ์');
        return;
    }
    
    // Simulate search (in real app, this would call Google Places API)
    console.log('Searching for:', searchTerm);
    
    // Show loading state
    const searchBtn = document.getElementById('searchBtn');
    const originalText = searchBtn.textContent;
    searchBtn.textContent = 'กำลังค้นหา...';
    searchBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        searchBtn.textContent = originalText;
        searchBtn.disabled = false;
        showSearchResults(searchTerm);
    }, 2000);
}

// Show search results
function showSearchResults(searchTerm) {
    const addressList = document.getElementById('addressList');
    
    // Sample search results (in real app, these would come from Google Places API)
    const sampleResults = [
        'ที่อยุ่ 1 ต. 1',
        'ที่อยุ่ 1 ต. 2',
        'ที่อยุ่ 1 ต. 3'
    ];
    
    // Filter results based on search term
    const filteredResults = sampleResults.filter(address => 
        address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Display results
    addressList.innerHTML = '';
    
    if (filteredResults.length === 0) {
        addressList.innerHTML = '<div class="address-item">ไม่พบผลการค้นหา</div>';
    } else {
        filteredResults.forEach((address, index) => {
            const addressItem = document.createElement('div');
            addressItem.className = 'address-item';
            addressItem.textContent = address;
            addressItem.addEventListener('click', () => selectAddress(address));
            addressList.appendChild(addressItem);
        });
    }
}

// Select address from search results
function selectAddress(address) {
    // Parse address and fill form fields
    const addressParts = address.split(' ');
    
    // Simple parsing (in real app, use proper address parsing)
    document.getElementById('address').value = address;
    
    // Extract postal code (last 5 digits)
    const postalCodeMatch = address.match(/\d{5}/);
    if (postalCodeMatch) {
        document.getElementById('postalCode').value = postalCodeMatch[0];
    }
    
    // Extract province (last part before postal code)
    const parts = address.split(' ');
    const provinceIndex = parts.findIndex(part => part.match(/\d{5}/)) - 1;
    if (provinceIndex > 0) {
        document.getElementById('province').value = parts[provinceIndex];
    }
    
    // Update map with selected address
    updateMapWithAddress(address);
    
    console.log('Selected address:', address);
}

// Update map with selected address
function updateMapWithAddress(address) {
    // In real app, use Google Geocoding API to get coordinates
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address: address }, function(results, status) {
        if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            map.setCenter(location);
            map.setZoom(15);
            
            // Add marker for the address
            new google.maps.Marker({
                position: location,
                map: map,
                title: address
            });
        } else {
            console.log('Geocoding failed:', status);
        }
    });
}

// Load sample addresses
function loadSampleAddresses() {
    const sampleAddresses = [
        'ที่อยุ่ 1 ต. 1',
        'ที่อยุ่ 1 ต. 2',
        'ที่อยุ่ 1 ต. 3'
    ];
    
    const addressList = document.getElementById('addressList');
    addressList.innerHTML = '';
    
    sampleAddresses.forEach(address => {
        const addressItem = document.createElement('div');
        addressItem.className = 'address-item';
        addressItem.textContent = address;
        addressItem.addEventListener('click', () => selectAddress(address));
        addressList.appendChild(addressItem);
    });
}

// Save address function
function saveAddress() {
    if (!validateAddressForm()) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }
    
    // Get form data
    const addressData = {
        address: document.getElementById('address').value,
        subdistrict: document.getElementById('subdistrict').value,
        district: document.getElementById('district').value,
        province: document.getElementById('province').value,
        postalCode: document.getElementById('postalCode').value
    };
    
    // Show success message
    alert('บันทึกข้อมูลที่อยู่เรียบร้อยแล้ว!');
    
    // Log the data (in real app, this would be sent to server)
    console.log('Saved address data:', addressData);
    
    // Optional: Clear form after saving
    // clearAddressForm();
}

// Clear address form (optional function)
function clearAddressForm() {
    document.getElementById('address').value = '';
    document.getElementById('subdistrict').value = '';
    document.getElementById('district').value = '';
    document.getElementById('province').value = '';
    document.getElementById('postalCode').value = '';
}

// Validate address form
function validateAddressForm() {
    const inputs = document.querySelectorAll('.address-form input');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.value.trim() === '') {
            isValid = false;
            input.style.borderColor = '#ff6b6b';
        } else {
            input.style.borderColor = '#4ecdc4';
        }
    });
    
    return isValid;
}

// Utility function to format address
function formatAddress(address) {
    return address.replace(/\s+/g, ' ').trim();
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        startFireRecording,
        stopFireRecording,
        startDetailsRecording,
        stopDetailsRecording,
        performSearch,
        selectAddress,
        validateAddressForm
    };
}