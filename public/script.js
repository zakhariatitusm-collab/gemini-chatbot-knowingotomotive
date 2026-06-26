const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const suggestionButtons = document.querySelectorAll('.suggestion-button');
const langToggle = document.getElementById('lang-toggle');

const translations = {
  en: {
    home: 'Home',
    features: 'Features',
    chat: 'AI Chat',
    about: 'About',
    heroEyebrow: 'AI Automotive Assistant',
    heroTitle: 'Drive Smarter.<br />Own Better.',
    heroSubtitle: 'Your intelligent automotive assistant that helps you buy, sell, compare, finance, maintain, and modify vehicles using AI.',
    heroStart: 'Start Consultation',
    heroLearn: 'Learn More',
    heroTag: 'Premium AI Assistant',
    heroPanelTitle: 'DriveWise AI',
    heroPanelText: 'Get faster vehicle recommendations, financing guidance, and maintenance advice in one place.',
    statAccuracy: 'Accuracy',
    statResponse: 'Response time',
    statSupport: 'Support',
    coreFeatures: 'Core Features',
    coreTitle: 'Everything you need for smarter vehicle ownership.',
    feature1title: 'Buy Vehicle',
    feature1desc: 'Get tailored recommendations for cars and motorcycles.',
    feature2title: 'Sell Vehicle',
    feature2desc: 'Estimate pricing and optimize your sale strategy.',
    feature3title: 'Finance Calculator',
    feature3desc: 'Simulate installments, DP, tenor, and affordability.',
    feature4title: 'Compare Vehicle',
    feature4desc: 'Evaluate options side by side with intelligent analysis.',
    feature5title: 'Maintenance & Modification',
    feature5desc: 'Receive practical advice for upkeep and upgrades.',
    feature6title: 'AI Automotive Chat',
    feature6desc: 'Talk to an expert assistant for any vehicle question.',
    partsEyebrow: 'Autoparts',
    partsTitle: 'Automotive parts and systems',
    part1title: 'Engine',
    part1desc: 'Understand key components that power your ride.',
    part2title: 'Tires',
    part2desc: 'Choose the right tires for grip and comfort.',
    part3title: 'Brakes',
    part3desc: 'Keep stopping power reliable and safe.',
    part4title: 'Battery',
    part4desc: 'Monitor energy and electrical health.',
    chatHeader: 'AI Chat',
    userPlaceholder: 'Ask DriveWise AI anything...',
    chatTitle: 'Talk to DriveWise AI',
    chatDescription: 'Ask about buying, selling, financing, maintenance, or vehicle recommendations. The assistant is ready.',
    sendButton: 'Send',
    formHelp: 'Press Enter to send, Shift + Enter for a new line.',
    floatButton: 'Chat with DriveWise',
    widgetTitle: 'DriveWise Mini Chat',
    widgetFull: 'Full',
    widgetMinimize: 'Minimize',
    suggest1: 'Recommend a motorcycle under Rp35 million',
    suggest2: 'Compare Honda PCX and Yamaha NMAX',
    suggest3: 'Calculate installment for a Rp250 million car',
    suggest4: 'Estimate my vehicle selling price',
    suggest5: 'Recommend the best engine oil',
    overlayTitle: 'DriveWise Chat',
    overlaySubtitle: 'Continue your current conversation in full screen.',
    aboutTitle: 'Built for premium automotive decisions.',
    aboutText: 'DriveWise AI helps you make intelligent choices across buying, selling, financing, maintenance, modifications, and spare part recommendations—all in a modern conversational experience.',
    carLabel: 'Car',
    bikeLabel: 'Motor',
  },
  id: {
    home: 'Beranda',
    features: 'Fitur',
    chat: 'AI Chat',
    about: 'Tentang',
    heroEyebrow: 'Asisten Otomotif AI',
    heroTitle: 'Berkendara Lebih Pintar.<br />Miliki Lebih Baik.',
    heroSubtitle: 'Asisten otomotif pintar yang membantu Anda membeli, menjual, membandingkan, membiayai, merawat, dan memodifikasi kendaraan dengan AI.',
    heroStart: 'Mulai Konsultasi',
    heroLearn: 'Pelajari Lebih Lanjut',
    heroTag: 'Asisten AI Premium',
    heroPanelTitle: 'DriveWise AI',
    heroPanelText: 'Dapatkan rekomendasi kendaraan, panduan pembiayaan, dan saran perawatan dengan cepat.',
    statAccuracy: 'Akurasi',
    statResponse: 'Waktu respons',
    statSupport: 'Dukungan',
    coreFeatures: 'Fitur Utama',
    coreTitle: 'Semua yang Anda butuhkan untuk kepemilikan kendaraan lebih cerdas.',
    feature1title: 'Beli Kendaraan',
    feature1desc: 'Dapatkan rekomendasi khusus untuk mobil dan motor.',
    feature2title: 'Jual Kendaraan',
    feature2desc: 'Perkirakan harga dan optimalkan strategi penjualan Anda.',
    feature3title: 'Kalkulator Pembiayaan',
    feature3desc: 'Simulasikan cicilan, DP, tenor, dan kemampuan bayar.',
    feature4title: 'Bandingkan Kendaraan',
    feature4desc: 'Evaluasi pilihan secara berdampingan dengan analisis cerdas.',
    feature5title: 'Perawatan & Modifikasi',
    feature5desc: 'Dapatkan saran praktis untuk pemeliharaan dan upgrade.',
    feature6title: 'Chat Otomotif AI',
    feature6desc: 'Berbicaralah dengan asisten ahli untuk pertanyaan kendaraan apa pun.',
    partsEyebrow: 'Suku Cadang',
    partsTitle: 'Bagian dan sistem otomotif',
    part1title: 'Mesin',
    part1desc: 'Pahami komponen penting yang menggerakkan kendaraan Anda.',
    part2title: 'Ban',
    part2desc: 'Pilih ban terbaik untuk cengkeraman dan kenyamanan.',
    part3title: 'Rem',
    part3desc: 'Pastikan daya berhenti tetap andal dan aman.',
    part4title: 'Aki',
    part4desc: 'Pantau energi dan kesehatan kelistrikan.',
    chatHeader: 'AI Chat',
    userPlaceholder: 'Tanyakan apa saja ke DriveWise AI...',
    chatTitle: 'Bicara dengan DriveWise AI',
    chatDescription: 'Tanyakan tentang membeli, menjual, pembiayaan, perawatan, atau rekomendasi kendaraan. Asisten siap membantu.',
    sendButton: 'Kirim',
    formHelp: 'Tekan Enter untuk kirim, Shift + Enter untuk baris baru.',
    floatButton: 'Chat dengan DriveWise',
    widgetTitle: 'DriveWise Mini Chat',
    widgetFull: 'Layar penuh',
    widgetMinimize: 'Minimalisir',
    suggest1: 'Rekomendasikan motor di bawah Rp35 juta',
    suggest2: 'Bandingkan Honda PCX dan Yamaha NMAX',
    suggest3: 'Hitung cicilan mobil Rp250 juta',
    suggest4: 'Perkirakan harga jual kendaraan saya',
    suggest5: 'Rekomendasikan oli mesin terbaik',
    overlayTitle: 'Chat DriveWise',
    overlaySubtitle: 'Lanjutkan percakapan yang sedang berjalan secara layar penuh.',
    aboutTitle: 'Dibangun untuk keputusan otomotif premium.',
    aboutText: 'DriveWise AI membantu Anda membuat pilihan cerdas dalam membeli, menjual, membiayai, merawat, memodifikasi, dan merekomendasikan suku cadang dalam pengalaman percakapan modern.',
    carLabel: 'Mobil',
    bikeLabel: 'Motor',
  },
};

