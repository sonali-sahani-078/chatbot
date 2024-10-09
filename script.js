// Initialize speech synthesis and mute state
const synth = window.speechSynthesis;
let isMuted = false;

// Handle the mute/unmute toggle
document.getElementById('mute-btn').addEventListener('click', function() {
    const muteImg = document.getElementById('mute-img');
    isMuted = !isMuted;  // Toggle mute state

    if (isMuted) {
        muteImg.src = 'unmute-icon.png';  // Change to unmute icon
        muteImg.alt = 'Unmute';
        console.log("Muted");
    } else {
        muteImg.src = 'mute-icon.png';  // Change to mute icon
        muteImg.alt = 'Mute';
        console.log("Unmuted");
    }
});

// Voice Synthesis (Speech)
// Initialize Speech Recognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = false;  // Disable interim results for cleaner input
recognition.lang = 'en-US';          // Set language to English (you can change it)

// Voice Button: Toggle Speech Recognition
document.getElementById('voice-btn').addEventListener('click', function() {
    recognition.start();  // Start voice recognition
});

// Handle Speech Recognition Result
recognition.addEventListener('result', (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('user-input').value = transcript;  // Place the recognized text in the input field
});

// Handle End of Speech Recognition (Stops after one input)
recognition.addEventListener('end', () => {
    recognition.stop();  // Automatically stop the recognition when input is captured
});

// Send Message Functionality
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Function to send message
function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    if (userInput !== '') {
        addMessage(userInput, 'user-message');
        saveMessageToHistory(userInput, 'user-message');
        document.getElementById('user-input').value = '';
        showTypingIndicator();
        setTimeout(() => {
            generateBotResponse(userInput);
        }, 1000);
    }
}

// Function to add message to the chat
function addMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + className;
    messageDiv.innerText = text;
    document.getElementById('messages').appendChild(messageDiv);
    document.getElementById('chat-box').scrollTo({
        top: document.getElementById('chat-box').scrollHeight,
        behavior: 'smooth'
    });
}

// Function to speak bot messages (if not muted)
function speakMessage(text) {
    if (!isMuted && synth) {
        const utterance = new SpeechSynthesisUtterance(text);
        synth.speak(utterance);
    }
}

// Function to generate the bot's response
function generateBotResponse(userInput) {
    removeTypingIndicator();

    let botResponse = '';
    const userMessage = userInput.toLowerCase();

    if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
        botResponse = 'Hello! How can I assist you today?';
    } else if (userMessage.includes('how are you')) {
        botResponse = 'I am just a bot, but I\'m here to help you!';
    } else if (userMessage.includes('help')) {
        botResponse = 'Sure, I\'m here to assist. What do you need help with?';
    } else if (userMessage.includes('bye')) {
        botResponse = 'Goodbye! Have a great day!';
    } else if (userMessage.includes('name')) {
        const name = localStorage.getItem('name') || 'User';
        botResponse = `Your name is ${name}.`;
    } else if (userMessage.includes('thank you') || userMessage.includes('thanks')) {
        botResponse = 'You\'re welcome! If you have more questions, feel free to ask.';
    } else if (userMessage.includes('tell me a joke')) {
        botResponse = 'Why don’t skeletons fight each other? They don’t have the guts!';
    } else {
        botResponse = "I'm not sure I understand. Can you please clarify or ask something else?";
    }

    addMessage(botResponse, 'bot-message');
    saveMessageToHistory(botResponse, 'bot-message');
    speakMessage(botResponse);  // Make the bot speak the response
}

// Function to show typing indicator
function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.className = 'message bot-message';
    typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    document.getElementById('messages').appendChild(typingIndicator);
    document.getElementById('chat-box').scrollTo({
        top: document.getElementById('chat-box').scrollHeight,
        behavior: 'smooth'
    });
}

// Function to remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Function to save messages to local storage
function saveMessageToHistory(message, className) {
    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.push({ message, className });
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Function to load chat history
function loadChatHistory() {
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    chatHistory.forEach(({ message, className }) => {
        addMessage(message, className);
    });
}

// Clear Chat Button
document.getElementById('clear-btn').addEventListener('click', function() {
    document.getElementById('messages').innerHTML = '';  // Clear messages from the UI
    localStorage.removeItem('chatHistory');  // Clear chat history from local storage
    document.getElementById('user-input').focus();
});

// Theme Toggle Button
document.getElementById('theme-toggle-btn').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');  // Toggle dark mode class
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
});

// Load saved theme preference on page load
window.onload = function() {
    loadChatHistory();  // Load chat history
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
};



