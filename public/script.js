const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) {
    return;
  }

  appendMessage('user', userMessage);
  input.value = '';

  const thinkingMessage = appendMessage('bot', 'Thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversation: [
          { role: 'user', text: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const data = await response.json();
    const resultText = data && typeof data.result === 'string' ? data.result.trim() : '';

    if (!resultText) {
      updateMessageText(thinkingMessage, 'Sorry, no response received.');
    } else {
      updateMessageText(thinkingMessage, resultText);
    }
  } catch (error) {
    console.error('Chat request failed:', error);
    updateMessageText(thinkingMessage, 'Failed to get response from server.');
  }
});

function appendMessage(sender, text) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.textContent = text;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight;
  return messageElement;
}

function updateMessageText(messageElement, text) {
  if (!messageElement) {
    appendMessage('bot', text);
    return;
  }

  messageElement.textContent = text;
  chatBox.scrollTop = chatBox.scrollHeight;
}
