document.addEventListener('DOMContentLoaded', function () {
    const chatSidebar = document.getElementById('chatSidebar');
    const mainContent = document.getElementById('mainContent');
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const voiceInputBtn = document.getElementById('voiceInputBtn');

    let recognition = null;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'es-ES';
        recognition.onresult = function (event) {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
        };
    }
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('mb-3', sender === 'user' ? 'text-end' : 'text-start');
        messageElement.innerHTML = `
            <span class="d-inline-block p-2 rounded ${sender === 'user' ? 'bg-primary' : 'bg-secondary'}">
                ${text}
            </span>
        `;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            messageInput.value = '';
            // Simular respuesta de la IA
            setTimeout(() => {
                addMessage("Entendido. ¿En qué más puedo ayudarte?", 'ai');
            }, 1000);
        }
    }

    sendMessageBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    voiceInputBtn.addEventListener('click', function () {
        if (recognition) {
            recognition.start();
            voiceInputBtn.innerHTML = '<i class="bi bi-mic-fill text-danger"></i>';
            setTimeout(() => {
                recognition.stop();
                voiceInputBtn.innerHTML = '<i class="bi bi-mic"></i>';
            }, 5000);
        }
    });

    // Inicializar tooltips de Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});