document.getElementById('logoutBtn').onclick = function() {
  localStorage.removeItem('isUniversity');
  window.location.href = 'uni_login.html';
};

document.querySelectorAll('.expert-btn').forEach(btn => {
  btn.onclick = function() {
    btn.classList.add('verified');
    btn.textContent = "Expert Verified";
    btn.disabled = true;
  };
});

document.getElementById('advisory-form').onsubmit = function(e) {
  e.preventDefault();
  document.getElementById('upload-result').textContent =
    "✔ Advisory uploaded (demo only)";
  this.reset();
};

// Language switching demo
["lang-en","lang-hi","lang-pa"].forEach(id => {
  document.getElementById(id).onclick = function () {
    alert("For full multi-language, connect to your translation system.");
  };
});
