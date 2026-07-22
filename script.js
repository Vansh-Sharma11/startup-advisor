// Startup Fields Database
const startupFields = {
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
    'Ecommerce': {
        name: 'E-commerce & Retail',
        emoji: '🛍️',
        description: 'Online stores, dropshipping, niche marketplaces, subscription boxes',
        requirements: ['Making Money', 'Freedom & Independence'],
        traits: ['Leadership', 'Communication'],
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

// User data
let userData = {
    name: '',
    ageRange: '',
    traits: [],
    motivation: '',
    workStyle: '',
    riskTolerance: 5,
    experience: '',
    interests: [],
    ideaDescription: ''
};

// Quiz Functions
function nextStep(stepNumber) {
    // Validate current step
    if (!validateCurrentStep()) {
        alert('Please fill in all required fields');
        return;
    }

    // Save data from current step
    saveStepData(stepNumber - 1);

    // Show next step
    document.querySelectorAll('.quiz-step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step${stepNumber}`).classList.add('active');

    // Update progress
    updateProgress(stepNumber);
}

function prevStep(stepNumber) {
    document.querySelectorAll('.quiz-step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step${stepNumber}`).classList.add('active');
    updateProgress(stepNumber);
}

function validateCurrentStep() {
    const activeStep = document.querySelector('.quiz-step.active');
    const inputs = activeStep.querySelectorAll('input[required], select[required], textarea[required]');
    
    for (let input of inputs) {
        if (!input.value) return false;
    }
    return true;
}

function saveStepData(stepNumber) {
    if (stepNumber === 1) {
        userData.name = document.getElementById('name').value;
        userData.ageRange = document.querySelector('input[name="ageRange"]:checked')?.value || '';
    } else if (stepNumber === 2) {
        userData.traits = Array.from(document.querySelectorAll('.trait:checked')).map(e => e.value);
        userData.motivation = document.getElementById('motivation').value;
    } else if (stepNumber === 3) {
        userData.workStyle = document.querySelector('input[name="workStyle"]:checked')?.value || '';
        userData.riskTolerance = parseInt(document.getElementById('riskTolerance').value);
        userData.experience = document.getElementById('experience').value;
    }
}

function updateProgress(stepNumber) {
    const progress = (stepNumber / 4) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('stepIndicator').textContent = `Step ${stepNumber} of 4`;
}

function submitQuiz() {
    // Save last step data
    userData.interests = Array.from(document.querySelectorAll('.interest:checked')).map(e => e.value);
    userData.ideaDescription = document.getElementById('ideaDescription').value;

    // Validate
    if (userData.traits.length === 0 || userData.interests.length === 0) {
        alert('Please complete all required fields');
        return;
    }

    // Calculate recommendations
    const recommendations = calculateRecommendations();

    // Show results
    showResults(recommendations);
}

function calculateRecommendations() {
    const scores = {};

    // Initialize scores
    Object.keys(startupFields).forEach(field => {
        scores[field] = 0;
    });

    // Score based on traits
    userData.traits.forEach(trait => {
        Object.entries(startupFields).forEach(([field, data]) => {
            if (data.traits.includes(trait)) {
                scores[field] += 15;
            }
        });
    });

    // Score based on motivation
    Object.entries(startupFields).forEach(([field, data]) => {
        if (data.requirements.includes(userData.motivation)) {
            scores[field] += 20;
        }
    });

    // Score based on interests
    userData.interests.forEach(interest => {
        Object.entries(startupFields).forEach(([field, data]) => {
            if (field.toLowerCase() === interest.toLowerCase()) {
                scores[field] += 30;
            }
        });
    });

    // Score based on work style and risk tolerance
    Object.entries(startupFields).forEach(([field, data]) => {
        if (userData.workStyle === 'Independent' && field === 'Consulting') {
            scores[field] += 10;
        }
        
        if (userData.riskTolerance >= 7 && (field === 'Finance' || field === 'Tech')) {
            scores[field] += 15;
        }
        
        if (userData.riskTolerance <= 4 && (field === 'Education' || field === 'Consulting')) {
            scores[field] += 10;
        }
    });

    // Score based on experience
    const experienceBonus = {
        'None': 0,
        'Some': 10,
        'Good': 20,
        'Expert': 30
    };
    
    Object.keys(startupFields).forEach(field => {
        scores[field] += experienceBonus[userData.experience] || 0;
    });

    // Sort and return top recommendations
    return Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([field, score], index) => ({
            field,
            score: Math.min(100, Math.round(score / 2)),
            rank: index + 1
        }));
}

function showResults(recommendations) {
    // Hide quiz, show results
    document.getElementById('quizPage').classList.remove('active');
    document.getElementById('resultsPage').classList.add('active');

    // Welcome message
    document.getElementById('welcomeMessage').innerHTML = 
        `Great! Here are your personalized startup recommendations, ${userData.name}!`;

    // Profile summary
    const profileSummary = `
        <div class="summary-item">
            <div class="summary-label">Primary Strength</div>
            <div class="summary-value">${userData.traits[0] || 'N/A'}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Motivation</div>
            <div class="summary-value">${userData.motivation}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Risk Tolerance</div>
            <div class="summary-value">${userData.riskTolerance}/10</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Experience Level</div>
            <div class="summary-value">${userData.experience}</div>
        </div>
    `;
    document.getElementById('profileSummary').innerHTML = profileSummary;

    // Recommendations
    const recommendationsHTML = recommendations.map(rec => {
        const field = startupFields[rec.field];
        const reasons = generateReasons(rec.field);
        
        return `
            <div class="recommendation-card">
                <div class="recommendation-rank">#${rec.rank}</div>
                <h3>${field.emoji} ${field.name}</h3>
                <p>${field.description}</p>
                <div class="match-score">${rec.score}% Match</div>
                <div class="reasons-list">
                    <h4>Why This Fits You:</h4>
                    <ul>
                        ${reasons.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }).join('');
    document.getElementById('recommendations').innerHTML = recommendationsHTML;

    // Action plan
    const actionPlan = generateActionPlan(recommendations[0].field);
    document.getElementById('actionPlan').innerHTML = actionPlan;
}

function generateReasons(field) {
    const fieldData = startupFields[field];
    const reasons = [];

    // Match with traits
    userData.traits.forEach(trait => {
        if (fieldData.traits.includes(trait)) {
            reasons.push(`Your ${trait} aligns perfectly with this field`);
        }
    });

    // Match with motivation
    if (fieldData.requirements.includes(userData.motivation)) {
        reasons.push(`This field focuses on ${userData.motivation}`);
    }

    // Match with interests
    if (userData.interests.includes(field)) {
        reasons.push(`You explicitly showed interest in ${field}`);
    }

    return reasons.slice(0, 3);
}

function generateActionPlan(topField) {
    const steps = [
        {
            title: 'Research the Industry',
            description: 'Learn about market trends, competitors, and opportunities'
        },
        {
            title: 'Validate Your Idea',
            description: 'Talk to potential customers and gather feedback'
        },
        {
            title: 'Build Your MVP',
            description: 'Create a simple version to test your concept'
        },
        {
            title: 'Find Co-founders',
            description: 'Connect with people who complement your skills'
        }
    ];

    return steps.map((step, index) => `
        <div class="action-item">
            <div class="action-step">
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                    <h4>${step.title}</h4>
                    <p>${step.description}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function restartQuiz() {
    // Reset data
    userData = {
        name: '',
        ageRange: '',
        traits: [],
        motivation: '',
        workStyle: '',
        riskTolerance: 5,
        experience: '',
        interests: [],
        ideaDescription: ''
    };

    // Reset form
    document.querySelectorAll('input, select, textarea').forEach(el => {
        if (el.type === 'checkbox' || el.type === 'radio') {
            el.checked = false;
        } else {
            el.value = '';
        }
    });

    // Reset slider
    document.getElementById('riskTolerance').value = 5;
    document.getElementById('riskValue').textContent = 5;

    // Show landing page
    document.getElementById('landingPage').classList.add('active');
    document.getElementById('resultsPage').classList.remove('active');
    document.getElementById('quizPage').classList.remove('active');
    document.querySelectorAll('.quiz-step').forEach((step, index) => {
        if (index === 0) step.classList.add('active');
        else step.classList.remove('active');
    });
    document.getElementById('progressFill').style.width = '0%';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Start button
    document.getElementById('startBtn').addEventListener('click', () => {
        document.getElementById('landingPage').classList.remove('active');
        document.getElementById('quizPage').classList.add('active');
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // Load theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').textContent = '☀️';
    }

    // Risk tolerance slider
    document.getElementById('riskTolerance').addEventListener('input', (e) => {
        document.getElementById('riskValue').textContent = e.target.value;
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.getElementById('quizPage').classList.contains('active')) {
        const activeStep = document.querySelector('.quiz-step.active');
        const stepNum = parseInt(activeStep.id.replace('step', ''));
        if (stepNum < 4) {
            nextStep(stepNum + 1);
        } else {
            submitQuiz();
        }
    }
});
