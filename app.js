// Quick helper
const $ = s => document.querySelector(s);
const storage = {
  get(k, f = null){ return JSON.parse(localStorage.getItem(k)) ?? f; },
  set(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
};

// Keys
const USERS_KEY = "mini_users";
const SESSION_KEY = "mini_session";
const POSTS_KEY = "mini_posts";

// Elements
const authContainer = $("#auth-container");
const signupView = $("#signup-view");
const loginView = $("#login-view");
const showLogin = $("#show-login");
const showSignup = $("#show-signup");
const signupForm = $("#signup-form");
const loginForm = $("#login-form");
const app = $("#app");
const welcomeName = $("#welcome-name");
const logoutBtn = $("#logout-btn");
const addPostBtn = $("#add-post-btn");
const postText = $("#post-text");
const postImage = $("#post-image");
const feed = $("#feed");

// Data
let users = storage.get(USERS_KEY, []);
let posts = storage.get(POSTS_KEY, []);
let session = storage.get(SESSION_KEY, null);

// ----- Auth UI Switch -----
showLogin.onclick = () => {
  signupView.classList.add("hidden");
  loginView.classList.remove("hidden");
};
showSignup.onclick = () => {
  signupView.classList.remove("hidden");
  loginView.classList.add("hidden");
};

// ----- Signup -----
signupForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = $("#signup-name").value.trim();
  const email = $("#signup-email").value.toLowerCase();
  const pass = $("#signup-password").value;

  if(users.some(u => u.email === email))
    return alert("User already exists. Login please.");

  users.push({ id: Date.now(), name, email, pass });
  storage.set(USERS_KEY, users);

  alert("Signup successful!");
  showLogin.click();
});

// ----- Login -----
loginForm.addEventListener("submit", e => {
  e.preventDefault();

  const email = $("#login-email").value.toLowerCase();
  const pass = $("#login-password").value;

  const user = users.find(u => u.email === email && u.pass === pass);
  if(!user) return alert("Wrong email or password");

  session = { id: user.id, name: user.name, email };
  storage.set(SESSION_KEY, session);

  enterApp();
});

// ----- Enter App -----
function enterApp(){
  authContainer.classList.add("hidden");
  app.classList.remove("hidden");

  welcomeName.textContent = "Hi, " + session.name;

  renderPosts();
}

// ----- Logout -----
logoutBtn.onclick = () => {
  localStorage.removeItem(SESSION_KEY);
  location.reload();
};

// ----- Post Create -----
addPostBtn.onclick = () => {
  const text = postText.value.trim();
  const img = postImage.value.trim();

  if(!text && !img) return alert("Write something..");

  posts.unshift({
    id: Date.now(),
    user: session.name,
    text,
    img: img || null,
    time: new Date().toLocaleString()
  });

  storage.set(POSTS_KEY, posts);

  postText.value = "";
  postImage.value = "";

  renderPosts();
};

// ----- Render Posts -----
function renderPosts(){
  feed.innerHTML = "";

  if(posts.length === 0){
    feed.innerHTML = "<p>No posts yet</p>";
    return;
  }

  posts.forEach(p => {
    feed.innerHTML += `
      <div class="post">
        <strong>${p.user}</strong> • <small>${p.time}</small>
        <p>${p.text}</p>
        ${p.img ? `<img src="${p.img}">` : ""}
      </div>
    `;
  });
}

// ----- INITIAL LOAD -----
if(session){
  enterApp();
} else {
  // show login/signup only
  authContainer.classList.remove("hidden");
  app.classList.add("hidden");
}
