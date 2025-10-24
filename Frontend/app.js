// Frontend app (vanilla JS) - improved UX + integration
// Place in Wheels/frontend/app.js
// NOTE: API_BASE default points to localhost:5000. If backend is served same origin, change to '/api'.

const API_BASE = window.__API_BASE__ || 'https://wheels-9og0.onrender.com';

//
// Helpers
//
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const sleep = ms => new Promise(r => setTimeout(r, ms));

function toast(message, type = 'default') {
  const root = $('#toasts');
  if (!root) return;
  const t = document.createElement('div');
  t.className = 'toast ' + (type === 'success' ? 'success' : type === 'error' ? 'error' : '');
  t.textContent = message;
  root.appendChild(t);
  setTimeout(() => t.remove(), 4200);
}

function showLoader(el) { el.classList.remove('hidden'); }
function hideLoader(el) { el.classList.add('hidden'); }

function setToken(token, user) {
  if (token) {
    localStorage.setItem('wheels_token', token);
    localStorage.setItem('wheels_user', JSON.stringify(user || {}));
  } else {
    localStorage.removeItem('wheels_token');
    localStorage.removeItem('wheels_user');
  }
}

function getToken() { return localStorage.getItem('wheels_token'); }
function getUser() { return JSON.parse(localStorage.getItem('wheels_user') || 'null'); }

//
// DOM refs
//
const authArea = $('#auth-area');
const appArea = $('#app-area');
const btnLogin = $('#btn-login');
const btnRegister = $('#btn-register');
const btnLogout = $('#btn-logout');
const btnCreateTravel = $('#btn-create-travel');
const btnProfile = $('#btn-profile');
const btnSearch = $('#btn-search');
const filterStart = $('#filter-start');
const filterEnd = $('#filter-end');
const filterSeats = $('#filter-seats');
const travelsList = $('#travels-list');
const loaderTop = $('#loader-top');
const welcome = $('#welcome');
const userNameEl = $('#user-name');

const modalsRoot = $('#modals-root');

//
// Wire UI
//
btnLogin.addEventListener('click', () => renderAuth('login'));
btnRegister.addEventListener('click', () => renderAuth('register'));
btnLogout.addEventListener('click', logout);
btnCreateTravel.addEventListener('click', renderCreateTravel);
btnProfile.addEventListener('click', renderProfile);
btnSearch.addEventListener('click', fetchAndRenderTravels);

//
// Init
//
init();

function init() {
  const token = getToken();
  if (token) {
    showAppView();
    hydrateUser();
    fetchAndRenderTravels();
  } else {
    showAuthView();
  }
}

//
// Views
//
function showAuthView() {
  authArea.classList.remove('hidden');
  appArea.classList.add('hidden');
  $('#nav-auth').classList.remove('authed');
  welcome.classList.add('hidden');
  btnLogout.classList.add('hidden');
  // default render login
  renderAuth('login');
}

function showAppView() {
  authArea.classList.add('hidden');
  appArea.classList.remove('hidden');
  $('#nav-auth').classList.add('authed');
  const user = getUser();
  if (user && user.name) {
    welcome.classList.remove('hidden');
    userNameEl.textContent = user.name;
  }
  btnLogout.classList.remove('hidden');
}

function hydrateUser() {
  const user = getUser();
  if (user && user.name) {
    welcome.classList.remove('hidden');
    userNameEl.textContent = user.name;
  }
}

