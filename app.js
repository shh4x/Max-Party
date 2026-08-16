// ============================================================
//  MAX PARTY - App completa
//  Versión 1.0
// ============================================================

// ===== DATOS =====
const data = {
  usuario: {
    nombre: 'MaxUser',
    nivel: 1,
    puntos: 0,
    online: true
  },
  clanes: [
    { id: 1, nombre: '🎮 Gamers', activo: true },
    { id: 2, nombre: '🎵 Music Lovers', activo: false },
    { id: 3, nombre: '🎨 Artists', activo: false },
    { id: 4, nombre: '💻 Developers', activo: false }
  ],
  usuarios: [
    { nombre: 'MaxUser', online: true },
    { nombre: 'Ana_Dev', online: true },
    { nombre: 'CarlosG', online: false },
    { nombre: 'Laura_M', online: true },
    { nombre: 'PedroCode', online: false }
  ],
  mensajes: [
    { usuario: 'MaxUser', texto: '¡Bienvenidos a Max Party! 🎉', hora: new Date() },
    { usuario: 'Ana_Dev', texto: '¡Qué chévere esta app!', hora: new Date(Date.now() - 60000) }
  ]
};

// ===== ELEMENTOS DOM =====
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const notification = $('notification');
const clanesList = $('clanes-list');
const chatMessages = $('chat-messages');
const chatInput = $('chat-input');
const sendBtn = $('send-btn');
const emojiBtn = $('emoji-btn');
const emojiPicker = $('emoji-picker');
const usersList = $('users-list');
const perfilNombre = $('perfil-nombre');
const perfilNivel = $('perfil-nivel');
const perfilPuntos = $('perfil-puntos');
const configPanel = $('config-panel');
const settingsBtn = $('settings-btn');
const closeConfig = $('close-config');
const temaSelect = $('tema-select');
const tabs = $$('.tab-btn');
const tabContents = $$('.tab-content');

// ===== FUNCIONES =====

// Notificaciones
function showNotification(msg, tipo = 'info') {
  notification.textContent = msg;
  notification.style.borderLeftColor = tipo === 'error' ? '#e74c3c' : '#2ecc71';
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3500);
}

// Renderizar clanes
function renderClanes() {
  clanesList.innerHTML = '';
  data.clanes.forEach(clan => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="clan-icon">${clan.nombre.charAt(0)}</span>
      <span>${clan.nombre}</span>
      ${clan.activo ? ' <span style="margin-left:auto;color:#2ecc71;">●</span>' : ''}
    `;
    li.dataset.id = clan.id;
    if (clan.activo) li.classList.add('active');
    li.addEventListener('click', () => switchClan(clan.id));
    clanesList.appendChild(li);
  });
}

// Cambiar clan activo
function switchClan(id) {
  data.clanes.forEach(c => c.activo = (c.id === id));
  renderClanes();
  showNotification(`Cambiaste al clan: ${data.clanes.find(c => c.id === id).nombre}`);
}

// Agregar clan
function addClan() {
  const nombre = prompt('Nombre del nuevo clan:');
  if (nombre && nombre.trim()) {
    const id = Date.now();
    data.clanes.forEach(c => c.activo = false);
    data.clanes.push({ id, nombre: nombre.trim(), activo: true });
    renderClanes();
    showNotification(`¡Clan "${nombre.trim()}" creado! 🎉`);
  }
}

// Renderizar mensajes
function renderMensajes() {
  chatMessages.innerHTML = '';
  data.mensajes.forEach(msg => {
    const li = document.createElement('li');
    const hora = msg.hora.toLocaleTimeString();
    li.innerHTML = `
      <span class="msg-user">${msg.usuario}</span>
      <span class="msg-content">${msg.texto}</span>
      <span class="msg-time">${hora}</span>
    `;
    chatMessages.appendChild(li);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Enviar mensaje
function sendMessage() {
  const texto = chatInput.value.trim();
  if (!texto) return;
  
  data.mensajes.push({
    usuario: data.usuario.nombre,
    texto: texto,
    hora: new Date()
  });
  
  // Ganar XP por mensaje
  data.usuario.puntos += 5;
  actualizarNivel();
  
  renderMensajes();
  chatInput.value = '';
  chatInput.focus();
}

// Renderizar usuarios
function renderUsuarios() {
  usersList.innerHTML = '';
  data.usuarios.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="status ${user.online ? 'online' : 'offline'}"></span>
      <span>${user.nombre}</span>
      ${user.online ? ' <span style="margin-left:auto;color:#2ecc71;font-size:0.8rem;">Conectado</span>' : ' <span style="margin-left:auto;color:#666;font-size:0.8rem;">Offline</span>'}
    `;
    usersList.appendChild(li);
  });
}