let currentLang = 'en';

const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const createMessage = (role, content, status = 'normal') => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', role);

  const avatar = document.createElement('div');
  avatar.classList.add('avatar', role);
  avatar.textContent = role === 'user' ? 'U' : 'AI';

  const contentWrap = document.createElement('div');
  contentWrap.classList.add('message-content');
  if (status === 'typing') {
    contentWrap.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
  } else {
    contentWrap.textContent = content;
  }

  const meta = document.createElement('div');
  meta.classList.add('message-meta');
  meta.textContent = formatTime();

  const row = document.createElement('div');
  row.classList.add('message-row');
  row.appendChild(avatar);
  row.appendChild(contentWrap);

  messageElement.appendChild(row);
  messageElement.appendChild(meta);
  return messageElement;
};

const applyTranslations = () => {
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (!key) return;
    const value = translations[currentLang]?.[key];
    if (!value) return;

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'BUTTON') {
      element.placeholder = value;
      if (element.tagName === 'BUTTON') {
        element.textContent = value;
      }
      return;
    }

    if (element.tagName === 'A' || element.tagName === 'P' || element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3' || element.tagName === 'H4' || element.tagName === 'SPAN' || element.tagName === 'DIV') {
      element.innerHTML = value;
    }
  });

  document.querySelectorAll('.suggestion-button').forEach((button) => {
    const suggestionKey = button.getAttribute('data-suggest');
    const suggestionText = translations[currentLang]?.[suggestionKey];
    if (suggestionKey && suggestionText) {
      button.textContent = suggestionText;
    }
  });

  langToggle.textContent = currentLang === 'en' ? 'ID' : 'EN';
};

const toggleLanguage = () => {
  currentLang = currentLang === 'en' ? 'id' : 'en';
  updateLocale();
};

const suggestionTexts = {
  en: {
    suggest1: 'Recommend a motorcycle under Rp35 million',
    suggest2: 'Compare Honda PCX and Yamaha NMAX',
    suggest3: 'Calculate installment for a Rp250 million car',
    suggest4: 'Estimate my vehicle selling price',
    suggest5: 'Recommend the best engine oil',
  },
  id: {
    suggest1: 'Rekomendasikan motor di bawah Rp35 juta',
    suggest2: 'Bandingkan Honda PCX dan Yamaha NMAX',
    suggest3: 'Hitung cicilan mobil Rp250 juta',
    suggest4: 'Perkirakan harga jual kendaraan saya',
    suggest5: 'Rekomendasikan oli mesin terbaik',
  },
};

