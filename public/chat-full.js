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

const saveChatFontSize = (size) => { try { localStorage.setItem('drivewise-chat-font-size', String(size)); } catch (e) { console.warn('Unable to persist font size', e); } };

const createMessage = (role, content, status = 'normal') => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', role);
  const contentWrap = document.createElement('div');
  contentWrap.classList.add('message-content');
  if (status === 'typing') contentWrap.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
  else contentWrap.textContent = content;
  const row = document.createElement('div'); row.classList.add('message-row'); row.appendChild(contentWrap);
  messageElement.dataset.role = role;
  messageElement.appendChild(row);
  const meta = document.createElement('div'); meta.classList.add('message-meta'); meta.textContent = formatTime(); messageElement.appendChild(meta);
  return messageElement;
};

const loadConversationHistory = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return;
    conversationHistory = parsed.filter((item) => item && typeof item.text === 'string' && ['user', 'assistant', 'model', 'bot'].includes(item.role));
    conversationHistory.forEach(({ role, text }) => chatBox.appendChild(createMessage(role === 'user' ? 'user' : 'bot', text)));
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (e) { console.warn('Unable to restore chat history', e); }
};

const updateChatFontSize = (size) => {
  if (!size) return; const fontSize = `${size}px`; const chatShell = document.querySelector('.chat-shell'); if (chatShell) chatShell.style.setProperty('--chat-font-size', fontSize); if (chatFontSizeLabel) chatFontSizeLabel.textContent = `Chat size: ${fontSize}`; saveChatFontSize(size);
};

const performChatRequest = async (messageElement) => {
  const content = messageElement.querySelector('.message-content'); if (content) content.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
  try {
    const response = await fetch('/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation: conversationHistory.map(({ role, text }) => ({ role: role === 'assistant' ? 'model' : role, text })) }),
    });
    if (!response.ok) throw new Error(`Server returned ${response.status}`);
    const data = await response.json(); const resultText = data && typeof data.result === 'string' ? data.result.trim() : 'No response';
    conversationHistory.push({ role: 'assistant', text: resultText }); saveConversationHistory(); if (content) content.textContent = resultText; chatBox.scrollTop = chatBox.scrollHeight;
  } catch (e) { console.error('Chat request failed', e); if (messageElement && messageElement.querySelector('.message-content')) messageElement.querySelector('.message-content').textContent = 'Failed to get response from server.'; }
};

const sendChatMessage = async (message) => {
  if (!message || !message.trim()) return; const normalized = message.trim(); conversationHistory.push({ role: 'user', text: normalized }); saveConversationHistory(); chatBox.appendChild(createMessage('user', normalized)); const thinking = createMessage('bot', '', 'typing'); chatBox.appendChild(thinking); chatBox.scrollTop = chatBox.scrollHeight; chatInput.value = ''; await performChatRequest(thinking);
};

chatForm?.addEventListener('submit', (e) => { e.preventDefault(); const text = chatInput.value.trim(); if (!text) return; sendChatMessage(text); });
chatInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); chatForm.requestSubmit(); } });

chatBack?.addEventListener('click', () => { window.location.href = 'index.html'; });
clearChatBtn?.addEventListener('click', () => { conversationHistory = []; saveConversationHistory(); chatBox.innerHTML = ''; });

suggestionButtons.forEach((btn) => { btn.addEventListener('click', () => { chatInput.value = btn.textContent; if (suggestionsContainer) suggestionsContainer.style.display = 'none'; chatInput.focus(); }); });

chatInput?.addEventListener('input', () => { if (!suggestionsContainer) return; if (chatInput.value && chatInput.value.trim().length > 0) suggestionsContainer.style.display = 'none'; else suggestionsContainer.style.display = ''; });

chatFontSlider?.addEventListener('input', (event) => { updateChatFontSize(event.target.value); });

window.addEventListener('load', () => {
  loadConversationHistory();
  try { const pending = localStorage.getItem('drivewise-chat-pending'); if (pending) { localStorage.removeItem('drivewise-chat-pending'); sendChatMessage(pending); } } catch (e) { console.warn('Unable to read pending prompt', e); }
  try { const savedSize = localStorage.getItem('drivewise-chat-font-size'); if (savedSize) updateChatFontSize(Number(savedSize)); } catch (e) {}
});
