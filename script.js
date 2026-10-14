
/* =========================================
   NEXA AI - FRONTEND CHATBOT
   Vanilla JavaScript only
========================================= */

// ---------- Get HTML elements ----------
const chatArea = document.getElementById("chatArea");
const welcome = document.getElementById("welcome");
const messagesContainer = document.getElementById("messages");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const historyList = document.getElementById("historyList");
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const themeLabel = document.getElementById("themeLabel");
const newChatBtn = document.getElementById("newChatBtn");
const sidebar = document.getElementById("sidebar");
const menuBtn = document.getElementById("menuBtn");
const closeSidebar = document.getElementById("closeSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

// ---------- Conversation data ----------
let conversations = [];
let activeChatId = null;
let nextId = 1;
let isTyping = false;

// Create a fresh conversation
function createChat() {
  const chat = {
    id: nextId++,
    title: "New conversation",
    messages: []
  };

  conversations.unshift(chat);
  activeChatId = chat.id;

  renderChat();
  renderHistory();
  closeMobileSidebar();
  messageInput.focus();
}

// Get the active conversation
function getActiveChat() {
  return conversations.find(chat => chat.id === activeChatId);
}

// ---------- Render the conversation ----------
function renderChat() {
  const chat = getActiveChat();

  messagesContainer.replaceChildren();

  const hasMessages = chat && chat.messages.length > 0;
  welcome.hidden = hasMessages;

  if (hasMessages) {
    chat.messages.forEach(message => {
      addMessageToDOM(message.role, message.text);
    });
  }

  scrollToBottom();
}

// Create a message element safely
function addMessageToDOM(role, text) {
  const message = document.createElement("div");
  message.className = `message ${role}`;

  if (role === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = "✦";

    message.appendChild(avatar);
  }

  const content = document.createElement("div");
  content.className = "message-content";

  const name = document.createElement("div");
  name.className = "message-name";
  name.textContent = role === "user" ? "You" : "Nexa AI";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  // textContent prevents user messages from being treated as HTML
  bubble.textContent = text;

  content.append(name, bubble);
  message.appendChild(content);
  messagesContainer.appendChild(message);

  return message;
}

// Add a message to data and screen
function addMessage(role, text) {
  const chat = getActiveChat();
  if (!chat) return;

  chat.messages.push({ role, text });

  if (role === "user" && chat.messages.length === 1) {
    chat.title = text.slice(0, 32);
    if (text.length > 32) chat.title += "...";
  }

  if (role === "user") {
    welcome.hidden = true;
  }

  addMessageToDOM(role, text);
  renderHistory();
  scrollToBottom();
}

// ---------- Conversation history ----------
function renderHistory() {
  historyList.replaceChildren();

  // Only show conversations containing messages
  const savedChats = conversations.filter(
    chat => chat.messages.length > 0
  );

  if (savedChats.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Your chats will appear here.";
    empty.style.cssText =
      "padding: 8px; color: var(--muted); font-size: 11px; line-height: 1.6;";
    historyList.appendChild(empty);
    return;
  }

  savedChats.forEach(chat => {
    const button = document.createElement("button");
    button.className = "history-item";

    if (chat.id === activeChatId) {
      button.classList.add("active");
    }

    const symbol = document.createElement("span");
    symbol.className = "history-symbol";
    symbol.textContent = "◷";

    const title = document.createElement("span");
    title.className = "history-title";
    title.textContent = chat.title;

    button.append(symbol, title);

    button.addEventListener("click", () => {
      if (isTyping) return;

      activeChatId = chat.id;
      renderChat();
      renderHistory();
      closeMobileSidebar();
    });

    historyList.appendChild(button);
  });
}

// ---------- Simulated AI responses ----------
function generateReply(message) {
  const text = message.toLowerCase();

  if (/\b(hi|hello|hey|hii|hola)\b/.test(text)) {
    return "Hey there! 👋 I'm Nexa AI, your digital companion. What would you like to explore today?";
  }

  if (text.includes("artificial intelligence") || /\bai\b/.test(text)) {
    return "Artificial Intelligence (AI) is the ability of computer systems to perform tasks that usually require human intelligence, such as understanding language, recognizing patterns, and solving problems.\n\nFor example, a chatbot can use AI to understand your question and generate a relevant response.\n\nWant to explore machine learning or generative AI next?";
  }

  if (text.includes("project") || text.includes("ideas")) {
    return "Here are five project ideas you could explore:\n\n1. Personal expense tracker\n2. AI chatbot interface\n3. Student task planner\n4. Weather dashboard\n5. Cybersecurity awareness quiz\n\nStart with a small version, then add features as you learn. Which idea interests you most?";
  }

  if (text.includes("study") || text.includes("plan my day") || text.includes("schedule")) {
    return "Let's make a simple study plan! 📚\n\n• 25 minutes — Study one concept\n• 5 minutes — Take a break\n• 25 minutes — Solve practice questions\n• 10 minutes — Review what you learned\n\nChoose one clear goal for each session. Consistency matters more than studying everything at once.";
  }

  if (text.includes("computer science") || text.includes("programming") || text.includes("coding")) {
    return "Here's a fascinating computer science concept: recursion! ✨\n\nRecursion happens when a function calls itself to solve smaller versions of the same problem.\n\nThink of opening nested boxes: each box contains a smaller box until you reach the final one. That final box is like the base case, which stops the recursion.\n\nYou can explore recursion, algorithms, databases, or cybersecurity next.";
  }

  if (text.includes("cybersecurity") || text.includes("cyber security") || text.includes("hacking")) {
    return "Cybersecurity is about protecting systems, networks, and data from unauthorized access and attacks. 🔐\n\nA few important areas are:\n\n• Network security\n• Web application security\n• Digital forensics\n• Ethical hacking in authorized labs\n\nA good beginner exercise is learning how passwords are hashed and why multi-factor authentication helps protect accounts.";
  }

  if (text.includes("html") || text.includes("css") || text.includes("javascript")) {
    return "HTML, CSS, and JavaScript have different jobs in a website:\n\n• HTML builds the structure.\n• CSS controls the appearance.\n• JavaScript adds behavior and interactivity.\n\nFor example, HTML creates a button, CSS makes it purple, and JavaScript makes it respond when clicked.";
  }

  if (text.includes("thank")) {
    return "You're very welcome! 💜 I'm glad to help. What shall we explore next?";
  }

  return `That's an interesting question! ✨\n\nIn this demo, I can respond to a few predefined topics, including AI, programming, cybersecurity, study planning, and project ideas.\n\nYour message was: "${message}"\n\nA real AI assistant would connect to an AI model or API to generate a more tailored answer. This frontend currently uses predefined JavaScript responses.`;
}

// ---------- Typing animation ----------
function showTyping() {
  const typingMessage = document.createElement("div");
  typingMessage.className = "message assistant";
  typingMessage.id = "typingIndicator";

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = "✦";

  const content = document.createElement("div");
  content.className = "message-content";

  const name = document.createElement("div");
  name.className = "message-name";
  name.textContent = "Nexa AI is thinking...";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";

  const dots = document.createElement("div");
  dots.className = "typing-dots";

  for (let i = 0; i < 3; i++) {
    dots.appendChild(document.createElement("span"));
  }

  bubble.appendChild(dots);
  content.append(name, bubble);
  typingMessage.append(avatar, content);

  messagesContainer.appendChild(typingMessage);
  scrollToBottom();
}

function removeTyping() {
  document.getElementById("typingIndicator")?.remove();
}

// ---------- Send a message ----------
async function sendMessage(text) {
  const message = text.trim();

  if (!message || isTyping) return;

  if (!activeChatId || !getActiveChat()) {
    createChat();
  }

  addMessage("user", message);

  messageInput.value = "";
  resizeInput();

  isTyping = true;
  sendBtn.disabled = true;
  showTyping();

  // Simulate the time taken to generate a response
  await new Promise(resolve => setTimeout(resolve, 1000));

  removeTyping();

  const reply = generateReply(message);
  addMessage("assistant", reply);

  isTyping = false;
  sendBtn.disabled = false;
  messageInput.focus();
}

// ---------- Form and suggested prompts ----------
chatForm.addEventListener("submit", event => {
  event.preventDefault();
  sendMessage(messageInput.value);
});

document.querySelectorAll(".suggestion-card").forEach(card => {
  card.addEventListener("click", () => {
    sendMessage(card.dataset.prompt);
  });
});

// Send with Enter; use Shift + Enter for a new line
messageInput.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});