//
// AUTH forms
//
function renderAuth(mode = 'login') {
  authArea.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';

  const title = document.createElement('h3');
  title.textContent = mode === 'login' ? 'Iniciar sesión' : 'Registro';
  card.appendChild(title);

  const form = document.createElement('form');
  form.className = 'form';

  if (mode === 'register') {
    // role selector
    const roleWrap = document.createElement('div');
    roleWrap.style.display = 'flex';
    roleWrap.style.gap = '8px';
    roleWrap.style.marginBottom = '8px';

    const driver = document.createElement('button');
    driver.type = 'button';
    driver.className = 'btn';
    driver.textContent = 'Conductor';
    const passenger = document.createElement('button');
    passenger.type = 'button';
    passenger.className = 'btn ghost';
    passenger.textContent = 'Pasajero';

    roleWrap.appendChild(driver);
    roleWrap.appendChild(passenger);
    card.appendChild(roleWrap);

    let currentRole = 'passenger';
    driver.addEventListener('click', () => {
      currentRole = 'driver';
      driver.classList.remove('ghost'); passenger.classList.add('ghost');
      vehicleFields.classList.remove('hidden');
    });
    passenger.addEventListener('click', () => {
      currentRole = 'passenger';
      passenger.classList.remove('ghost'); driver.classList.add('ghost');
      vehicleFields.classList.add('hidden');
    });

    // basic user fields
    const name = input('text', 'Nombre', 'reg-name');
    const surname = input('text', 'Apellido', 'reg-surname');
    const universityId = input('text', 'ID Universidad', 'reg-uni');
    const email = input('email', 'Correo corporativo', 'reg-email');
    const phone = input('text', 'Teléfono', 'reg-phone');
    const password = input('password', 'Contraseña (mín 8 caracteres)', 'reg-pass');

    form.append(name, surname, universityId, email, phone, password);

    // vehicle fields (hidden by default)
    const vehicleFields = document.createElement('div');
    vehicleFields.className = 'hidden';
    vehicleFields.style.marginTop = '8px';
    vehicleFields.appendChild(input('text', 'Placa', 'reg-plate'));
    vehicleFields.appendChild(input('number', 'Capacidad', 'reg-capacity'));
    vehicleFields.appendChild(input('text', 'Marca', 'reg-brand'));
    vehicleFields.appendChild(input('text', 'Modelo', 'reg-model'));

    form.appendChild(vehicleFields);

    const submit = document.createElement('button');
    submit.className = 'btn primary';
    submit.type = 'submit';
    submit.textContent = 'Crear cuenta';
    form.appendChild(submit);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // validations
      if (password.value.length < 8) return toast('Contraseña demasiado corta', 'error');
      if (!validateEmail(email.value)) return toast('Email inválido', 'error');
      // build payload
      const payload = {
        name: name.value, surname: surname.value, universityId: universityId.value,
        email: email.value, contactNumber: phone.value, password: password.value, role: currentRole
      };
      if (currentRole === 'driver') {
        payload.vehicle = {
          plate: $('#reg-plate').value,
          capacity: Number($('#reg-capacity').value || 0),
          brand: $('#reg-brand').value,
          model: $('#reg-model').value
        };
      }
      submit.disabled = true; submit.textContent = 'Registrando...';
      const res = await apiPost('/auth/register', payload);
      submit.disabled = false; submit.textContent = 'Crear cuenta';
      if (!res) return toast('Error de red', 'error');
      if (res && res.success) {
        toast('Registro exitoso', 'success');
        renderAuth('login');
      } else {
        toast(res.message || 'Error en registro', 'error');
      }
    });

  } else {
    // login form
    const email = input('email', 'Correo', 'login-email');
    const password = input('password', 'Contraseña', 'login-pass');
    form.append(email, password);

    const submit = document.createElement('button');
    submit.className = 'btn primary';
    submit.type = 'submit';
    submit.textContent = 'Iniciar sesión';
    form.appendChild(submit);

    const forgot = document.createElement('div');
    forgot.className = 'small muted';
    forgot.style.marginTop = '8px';
    forgot.textContent = '¿Olvidaste tu contraseña? (no implementado)';
    form.appendChild(forgot);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateEmail(email.value)) return toast('Email inválido', 'error');
      submit.disabled = true; submit.textContent = 'Validando...';
      const res = await apiPost('/auth/login', { email: email.value, password: password.value });
      submit.disabled = false; submit.textContent = 'Iniciar sesión';
      if (!res) return toast('Error de red', 'error');
      if (res && res.token) {
        setToken(res.token, res.user);
        toast('Bienvenido ' + (res.user.name || ''));
        showAppView();
        hydrateUser();
        fetchAndRenderTravels();
      } else {
        toast(res.message || 'Credenciales inválidas', 'error');
      }
    });
  }

  card.appendChild(form);
  authArea.innerHTML = '';
  authArea.appendChild(card);

  function input(type, placeholder, id) {
    const el = document.createElement('input');
    el.type = type;
    el.placeholder = placeholder;
    if (id) el.id = id;
    el.className = 'input';
    el.style.marginTop = '8px';
    return el;
  }
}