// Sistema de niveles
function actualizarNivel() {
  const puntos = data.usuario.puntos;
  let nivel = 1;
  const nivelesXP = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000];
  
  for (let i = nivelesXP.length - 1; i >= 0; i--) {
    if (puntos >= nivelesXP[i]) {
      nivel = i + 1;
      break;
    }
  }
  
  data.usuario.nivel = nivel;
  perfilNivel.textContent = nivel;
  perfilPuntos.textContent = puntos;
}

// Actualizar perfil
function actualizarPerfil() {
  perfilNombre.value = data.usuario.nombre;
  perfilNivel.textContent = data.usuario.nivel;
  perfilPuntos.textContent = data.usuario.puntos;
}

// Cambiar tema
function cambiarTema(tema) {
  document.body.className = '';
  if (tema !== 'oscuro') {
    document.body.classList.add(`tema-${tema}`);
  }
  localStorage.setItem('maxparty-tema', tema);
}

// Cambiar pestaña
function switchTab(tabId) {
  tabs.forEach(t => t.classList.remove('active'));
  tabContents.forEach(c => c.classList.remove('active'));
  
  const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  const content = $(tabId);
  
  if (tabBtn) tabBtn.classList.add('active');
  if (content) content.classList.add('active');
}

// ===== EVENTOS =====

// Enviar mensaje (click y Enter)
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Emojis
emojiBtn.addEventListener('click', () => {
  emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'flex' : 'none';
});

emojiPicker.addEventListener('click', (e) => {
  if (e.target.tagName === 'SPAN') {
    chatInput.value += e.target.textContent;
    chatInput.focus();
  }
});

// Pestañas
tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;
    switchTab(tabId);
  });
});

// Configuración
settingsBtn.addEventListener('click', () => configPanel.classList.add('show'));
closeConfig.addEventListener('click', () => configPanel.classList.remove('show'));
configPanel.addEventListener('click', (e) => {
  if (e.target === configPanel) configPanel.classList.remove('show');
});

temaSelect.addEventListener('change', (e) => {
  cambiarTema(e.target.value);
  showNotification(`Tema cambiado a: ${e.target.options[e.target.selectedIndex].text}`);
});

// Nombre de perfil
perfilNombre.addEventListener('change', (e) => {
  const nuevo = e.target.value.trim();
  if (nuevo) {
    data.usuario.nombre = nuevo;
    showNotification(`Nombre actualizado a: ${nuevo}`);
  } else {
    e.target.value = data.usuario.nombre;
  }
});

// Nuevo clan
document.querySelector('#add-clan-btn').addEventListener('click', addClan);

// ===== INICIALIZACIÓN =====

function init() {
  // Cargar tema guardado
  const temaGuardado = localStorage.getItem('maxparty-tema') || 'oscuro';
  temaSelect.value = temaGuardado;
  cambiarTema(temaGuardado);
  
  // Renderizar todo
  renderClanes();
  renderMensajes();
  renderUsuarios();
  actualizarPerfil();
  
  // Pestaña por defecto: Chat
  switchTab('chat');
  
  showNotification('¡Bienvenido a Max Party! 🎉', 'info');
}

// Iniciar app
init();

// Simular usuarios conectados/desconectados aleatoriamente
setInterval(() => {
  data.usuarios.forEach(user => {
    if (user.nombre !== 'MaxUser') {
      user.online = Math.random() > 0.3;
    }
  });
  renderUsuarios();
}, 15000);
