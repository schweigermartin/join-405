const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get("msg");
let msgBox = document.getElementById("msgBox");
let hero = document.getElementById("body");

function logIn() {
  let emailError = document.getElementById("email-error");
  let passwordError = document.getElementById("password-error");

  emailError.innerHTML = "";
  passwordError.innerHTML = "";

  let user = users.find((u) => u.email === email.value);

  if (user) {
    if (user.password === password.value) {
      window.location.href = "../HTML/summary.html";
      email.value = "";
      password.value = "";
    } else {
      passwordError.innerHTML =
        "Check your email and password. Please try again.";
    }
  }
}

if (msg) {
  msgBox.innerHTML = msg;
} else {
  msgBox.style.display = "none";
}

hero.onclick = function () {
  msgBox.style.display = "none";
};

function getUserLogo() {
  let userLogo = document.getElementById("user-button");

  let initials = getInitials(users.name);

  console.log(initials);
}