//
// Travel list
//
async function fetchAndRenderTravels() {
  travelsList.innerHTML = '';
  showLoader(loaderTop);

  const params = new URLSearchParams();
  if (filterStart.value) params.set('startPoint', filterStart.value);
  if (filterEnd.value) params.set('endPoint', filterEnd.value);
  if (filterSeats.value) params.set('seats', filterSeats.value);

  const res = await apiGet('/travel/available?' + params.toString());
  hideLoader(loaderTop);
  if (!res) return toast('Error de red al obtener viajes', 'error');
  const items = res.items || [];
  if (!items.length) {
    travelsList.innerHTML = `<div class="muted">No hay viajes que coincidan.</div>`;
    return;
  }

  items.forEach(t => {
    const node = document.createElement('div');
    node.className = 'travel';
    const left = document.createElement('div');
    left.className = 'travel-left';
    const av = document.createElement('div'); av.className = 'avatar'; av.textContent = (t.driverName || t.driver?.name || (t.route||'V'));
    const meta = document.createElement('div'); meta.className = 'travel-meta';
    const title = document.createElement('div'); title.innerHTML = `<strong>${t.route || (t.startPoint + ' → ' + t.endPoint)}</strong>`;
    const sub = document.createElement('small'); sub.textContent = `Salida: ${new Date(t.departureTime).toLocaleString()} • Tarifa: $${t.fare}`;
    meta.append(title, sub);
    left.append(av, meta);

    const right = document.createElement('div'); right.className = 'travel-right';
    const badge = document.createElement('span');
    badge.className = 'badge ' + (t.availableSeats > 0 ? 'available' : 'full');
    badge.textContent = t.availableSeats > 0 ? `${t.availableSeats} cupos` : 'Lleno';
    const btns = document.createElement('div');
    btns.style.display = 'flex'; btns.style.gap = '8px';

    const detailsBtn = document.createElement('button'); detailsBtn.className = 'btn outline'; detailsBtn.textContent = 'Detalles';
    detailsBtn.addEventListener('click', () => renderTravelDetails(t));
    const reserveBtn = document.createElement('button'); reserveBtn.className = 'btn'; reserveBtn.textContent = 'Reservar';
    if (t.availableSeats <= 0) reserveBtn.disabled = true;
    reserveBtn.addEventListener('click', async () => {
      const seats = Number(prompt('¿Cuántos asientos quieres reservar?', '1'));
      if (!seats || seats < 1) return;
      reserveBtn.disabled = true; reserveBtn.textContent = 'Reservando...';
      const r = await apiPost('/travel/reserve', { travelId: t._id || t.id, seats, pickupPoint: 'Parada 1' });
      reserveBtn.disabled = false; reserveBtn.textContent = 'Reservar';
      if (!r) return toast('Error de red al reservar', 'error');
      if (r.success) { toast('Reserva confirmada', 'success'); fetchAndRenderTravels(); }
      else toast(r.message || 'No fue posible reservar', 'error');
    });

    btns.appendChild(detailsBtn);
    btns.appendChild(reserveBtn);
    right.appendChild(badge);
    right.appendChild(btns);

    node.appendChild(left);
    node.appendChild(right);

    travelsList.appendChild(node);
  });
}

