(() => {
  const AUTH_CONFIG = {
    sessionKey: "rosuzetStudySession",
    sessionValue: "authenticated",
    username: "CVD1",
    password: "CVD1"
  };

  const select = (selector) => document.querySelector(selector);
  const selectAll = (selector) => [...document.querySelectorAll(selector)];
  const normalizeUsername = (value) => String(value || "").trim();

  const authenticate = ({ username, password }) => {
    return normalizeUsername(username) === AUTH_CONFIG.username && String(password || "") === AUTH_CONFIG.password;
  };

  const readSession = () => {
    try {
      return sessionStorage.getItem(AUTH_CONFIG.sessionKey) === AUTH_CONFIG.sessionValue;
    } catch {
      return false;
    }
  };

  const writeSession = () => {
    try {
      sessionStorage.setItem(AUTH_CONFIG.sessionKey, AUTH_CONFIG.sessionValue);
    } catch {
      return;
    }
  };

  const clearSession = () => {
    try {
      sessionStorage.removeItem(AUTH_CONFIG.sessionKey);
    } catch {
      return;
    }
  };

  const setAppAccess = (isAllowed) => {
    document.body.classList.toggle("auth-locked", !isAllowed);
    document.body.classList.toggle("auth-unlocked", isAllowed);
    const loginScreen = select("#loginScreen");
    if (loginScreen) {
      loginScreen.hidden = isAllowed;
    }
    selectAll("[data-auth-content]").forEach((node) => {
      node.inert = !isAllowed;
      node.setAttribute("aria-hidden", String(!isAllowed));
    });
  };

  const setError = (message = "") => {
    const error = select("#loginError");
    if (!error) {
      return;
    }
    error.textContent = message;
    error.hidden = !message;
  };

  const bindLogin = () => {
    const form = select("#loginForm");
    const usernameInput = select("#loginId");
    const passwordInput = select("#loginPassword");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const credentials = {
        username: usernameInput?.value,
        password: passwordInput?.value
      };
      if (!authenticate(credentials)) {
        setError("아이디 또는 비밀번호가 맞지 않습니다.");
        passwordInput.value = "";
        passwordInput?.focus();
        return;
      }
      writeSession();
      setError();
      setAppAccess(true);
      select("#overview")?.focus();
    });
  };

  const bindLogout = () => {
    select("#logoutButton")?.addEventListener("click", () => {
      clearSession();
      setAppAccess(false);
      select("#loginId")?.focus();
    });
  };

  const init = () => {
    const isAllowed = readSession();
    setAppAccess(isAllowed);
    bindLogin();
    bindLogout();
    if (!isAllowed) {
      select("#loginId")?.focus();
    }
  };

  globalThis.AuthGate = { authenticate };

  if (typeof document !== "undefined") {
    init();
  }
})();
