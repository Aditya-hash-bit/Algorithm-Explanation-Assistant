let currentChat = "chat_1";

document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const newChatBtn = document.getElementById('new-chat-btn');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const chips = document.querySelectorAll('.chip');

    // Markdown setup
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        }
    });

    scrollToBottom();

    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        sendBtn.disabled = this.value.trim() === '';
    });

    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    // 🔥 FIXED NEW CHAT (NO RELOAD)
    newChatBtn.addEventListener('click', async () => {
        const res = await fetch('/new_chat', { method: 'POST' });
        const data = await res.json();
        currentChat = data.chat_id;

        document.getElementById('chat-container').innerHTML = "";
    });

    clearHistoryBtn.addEventListener('click', async () => {
        if(confirm("Clear all chats?")) {
            await fetch('/clear_history', { method: 'POST' });
            window.location.reload();
        }
    });

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            userInput.value = chip.getAttribute('data-query');
            sendMessage();
        });
    });

    async function sendMessage() {
        const query = userInput.value.trim();
        if (!query) return;

        if (welcomeScreen) welcomeScreen.style.display = 'none';

        appendUserMessage(query);

        userInput.value = '';
        userInput.style.height = 'auto';
        sendBtn.disabled = true;

        const loaderId = appendLoadingIndicator();

        try {
            const response = await fetch('/explain', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    query,
                    chat_id: currentChat
                })
            });

            const data = await response.json();
            document.getElementById(loaderId).remove();

            if (data.success) {
                appendAIMessage(data.response);
            } else {
                appendError(data.error);
            }

        } catch {
            document.getElementById(loaderId).remove();
            appendError("Server error");
        }
    }

    function appendUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'message user-message';
        div.innerHTML = `<div class="message-content">${escapeHTML(text)}</div>`;
        chatContainer.appendChild(div);
        scrollToBottom();
    }

    function appendAIMessage(text) {
        const div = document.createElement('div');
        div.className = 'message ai-message';
        div.innerHTML = `
            <div class="message-avatar"><i class="ph ph-robot"></i></div>
            <div class="message-content markdown-body">
                ${marked.parse(text)}
            </div>
        `;
        chatContainer.appendChild(div);
        scrollToBottom();
    }

    function appendLoadingIndicator() {
        const id = 'loader-' + Date.now();
        const div = document.createElement('div');
        div.className = 'message ai-message';
        div.id = id;
        div.innerHTML = `<div class="message-content">Loading...</div>`;
        chatContainer.appendChild(div);
        return id;
    }

    function appendError(msg) {
        const div = document.createElement('div');
        div.className = 'message ai-message';
        div.innerHTML = `<div class="message-content" style="color:red;">${msg}</div>`;
        chatContainer.appendChild(div);
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});


/* 🔥 VERY IMPORTANT — OUTSIDE DOMContentLoaded */
function loadChat(chatId) {

    currentChat = chatId;

    fetch('/get_chat/' + chatId)
    .then(res => res.json())
    .then(data => {

        const chatContainer = document.getElementById('chat-container');
        chatContainer.innerHTML = "";

        data.messages.forEach(item => {

            const userDiv = document.createElement('div');
            userDiv.className = 'message user-message';
            userDiv.innerHTML = `<div class="message-content">${item.query}</div>`;
            chatContainer.appendChild(userDiv);

            const aiDiv = document.createElement('div');
            aiDiv.className = 'message ai-message';
            aiDiv.innerHTML = `
                <div class="message-avatar"><i class="ph ph-robot"></i></div>
                <div class="message-content markdown-body">
                    ${marked.parse(item.response)}
                </div>
            `;
            chatContainer.appendChild(aiDiv);
        });

    })
    .catch(err => console.error(err));
}