function renderTravelDetails(t) {
  const m = createModal(`Detalles del viaje`);
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <p><strong>Ruta:</strong> ${t.route || t.startPoint + ' → ' + t.endPoint}</p>
    <p><strong>Salida:</strong> ${new Date(t.departureTime).toLocaleString()}</p>
    <p><strong>Tarifa:</strong> $${t.fare}</p>
    <p><strong>Cupos:</strong> ${t.availableSeats}</p>
  `;
  const mapBtn = document.createElement('button'); mapBtn.className = 'btn outline'; mapBtn.textContent = 'Ver mapa';
  mapBtn.addEventListener('click', () => toast('Mapa no implementado', 'error'));
  wrap.appendChild(mapBtn);
  m.setContent(wrap);
}

//
// Create travel
//
function renderCreateTravel() {
  const m = createModal('Crear viaje');
  const form = document.createElement('form');
  form.className = 'form';

  const start = elemInput('text', 'Punto de inicio', 'tv-start');
  const end = elemInput('text', 'Punto final', 'tv-end');
  const route = elemInput('text', 'Ruta (opcional)', 'tv-route');
  const time = elemInput('datetime-local', 'Hora de salida', 'tv-time');
  const seats = elemInput('number', 'Cupos disponibles', 'tv-seats');
  seats.min = 1;
  const fare = elemInput('number', 'Tarifa', 'tv-fare');
  fare.step = '0.01';
  const submit = document.createElement('button'); submit.className = 'btn primary'; submit.textContent = 'Crear viaje';
  form.append(start, end, route, time, seats, fare, submit);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submit.disabled = true; submit.textContent = 'Creando...';
    const payload = {
      startPoint: $('#tv-start').value,
      endPoint: $('#tv-end').value,
      route: $('#tv-route').value,
      departureTime: new Date($('#tv-time').value).toISOString(),
      availableSeats: Number($('#tv-seats').value),
      fare: Number($('#tv-fare').value)
    };
    const res = await apiPost('/travel/create', payload);
    submit.disabled = false; submit.textContent = 'Crear viaje';
    if (!res) return toast('Error de red', 'error');
    if (res.success) {
      toast('Viaje creado', 'success'); m.close(); fetchAndRenderTravels();
    } else toast(res.message || 'Error creando viaje', 'error');
  });

  m.setContent(form);
}

//
// Profile
//
function renderProfile() {
  const m = createModal('Perfil');
  const user = getUser() || {};
  const wrap = document.createElement('div');
  const form = document.createElement('form');

  const name = elemInput('text', 'Nombre', 'pf-name'); name.value = user.name || '';
  const surname = elemInput('text', 'Apellido', 'pf-surname'); surname.value = user.surname || '';
  const phone = elemInput('text', 'Teléfono', 'pf-phone'); phone.value = user.contactNumber || '';
  const role = elemSelect('pf-role', [{v:'passenger',t:'Pasajero'},{v:'driver',t:'Conductor'}]);
  role.value = user.role || 'passenger';

  const submit = document.createElement('button'); submit.className = 'btn primary'; submit.textContent = 'Guardar';
  form.append(name, surname, phone, role, submit);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submit.disabled = true; submit.textContent = 'Guardando...';
    const payload = {
      name: $('#pf-name').value,
      surname: $('#pf-surname').value,
      contactNumber: $('#pf-phone').value
    };
    const res = await apiPut('/user/profile', payload);
    submit.disabled = false; submit.textContent = 'Guardar';
    if (!res) return toast('Error de red', 'error');
    if (res.success) {
      setToken(getToken(), res.user);
      toast('Perfil actualizado', 'success'); m.close(); hydrateUser();
    } else toast(res.message || 'Error actualizando', 'error');
  });

  wrap.appendChild(form);
  m.setContent(wrap);
}

//
// API helpers
//
async function apiGet(path) {
  try {
    const headers = {};
    const token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const r = await fetch(API_BASE + path, { headers });
    if (r.status === 401) { logout(); return null; }
    return await r.json();
  } catch (e) { console.error(e); return null; }
}

async function apiPost(path, body) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const r = await fetch(API_BASE + path, { method: 'POST', headers, body: JSON.stringify(body) });
    if (r.status === 401) { logout(); return null; }
    return await r.json();
  } catch (e) { console.error(e); return null; }
}

async function apiPut(path, body) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const r = await fetch(API_BASE + path, { method: 'PUT', headers, body: JSON.stringify(body) });
    if (r.status === 401) { logout(); return null; }
    return await r.json();
  } catch (e) { console.error(e); return null; }
}

//
// Small utils & UI helpers
//
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function elemInput(type, placeholder, id) {
  const el = document.createElement('input');
  el.type = type;
  el.placeholder = placeholder;
  if (id) el.id = id;
  el.className = 'input';
  el.style.marginTop = '8px';
  return el;
}
function elemSelect(id, opts = []) {
  const s = document.createElement('select'); s.id = id; s.className = 'input'; s.style.marginTop = '8px';
  opts.forEach(o => { const op = document.createElement('option'); op.value = o.v; op.textContent = o.t; s.appendChild(op); });
  return s;
}

function createModal(title = '') {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  const card = document.createElement('div');
  card.className = 'modal-card';
  const h = document.createElement('h3'); h.textContent = title;
  const content = document.createElement('div');
  content.style.marginTop = '12px';
  const foot = document.createElement('div'); foot.style.marginTop = '12px'; foot.style.textAlign = 'right';
  const btnClose = document.createElement('button'); btnClose.className = 'btn outline'; btnClose.textContent = 'Cerrar';
  btnClose.addEventListener('click', () => backdrop.remove());
  foot.appendChild(btnClose);
  card.appendChild(h); card.appendChild(content); card.appendChild(foot);
  backdrop.appendChild(card);
  modalsRoot.appendChild(backdrop);

  return {
    setContent(node) { content.innerHTML = ''; content.appendChild(node); },
    close() { backdrop.remove(); }
  };
}

function logout() {
  setToken(null, null);
  toast('Sesión cerrada');
  showAuthView();
  travelsList.innerHTML = '';
  const navAuth = $('#nav-auth');
  navAuth.classList.remove('authed');
}

function reserveSeats(travelId, seats) {
  // not used - kept for extension
}

//
// Simple login flow helpers
//
async function loginFlow(email, password) {
  const res = await apiPost('/auth/login', { email, password });
  if (res && res.token) {
    setToken(res.token, res.user);
    showAppView();
    hydrateUser();
    fetchAndRenderTravels();
    return true;
  }
  return false;
}

// small DOM utility to create simple input element with id
function inputSimple(id, placeholder) {
  const i = document.createElement('input'); i.id = id; i.placeholder = placeholder; i.className = 'input';
  return i;
}