// Automatically resize the text box
function resizeInput() {
  messageInput.style.height = "auto";
  messageInput.style.height =
    Math.min(messageInput.scrollHeight, 130) + "px";
}

messageInput.addEventListener("input", resizeInput);

// ---------- New chat ----------
newChatBtn.addEventListener("click", () => {
  if (isTyping) return;
  createChat();
});

// ---------- Dark/light theme ----------
function setTheme(isLight) {
  document.body.classList.toggle("light", isLight);

  themeIcon.textContent = isLight ? "☾" : "☼";
  themeLabel.textContent = isLight ? "Dark mode" : "Light mode";
  themeBtn.setAttribute(
    "aria-label",
    isLight ? "Switch to dark mode" : "Switch to light mode"
  );
}

themeBtn.addEventListener("click", () => {
  setTheme(!document.body.classList.contains("light"));
});

// ---------- Mobile sidebar ----------
function openMobileSidebar() {
  sidebar.classList.add("open");
  sidebarOverlay.classList.add("show");
}

function closeMobileSidebar() {
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("show");
}

menuBtn.addEventListener("click", openMobileSidebar);
closeSidebar.addEventListener("click", closeMobileSidebar);
sidebarOverlay.addEventListener("click", closeMobileSidebar);

// ---------- Helpers ----------
function scrollToBottom() {
  requestAnimationFrame(() => {
    chatArea.scrollTop = chatArea.scrollHeight;
  });
}

// ---------- Start the application ----------
createChat();
