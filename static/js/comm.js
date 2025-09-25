document.addEventListener('DOMContentLoaded', () => {
    console.log('Community page loaded.');
    // Add JavaScript for AI chatbot and community posts here
    // e.g., handling voice recording, image uploads, fetching community data
});

const socket = io();

const name = "{{ name }}";
const pincode = "{{ pincode }}";
const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

// Join Room
socket.emit('init', {name: name, pincode: pincode});

// Load Chat History
fetch(`/get_chat/${pincode}`)
    .then(response => response.json())
    .then(messages => {
        messages.forEach(m => {
            chatBox.innerHTML += `<div><strong>${m.name}</strong>: ${m.msg} <small style="color:#aaa">${m.timestamp}</small></div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        });
    });

// Send Message
sendBtn.onclick = () => {
    const msg = chatInput.value;
    if (msg) {
        socket.emit('message', {name: name, pincode: pincode, msg: msg});
        chatInput.value = '';
    }
};

socket.on('message', data => {
    chatBox.innerHTML += `<div><strong>${data.name}</strong>: ${data.msg}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
});