const applySuggestionText = () => {
  suggestionButtons.forEach((button) => {
    const key = button.getAttribute('data-suggest');
    if (key && suggestionTexts[currentLang]?.[key]) {
      button.textContent = suggestionTexts[currentLang][key];
    }
  });
};

const hideSuggestions = () => {
  document.querySelectorAll('.suggestions').forEach((element) => {
    element.style.display = 'none';
  });
};

const chatOverlay = document.getElementById('chat-overlay');
const chatOverlayBody = document.getElementById('chat-overlay-body');
const chatShell = document.getElementById('chat-shell');
const chatShellPlaceholder = document.getElementById('chat-shell-placeholder');
const chatFloatButton = document.getElementById('chat-float-button');
const chatWidget = document.getElementById('chat-widget');
const chatWidgetBody = document.getElementById('chat-widget-body');
const chatWidgetFull = document.getElementById('chat-widget-full');
const chatWidgetMinimize = document.getElementById('chat-widget-minimize');
const chatOverlayClose = document.getElementById('chat-overlay-close');

let widgetState = 'closed';
let previousWidgetState = 'closed';

const updateLocale = () => {
  applyTranslations();
  applySuggestionText();
};

const appendChatShell = (container) => {
  if (!container || !chatShell) return;
  container.appendChild(chatShell);
};

const openWidget = () => {
  if (!chatWidget || !chatWidgetBody) return;
  chatWidget.classList.remove('hidden', 'collapsed');
  chatWidget.setAttribute('aria-hidden', 'false');
  appendChatShell(chatWidgetBody);
  widgetState = 'open';
};

const minimizeWidget = () => {
  if (!chatWidget) return;
  chatWidget.classList.remove('hidden');
  chatWidget.classList.add('collapsed');
  chatWidget.setAttribute('aria-hidden', 'false');
  widgetState = 'minimized';
};

const closeWidget = () => {
  if (!chatWidget || !chatShellPlaceholder) return;
  chatWidget.classList.add('hidden');
  chatWidget.classList.remove('collapsed');
  chatWidget.setAttribute('aria-hidden', 'true');
  appendChatShell(chatShellPlaceholder);
  widgetState = 'closed';
};

const toggleWidget = () => {
  if (widgetState === 'closed' || widgetState === 'minimized') {
    openWidget();
  } else {
    minimizeWidget();
  }
};

const openChatOverlay = () => {
  if (!chatOverlay || !chatOverlayBody || !chatShell || !chatWidget) return;
  previousWidgetState = widgetState;
  chatOverlay.classList.remove('hidden');
  chatOverlay.setAttribute('aria-hidden', 'false');
  chatWidget.classList.add('hidden');
  appendChatShell(chatOverlayBody);
  widgetState = 'fullscreen';
};

const closeChatOverlay = () => {
  if (!chatOverlay || !chatShell || !chatShellPlaceholder) return;
  chatOverlay.classList.add('hidden');
  chatOverlay.setAttribute('aria-hidden', 'true');

  if (previousWidgetState === 'open' || previousWidgetState === 'minimized') {
    if (chatWidget) {
      chatWidget.classList.remove('hidden');
    }
    appendChatShell(chatWidgetBody);
    widgetState = previousWidgetState;
    if (previousWidgetState === 'minimized' && chatWidget) {
      chatWidget.classList.add('collapsed');
    }
  } else {
    appendChatShell(chatShellPlaceholder);
    widgetState = 'closed';
  }
};

langToggle?.addEventListener('click', toggleLanguage);
chatFloatButton?.addEventListener('click', toggleWidget);
chatWidgetFull?.addEventListener('click', openChatOverlay);
chatWidgetMinimize?.addEventListener('click', minimizeWidget);
chatOverlayClose?.addEventListener('click', closeChatOverlay);
chatOverlay?.addEventListener('click', (event) => {
  if (event.target === chatOverlay) {
    closeChatOverlay();
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) {
    return;
  }

  hideSuggestions();
  chatBox.appendChild(createMessage('user', userMessage));
  input.value = '';

  const thinkingMessage = createMessage('bot', '', 'typing');
  chatBox.appendChild(thinkingMessage);
  chatBox.scrollTop = chatBox.scrollHeight;

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

    updateMessageText(thinkingMessage, resultText || 'Sorry, no response received.');
  } catch (error) {
    console.error('Chat request failed:', error);
    updateMessageText(thinkingMessage, 'Failed to get response from server.');
  }
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

suggestionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    input.value = button.textContent;
    input.focus();
  });
});

updateLocale();

function updateMessageText(messageElement, text) {
  if (!messageElement) {
    chatBox.appendChild(createMessage('bot', text));
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }

  const content = messageElement.querySelector('.message-content');
  if (content) {
    content.textContent = text;
  }
  const meta = messageElement.querySelector('.message-meta');
  if (meta) {
    meta.textContent = formatTime();
  }
  chatBox.scrollTop = chatBox.scrollHeight;
}
