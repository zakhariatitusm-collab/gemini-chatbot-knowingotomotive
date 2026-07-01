const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const chatBack = document.getElementById('chat-back');
const clearChatBtn = document.getElementById('clear-chat');
const suggestionButtons = Array.from(document.querySelectorAll('.suggestion-button'));
const suggestionsContainer = document.querySelector('.suggestions');
const chatFontSlider = document.getElementById('chat-font-slider');
const chatFontSizeLabel = document.getElementById('chat-font-size-label');

const STORAGE_KEY = 'drivewise-chat-history';
let conversationHistory = [];

const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const saveConversationHistory = () => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(conversationHistory)); } catch (e) { console.warn('Unable to save chat history', e); }
};

const createMessage = (role, content, status = 'normal') => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', role);
  const contentWrap = document.createElement('div');
  contentWrap.classList.add('message-content');
  if (status === 'typing') contentWrap.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
  else contentWrap.innerHTML = renderMessageContent(content);
  const row = document.createElement('div'); row.classList.add('message-row'); row.appendChild(contentWrap);
  messageElement.dataset.role = role;
  messageElement.appendChild(row);
  const meta = document.createElement('div'); meta.classList.add('message-meta'); meta.textContent = formatTime(); messageElement.appendChild(meta);
  return messageElement;
};

const updateSuggestionVisibility = () => {
  if (!suggestionsContainer) return;
  const visible = conversationHistory.length === 0;
  suggestionsContainer.style.display = visible ? '' : 'none';
};

const escapeHtml = (text) => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const renderMessageContent = (text) => {
  const safeText = escapeHtml(text || '');
  return safeText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
};

const loadConversationHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      updateSuggestionVisibility();
      return;
    }
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      updateSuggestionVisibility();
      return;
    }
    conversationHistory = parsed.filter((item) => item && typeof item.text === 'string' && ['user', 'assistant', 'model', 'bot'].includes(item.role));
    conversationHistory.forEach(({ role, text }) => chatBox.appendChild(createMessage(role === 'user' ? 'user' : 'bot', text)));
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (e) { console.warn('Unable to restore chat history', e); }
  updateSuggestionVisibility();
};

const performChatRequest = async (messageElement) => {
  const content = messageElement.querySelector('.message-content'); if (content) content.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
  try {
    const response = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation: conversationHistory.map(({ role, text }) => ({ role: role === 'assistant' ? 'model' : role, text })) }),
    });
    if (!response.ok) {
      if (response.status === 429) throw new Error('quota');
      throw new Error(`Server returned ${response.status}`);
    }
    const data = await response.json();
    if (data.error && (data.error.includes('quota') || data.error.includes('Quota') || data.error.includes('rate limit') || data.error.includes('Rate limit'))) {
      throw new Error('quota');
    }
    const resultText = data && typeof data.result === 'string' ? data.result.trim() : 'No response';
    conversationHistory.push({ role: 'assistant', text: resultText }); saveConversationHistory(); if (content) content.innerHTML = renderMessageContent(resultText); chatBox.scrollTop = chatBox.scrollHeight;
  } catch (e) {
    console.error('Chat request failed', e);
    let errorMsg = 'Failed to get response from server.';
    if (e.message === 'quota') {
      errorMsg = 'Limit has been exceeded. Please try again later.';
    }
    if (messageElement && messageElement.querySelector('.message-content')) {
      messageElement.querySelector('.message-content').innerHTML = renderMessageContent(errorMsg);
    }
  }
};

const sendChatMessage = async (message) => {
  if (!message || !message.trim()) return;
  const normalized = message.trim();
  conversationHistory.push({ role: 'user', text: normalized });
  saveConversationHistory();
  chatBox.appendChild(createMessage('user', normalized));
  const thinking = createMessage('bot', '', 'typing');
  chatBox.appendChild(thinking);
  chatBox.scrollTop = chatBox.scrollHeight;
  chatInput.value = '';
  updateSuggestionVisibility();
  await performChatRequest(thinking);
};

chatForm?.addEventListener('submit', (e) => { e.preventDefault(); const text = chatInput.value.trim(); if (!text) return; sendChatMessage(text); });
chatInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.requestSubmit();
    return;
  }

  if (['Backspace', 'Delete'].includes(e.key) || e.key.length === 1) {
    suggestionInteractionStarted = true;
    updateSuggestionVisibility();
  }
});

chatBack?.addEventListener('click', () => { window.location.href = 'index.html'; });

suggestionButtons.forEach((btn) => { btn.addEventListener('click', () => { if (chatInput) chatInput.value = btn.textContent; chatInput?.focus(); }); });

chatInput?.addEventListener('input', () => {
  updateSuggestionVisibility();
});

const getClearConfirmationText = () => {
  const lang = (document.documentElement.lang || navigator.language || '').toLowerCase();
  return lang.startsWith('id')
    ? 'Apakah Anda yakin? seluruh percakapan akan dihapus.'
    : 'Are you sure? all conversations will be deleted.';
};

clearChatBtn?.addEventListener('click', () => {
  const confirmed = window.confirm(getClearConfirmationText());
  if (!confirmed) return;

  conversationHistory = [];
  saveConversationHistory();
  chatBox.innerHTML = '';
  updateSuggestionVisibility();
});

chatFontSlider?.addEventListener('input', (event) => { updateChatFontSize(event.target.value); });

window.addEventListener('load', () => {
  loadConversationHistory();
  try { const pending = localStorage.getItem('drivewise-chat-pending'); if (pending) { localStorage.removeItem('drivewise-chat-pending'); sendChatMessage(pending); } } catch (e) { console.warn('Unable to read pending prompt', e); }
  try { const savedSize = localStorage.getItem('drivewise-chat-font-size'); if (savedSize) updateChatFontSize(Number(savedSize)); } catch (e) {}
});
