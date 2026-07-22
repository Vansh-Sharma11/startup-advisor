// Admin Panel JavaScript
const ADMIN_PASSWORD = 'admin123';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load saved colors
    loadSavedSettings();
    
    // Check if already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showAdminPanel();
    }

    // Load and display startup fields
    displayFields();
});

// Login Function
function loginAdmin() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
        document.getElementById('adminPassword').value = '';
    } else {
        alert('❌ Incorrect password!');
    }
}

// Show Admin Panel
function showAdminPanel() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('adminScreen').classList.add('active');
    updateFieldsCount();
}

// Logout
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem('adminLoggedIn');
    document.getElementById('loginScreen').classList.add('active');
    document.getElementById('adminScreen').classList.remove('active');
    window.location.reload();
});

// Tab Management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    
    // Remove active from buttons
    document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const tab = document.getElementById(`${tabName}-tab`);
    if (tab) {
        tab.classList.add('active');
    }
    
    // Mark button as active
    event.target.classList.add('active');
}

// Display Fields
function displayFields() {
    const container = document.getElementById('fieldsContainer');
    const fields = getStartupFields();
    
    container.innerHTML = Object.entries(fields).map(([key, field]) => `
        <div class="field-card">
            <div class="field-icon">${field.emoji}</div>
            <h3>${field.name}</h3>
            <p>${field.description}</p>
            <div class="field-actions">
                <button class="btn btn-primary btn-sm" onclick="editField('${key}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteField('${key}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Get Startup Fields from localStorage
function getStartupFields() {
    const saved = localStorage.getItem('startupFields');
    if (saved) {
        return JSON.parse(saved);
    }
    
    // Default fields from script.js
    return {
        'Tech': {
            name: 'Technology & SaaS',
            emoji: '💻',
            description: 'Software products, apps, platforms, and tech solutions',
            requirements: ['Technical', 'Analytical', 'Innovation & Technology'],
            traits: ['Leadership', 'Technical'],
            risks: 'High'
        },
        'Health': {
            name: 'Health & Wellness',
            emoji: '🏥',
            description: 'Fitness apps, wellness products, medical tech, health coaching',
            requirements: ['Helping', 'Making a Social Impact'],
            traits: ['Communication', 'Problem-solving'],
            risks: 'Medium'
        },
        'Education': {
            name: 'EdTech & Online Learning',
            emoji: '📚',
            description: 'Online courses, tutoring platforms, skill-building apps',
            requirements: ['Helping Others', 'Making a Social Impact'],
            traits: ['Communication', 'Creativity'],
            risks: 'Low-Medium'
        },
        'Ecommerce': {
            name: 'E-commerce & Retail',
            emoji: '🛍️',
            description: 'Online stores, dropshipping, niche marketplaces, subscription boxes',
            requirements: ['Making Money', 'Freedom & Independence'],
            traits: ['Leadership', 'Communication'],
            risks: 'Medium'
        },
        'Consulting': {
            name: 'Consulting & Services',
            emoji: '💼',
            description: 'Business consulting, freelance services, coaching, agencies',
            requirements: ['Freedom & Independence', 'Recognition & Fame'],
            traits: ['Leadership', 'Communication', 'Problem-solving'],
            risks: 'Low'
        },
        'Creative': {
            name: 'Creative & Design',
            emoji: '🎨',
            description: 'Design services, content creation, marketing agencies, studios',
            requirements: ['Creativity', 'Recognition & Fame'],
            traits: ['Creativity', 'Communication'],
            risks: 'Medium'
        },
        'Finance': {
            name: 'FinTech & Finance',
            emoji: '💰',
            description: 'Crypto platforms, investment apps, lending services, payment solutions',
            requirements: ['Making Money', 'Innovation & Technology'],
            traits: ['Analytical', 'Technical'],
            risks: 'High'
        },
        'Social': {
            name: 'Social Media & Community',
            emoji: '📱',
            description: 'Community platforms, content networks, social apps',
            requirements: ['Making a Social Impact', 'Innovation & Technology'],
            traits: ['Leadership', 'Creativity'],
            risks: 'High'
        }
    };
}

// Edit Field
function editField(fieldKey) {
    const fields = getStartupFields();
    const field = fields[fieldKey];
    
    document.getElementById('fieldName').value = fieldKey;
    document.getElementById('fieldDisplayName').value = field.name;
    document.getElementById('fieldEmoji').value = field.emoji;
    document.getElementById('fieldDescription').value = field.description;
    document.getElementById('fieldRisk').value = field.risks;
    
    document.getElementById('fieldForm').onsubmit = (e) => {
        e.preventDefault();
        saveField(fieldKey);
    };
    
    document.getElementById('fieldModal').classList.add('active');
}

// Show Add Field Form
function showAddFieldForm() {
    document.getElementById('fieldForm').reset();
    document.getElementById('fieldName').disabled = false;
    
    document.getElementById('fieldForm').onsubmit = (e) => {
        e.preventDefault();
        saveField(null);
    };
    
    document.getElementById('fieldModal').classList.add('active');
}

// Save Field
function saveField(existingKey) {
    const fields = getStartupFields();
    const newKey = document.getElementById('fieldName').value || 'NewField';
    
    fields[newKey] = {
        name: document.getElementById('fieldDisplayName').value,
        emoji: document.getElementById('fieldEmoji').value,
        description: document.getElementById('fieldDescription').value,
        requirements: [],
        traits: [],
        risks: document.getElementById('fieldRisk').value
    };
    
    if (existingKey && existingKey !== newKey) {
        delete fields[existingKey];
    }
    
    localStorage.setItem('startupFields', JSON.stringify(fields));
    closeFieldModal();
    displayFields();
    updateFieldsCount();
    alert('✅ Field saved successfully!');
}

// Delete Field
function deleteField(fieldKey) {
    if (confirm(`Delete "${fieldKey}" field?`)) {
        const fields = getStartupFields();
        delete fields[fieldKey];
        localStorage.setItem('startupFields', JSON.stringify(fields));
        displayFields();
        updateFieldsCount();
        alert('✅ Field deleted!');
    }
}

// Close Field Modal
function closeFieldModal() {
    document.getElementById('fieldModal').classList.remove('active');
}

// Update Fields Count
function updateFieldsCount() {
    const fields = getStartupFields();
    document.getElementById('totalFields').textContent = Object.keys(fields).length;
}

// Quiz Step Editing
function editQuizStep(step) {
    alert(`📝 Edit Step ${step} quiz questions.\n\nYou can edit the HTML directly in index.html for quiz step ${step}.`);
}

// Update Site Color
function updateSiteColor(type, color) {
    const colorMap = {
        'primary': '--primary-color',
        'secondary': '--secondary-color',
        'success': '--success-color'
    };
    
    document.documentElement.style.setProperty(colorMap[type], color);
    localStorage.setItem(`siteColor_${type}`, color);
    
    // Also update main site colors
    updateMainSiteColors();
}

// Update Main Site Colors
function updateMainSiteColors() {
    const primaryColor = localStorage.getItem('siteColor_primary') || '#6366f1';
    const secondaryColor = localStorage.getItem('siteColor_secondary') || '#ec4899';
    const successColor = localStorage.getItem('siteColor_success') || '#10b981';
    
    // Store for main site to use
    localStorage.setItem('customColors', JSON.stringify({
        primary: primaryColor,
        secondary: secondaryColor,
        success: successColor
    }));
}

// Load Saved Settings
function loadSavedSettings() {
    const primaryColor = localStorage.getItem('siteColor_primary');
    const secondaryColor = localStorage.getItem('siteColor_secondary');
    const successColor = localStorage.getItem('siteColor_success');
    
    if (primaryColor) {
        document.getElementById('primaryColor').value = primaryColor;
        document.documentElement.style.setProperty('--primary-color', primaryColor);
    }
    if (secondaryColor) {
        document.getElementById('secondaryColor').value = secondaryColor;
        document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    }
    if (successColor) {
        document.getElementById('successColor').value = successColor;
        document.documentElement.style.setProperty('--success-color', successColor);
    }
    
    const footerText = localStorage.getItem('footerText');
    if (footerText) {
        document.getElementById('footerText').value = footerText;
    }
}

// Update Footer
function updateFooter() {
    const footerText = document.getElementById('footerText').value;
    localStorage.setItem('footerText', footerText);
    alert('✅ Footer updated!');
}

// Export Data
function exportData() {
    const data = {
        startupFields: getStartupFields(),
        colors: {
            primary: localStorage.getItem('siteColor_primary'),
            secondary: localStorage.getItem('siteColor_secondary'),
            success: localStorage.getItem('siteColor_success')
        },
        footerText: localStorage.getItem('footerText')
    };
    
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'startup-advisor-backup.json';
    link.click();
    
    alert('✅ Data exported!');
}

// Reset to Default
function resetToDefault() {
    if (confirm('⚠️ Reset all settings to default? This cannot be undone!')) {
        localStorage.removeItem('startupFields');
        localStorage.removeItem('siteColor_primary');
        localStorage.removeItem('siteColor_secondary');
        localStorage.removeItem('siteColor_success');
        localStorage.removeItem('footerText');
        location.reload();
    }
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('fieldModal');
    if (event.target == modal) {
        modal.classList.remove('active');
    }
}
