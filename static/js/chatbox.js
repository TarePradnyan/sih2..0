// static/js/chatbox.js

document.addEventListener('DOMContentLoaded', () => {
    // This function adds the chatbox HTML to the current page
    function injectChatboxHTML() {
        const chatboxHTML = `
            <div class="chat-widget">
                <button id="chat-toggle-btn" class="chat-toggle-btn">
                    🤖
                </button>
                <div id="chat-popup" class="chat-popup">
                    <div class="chat-header">
                        <h3>AI Assistant</h3>
                        <button id="chat-close-btn" class="chat-close-btn">&times;</button>
                    </div>
                    <div id="chat-messages" class="chat-messages">
                         <div class="message bot-message">
                            <p>Hello! How can I help you today?</p>
                        </div>
                    </div>
                    <form id="chat-form" class="chat-form">
                        <input type="text" id="chat-input" placeholder="Type your message..." autocomplete="off">
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        `;
        // Append the HTML to the body of the page
        document.body.insertAdjacentHTML('beforeend', chatboxHTML);
    }

    // Call the function to create the chatbox on the page
    injectChatboxHTML();

    // Now, get references to the newly created elements
    const chatToggleButton = document.getElementById('chat-toggle-btn');
    const chatPopup = document.getElementById('chat-popup');
    const chatCloseButton = document.getElementById('chat-close-btn');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // Add all the event listeners
    if (chatToggleButton) {
        chatToggleButton.addEventListener('click', () => {
            chatPopup.classList.toggle('show');
        });
    }

    if (chatCloseButton) {
        chatCloseButton.addEventListener('click', () => {
            chatPopup.classList.remove('show');
        });
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userMessage = chatInput.value.trim();

            if (userMessage) {
                addMessage(userMessage, 'user-message');
                chatInput.value = '';

                setTimeout(() => {
                    addMessage("This feature is currently under progress.", 'bot-message');
                }, 1000);
            }
        });
    }

    function addMessage(text, className) {
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.classList.add('message', className);
        const p = document.createElement('p');
        p.textContent = text;
        messageElement.appendChild(p);
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
