const _alertIcons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>`,
    error:   `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd"/></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/></svg>`,
    info:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd"/></svg>`,
};

const _alertColors = { success: "text-green-500", error: "text-red-500", warning: "text-yellow-500", info: "text-blue-500" };

function _removeAlert(el) {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    setTimeout(() => el.remove(), 250);
}

window.showAlert = function (message, type, duration) {
    type = type || "info";
    duration = duration || 4000;

    let container = document.getElementById("_alert-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "_alert-container";
        container.style.cssText = "position:fixed;top:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:12px;align-items:flex-end;min-width:300px;max-width:90vw;pointer-events:none;";
        document.body.appendChild(container);
    }

    const color = _alertColors[type] || _alertColors.info;
    const icon  = _alertIcons[type]  || _alertIcons.info;

    const el = document.createElement("div");
    el.style.cssText = "opacity:0;transform:translateY(16px);transition:opacity 0.3s,transform 0.3s;pointer-events:auto;width:100%;";
    el.className = "flex items-start gap-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg p-4";
    el.innerHTML = `
        <span class="${color} flex-shrink-0 mt-0.5 w-5 h-5">${icon}</span>
        <span class="flex-1 font-bold text-sm ${color}">${message}</span>
        <button style="pointer-events:auto" class="flex-shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
    `;

    container.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = "1"; el.style.transform = "translateY(0)"; });

    el.querySelector("button").addEventListener("click", () => _removeAlert(el));
    setTimeout(() => _removeAlert(el), duration);
};

window.toggleWishlistCard = function (slug, btn) {
    btn.disabled = true;
    fetch("/api/courses/" + slug + "/wishlist", { method: "POST", headers: { "Accept": "application/json" } })
        .then(function (res) {
            if (res.status === 401) {
                showAlert("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید", "warning");
                return null;
            }
            return res.json();
        })
        .then(function (data) {
            if (!data) return;
            if (data.wishlisted) {
                btn.classList.remove("text-muted");
                btn.classList.add("text-red-500");
            } else {
                btn.classList.remove("text-red-500");
                btn.classList.add("text-muted");
            }
            showAlert(data.message, data.wishlisted ? "success" : "info");
        })
        .catch(function () {
            showAlert("خطایی رخ داد، دوباره تلاش کنید", "error");
        })
        .finally(function () {
            btn.disabled = false;
        });
};

window.toggleWishlistArticle = function (slug, btn) {
    btn.disabled = true;
    fetch("/api/blog/" + slug + "/wishlist", { method: "POST", headers: { "Accept": "application/json" } })
        .then(function (res) {
            if (res.status === 401) {
                showAlert("برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید", "warning");
                return null;
            }
            return res.json();
        })
        .then(function (data) {
            if (!data) return;
            if (data.wishlisted) {
                btn.classList.remove("text-muted");
                btn.classList.add("text-red-500");
            } else {
                btn.classList.remove("text-red-500");
                btn.classList.add("text-muted");
            }
            var row = btn.closest(".wishlist-article-row");
            if (row && !data.wishlisted) row.remove();
            showAlert(data.message, data.wishlisted ? "success" : "info");
        })
        .catch(function () {
            showAlert("خطایی رخ داد، دوباره تلاش کنید", "error");
        })
        .finally(function () {
            btn.disabled = false;
        });
};

// Dark mode toggle (initial class is set via inline script in <head>)
const darkModeCheckbox = document.querySelector("#dark-mode-checkbox");
if (darkModeCheckbox) {
    darkModeCheckbox.checked = document.documentElement.classList.contains("dark");
}

const darkModeButton = document.querySelector("#dark-mode-button");
if (darkModeButton) darkModeButton.addEventListener("click", toggleDarkMode);
if (darkModeCheckbox) darkModeCheckbox.addEventListener("change", toggleDarkMode);

function toggleDarkMode() {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", isDark ? "true" : "false");
    if (darkModeCheckbox) darkModeCheckbox.checked = isDark;
}

const scrollToTopBtn = document.getElementById("scrollToTopBtn");
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
