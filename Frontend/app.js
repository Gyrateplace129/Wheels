const API_BASE = '/api';


btnLogin.addEventListener('click', ()=>renderLogin());
btnRegister.addEventListener('click', ()=>renderRegister());
btnCreateTravel.addEventListener('click', ()=>renderCreateTravel());
btnProfile.addEventListener('click', ()=>renderProfile());
btnLogout.addEventListener('click', logout);
btnSearch.addEventListener('click', fetchAndRenderTravels);


function bootstrap(){
if(auth.token){show(btnLogout);hide(navAuth);show(mainView);hide(authView);fetchAndRenderTravels();}
else{hide(mainView);show(authView);renderLogin();}
}


function renderLogin(){authView.innerHTML='';const card=createEl('div',{className:'card'},[]);const h=createEl('h2',{},['Iniciar sesión']);const form=createEl('form',{});const email=createEl('input',{placeholder:'Correo o usuario',type:'email'});const pass=createEl('input',{placeholder:'Contraseña',type:'password'});const btn=createEl('button',{className:'btn',type:'submit'},['Iniciar sesión']);form.append(email,pass,btn);form.addEventListener('submit',async e=>{e.preventDefault();await login(email.value,pass.value)});card.append(h,form);authView.append(card)}


function renderRegister(){authView.innerHTML='';const card=createEl('div',{className:'card'},[]);const h=createEl('h2',{},['Registro']);const form=createEl('form',{});const name=createEl('input',{placeholder:'Nombre'});const email=createEl('input',{placeholder:'Correo',type:'email'});const pass=createEl('input',{placeholder:'Contraseña',type:'password'});const btn=createEl('button',{className:'btn',type:'submit'},['Registrar']);form.append(name,email,pass,btn);form.addEventListener('submit',async e=>{e.preventDefault();await register({name:name.value,email:email.value,password:pass.value})});card.append(h,form);authView.append(card)}


async function fetchAndRenderTravels(){travelsContainer.innerHTML='Cargando...';const res=await apiGet('/travel/available');travelsContainer.innerHTML='';if(!res||!res.items){travelsContainer.textContent='No se encontraron viajes';return;}res.items.forEach(t=>{const c=createEl('div',{className:'travel-card'},[createEl('div',{className:'travel-meta'},[createEl('strong',{},[t.route||t.startPoint+'→'+t.endPoint]),createEl('div',{},['Tarifa: $'+t.fare+' Cupos: '+t.availableSeats])]),createEl('button',{className:'btn small',onclick:()=>alert('Detalles del viaje')},['Detalles'])]);travelsContainer.append(c)})}


async function login(email,password){const res=await apiPost('/auth/login',{email,password});if(res&&res.token){auth.token=res.token;localStorage.setItem('wheels_token',res.token);bootstrap()}else alert('Error')}
async function register(b){const res=await apiPost('/auth/register',b);if(res&&res.success){alert('Registro exitoso');renderLogin()}else alert('Error en registro')}
function logout(){auth.token=null;localStorage.removeItem('wheels_token');location.reload()}


async function apiGet(path){try{const h=auth.token?{'Authorization':'Bearer '+auth.token}:{},r=await fetch(API_BASE+path,{headers:h});return await r.json()}catch(e){console.error(e);return null}}
async function apiPost(path,body){try{const h={'Content-Type':'application/json'};if(auth.token)h['Authorization']='Bearer '+auth.token;const r=await fetch(API_BASE+path,{method:'POST',headers:h,body:JSON.stringify(body)});return await r.json()}catch(e){console.error(e);return null}}


bootstrap();