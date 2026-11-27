import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UiIcon from "../components/UiIcon";
import { Shirt } from "lucide-react";
import Modal from "../components/Modal";
import { useLoginMutation, useRegisterMutation } from "../services/api";
import { setCredentials } from "../features/auth/authSlice";
import { validateRegistration } from "../features/registration/validation";
import "@fontsource/outfit/latin-400.css";
import "@fontsource/outfit/latin-600.css";
import "@fontsource/outfit/latin-700.css";
import "@fontsource/outfit/latin-800.css";
import "./AccountPage.css";

const emptyDetails = {
  name: "",
  mobile: "",
  email: "",
  password: "",
  confirm_password: "",
  accept_terms: false,
};

export default function AccountPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const creating = location.pathname === "/register";
  const [details, setDetails] = useState(emptyDetails);
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem("rememberedEmail") || "";
    } catch {
      return "";
    }
  });
  const [remember, setRemember] = useState(Boolean(email));
  const [password, setPassword] = useState("");
  const [shown, setShown] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [login, loginState] = useLoginMutation();
  const [register, registerState] = useRegisterMutation();
  const busy = loginState.isLoading || registerState.isLoading;
  const feedbackRef = useRef(null);
  useEffect(() => {
    if (feedback) feedbackRef.current?.focus();
  }, [feedback]);

  if (user) return <Navigate to="/dashboard" replace />;

  function switchMode(next) {
    if (busy) return;
    setFeedback(null);
    setPassword("");
    setDetails(emptyDetails);
    setShown({});
    navigate(next ? "/register" : "/login", { replace: true });
  }
  function update(name, value) {
    setDetails((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setFeedback(null);
    if (creating) {
      const error = validateRegistration(details);
      if (error) {
        setFeedback({ error: true, text: error });
        return;
      }
      try {
        await register({
          ...details,
          name: details.name.trim(),
          email: details.email.trim().toLowerCase(),
        }).unwrap();
        setEmail(details.email.trim().toLowerCase());
        setDetails(emptyDetails);
        setPassword("");
        setShown({});
        navigate("/login", { replace: true });
        setFeedback({
          error: false,
          text: "Your account is ready! Sign in to start your fresh chapter.",
        });
      } catch (error) {
        showError(
          error,
          "Unable to create your account right now. Please try again later.",
        );
      }
      return;
    }
    try {
      const response = await login({ email: email.trim(), password }).unwrap();
      if (!response.data?.token || !response.data?.user) {
        setFeedback({
          error: true,
          text: "The server returned an unexpected response. Please try again.",
        });
        return;
      }
      try {
        if (remember) localStorage.setItem("rememberedEmail", email.trim());
        else localStorage.removeItem("rememberedEmail");
      } catch {
        /* Browser storage may be disabled. */
      }
      dispatch(setCredentials(response.data));
      setPassword("");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      showError(
        error,
        "Unable to reach the login service. Please try again later.",
      );
    }
  }
  function showError(error, fallback) {
    const unavailable =
      ["FETCH_ERROR", "PARSING_ERROR", "TIMEOUT_ERROR"].includes(
        error.status,
      ) || Number(error.status) >= 500;
    setFeedback({
      error: true,
      text: unavailable
        ? fallback
        : error.data?.message || "Please check your details and try again.",
    });
  }

  const fields = creating
    ? [
        ["name", "Full name", "Your full name", "text", "name", "user"],
        [
          "mobile",
          "Mobile number",
          "10-digit mobile number",
          "tel",
          "tel-national",
          "phone",
        ],
        ["email", "Email address", "you@example.com", "email", "email", "mail"],
        [
          "password",
          "Password",
          "Create a strong password",
          "password",
          "new-password",
          "lock",
        ],
        [
          "confirm_password",
          "Confirm password",
          "Repeat your password",
          "password",
          "new-password",
          "lock",
        ],
      ]
    : [
        [
          "email",
          "Email address",
          "you@example.com",
          "email",
          "username",
          "mail",
        ],
        [
          "password",
          "Password",
          "Enter your password",
          "password",
          "current-password",
          "lock",
        ],
      ];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className={`account-page ${creating ? "account-creating" : ""}`}
    >
      <div className="account-shell">
        <aside className="account-story">
          <Link
            to="/"
            className="account-logo"
            aria-label="BB LaundryLink home"
          >
            <img src="/images/logo.webp" alt="BB LaundryLink" />
          </Link>
          <div className="account-story-copy">
            <span className="account-overline">
              <span /> LESS LAUNDRY. MORE LIFE.
            </span>
            <h2>
              A fresh start.
              <br />A little more
              <br />
              <em>you time.</em>
            </h2>
            <p>
              Your day is made for bigger things.
              <br />
              Let’s make laundry the easy part.
            </p>
          </div>
          <div className="account-art" aria-hidden="true">
            <div className="account-orbit first" />
            <div className="account-orbit second" />
            <div className="account-washer">
              <div className="account-washer-controls">
                <i />
                <span />
                <b>BB</b>
              </div>
              <div className="account-washer-door">
                <div className="account-water" />
                <Shirt size={66} strokeWidth={1.5} />
              </div>
              <div className="account-washer-base" />
            </div>
            <span className="account-fresh-stamp">
              A FRESH
              <br />
              <strong>perspective ✦</strong>
            </span>
            <div className="account-floating-label">
              <span>✦</span> Laundry, reimagined.
            </div>
          </div>
          <div className="account-story-bottom">
            <span>01 / A CLEANER ROUTINE</span>
            <span>Made for Bhubaneswar ↗</span>
          </div>
        </aside>
        <section className="account-content" aria-label="Customer account">
          <div className="account-content-top">
            <span>CUSTOMER ACCESS</span>
            <Link to="/">
              Back to home <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="account-form-wrap">
            <div className="account-mode-switch" aria-label="Account access">
              <button
                type="button"
                aria-pressed={!creating}
                disabled={busy}
                className={!creating ? "active" : ""}
                onClick={() => switchMode(false)}
              >
                Login <span aria-hidden="true">↗</span>
              </button>
              <button
                type="button"
                aria-pressed={creating}
                disabled={busy}
                className={creating ? "active" : ""}
                onClick={() => switchMode(true)}
              >
                Create account <span aria-hidden="true">+</span>
              </button>
            </div>
            <div className="account-welcome-mark" aria-hidden="true">
              {creating ? "✧" : "✦"}
            </div>
            <h1>
              {creating ? (
                <>Your fresh chapter.</>
              ) : (
                <>
                  Good to have
                  <br />
                  you back.
                </>
              )}
            </h1>
            <p className="account-intro">
              {creating
                ? "One account. A simpler laundry routine."
                : "Sign in for a little less laundry, a little more life."}
            </p>
            <form onSubmit={submit} aria-busy={busy}>
              <fieldset disabled={busy} className="account-fieldset">
                <div className="row g-3 account-fields">
                  {fields.map(
                    ([name, label, placeholder, type, autoComplete, icon]) => {
                      const value = creating
                        ? details[name]
                        : name === "email"
                          ? email
                          : password;
                      return (
                        <div
                          className={
                            creating &&
                            [
                              "name",
                              "mobile",
                              "password",
                              "confirm_password",
                            ].includes(name)
                              ? "col-12 col-sm-6"
                              : "col-12"
                          }
                          key={name}
                        >
                          <label
                            className="account-field-label"
                            htmlFor={`account-${name}`}
                          >
                            {label}
                          </label>
                          <div className="account-input">
                            <UiIcon name={icon} size={18} />
                            <input
                              id={`account-${name}`}
                              name={name}
                              className="form-control"
                              type={
                                type === "password" && shown[name]
                                  ? "text"
                                  : type
                              }
                              autoComplete={autoComplete}
                              placeholder={placeholder}
                              value={value}
                              required
                              maxLength={
                                name === "mobile"
                                  ? 10
                                  : name === "name"
                                    ? 100
                                    : name === "email"
                                      ? 150
                                      : undefined
                              }
                              inputMode={
                                name === "mobile" ? "numeric" : undefined
                              }
                              pattern={
                                name === "mobile" ? "[0-9]{10}" : undefined
                              }
                              onChange={(event) =>
                                creating
                                  ? update(name, event.target.value)
                                  : name === "email"
                                    ? setEmail(event.target.value)
                                    : setPassword(event.target.value)
                              }
                            />
                            {type === "password" && (
                              <button
                                type="button"
                                aria-label={`${shown[name] ? "Hide" : "Show"} ${label.toLowerCase()}`}
                                aria-pressed={Boolean(shown[name])}
                                onClick={() =>
                                  setShown((current) => ({
                                    ...current,
                                    [name]: !current[name],
                                  }))
                                }
                              >
                                <UiIcon
                                  name={shown[name] ? "eyeOff" : "eye"}
                                  size={18}
                                />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
                {creating ? (
                  <>
                    <p className="account-password-hint">
                      At least 8 characters. A mix of letters, numbers and
                      symbols is recommended.
                    </p>
                    <div className="account-consent">
                      <input
                        id="account-terms"
                        className="form-check-input"
                        type="checkbox"
                        required
                        checked={details.accept_terms}
                        onChange={(event) =>
                          update("accept_terms", event.target.checked)
                        }
                      />
                      <div>
                        <label htmlFor="account-terms">I agree to the </label>
                        <button
                          type="button"
                          onClick={() => setPolicy("Terms & Conditions")}
                        >
                          Terms
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          onClick={() => setPolicy("Privacy Notice")}
                        >
                          Privacy Notice
                        </button>
                        .
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="account-options">
                    <label>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={remember}
                        onChange={(event) => setRemember(event.target.checked)}
                      />{" "}
                      Remember email
                    </label>
                    <button
                      type="button"
                      onClick={() => setPolicy("Password help")}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
                {feedback && (
                  <p
                    ref={feedbackRef}
                    tabIndex={-1}
                    className={`account-feedback ${feedback.error ? "error" : "success"}`}
                    role={feedback.error ? "alert" : "status"}
                  >
                    {feedback.text}
                  </p>
                )}
                <button className="btn account-submit" type="submit">
                  {busy ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                      />{" "}
                      {creating ? "Creating account…" : "Signing in…"}
                    </>
                  ) : (
                    <>
                      {creating ? "Create my account" : "Login"}{" "}
                      <span aria-hidden="true">↗</span>
                    </>
                  )}
                </button>
              </fieldset>
            </form>
            <p className="account-switch-prompt">
              {creating
                ? "Already part of the fresh side?"
                : "New around here?"}{" "}
              <button
                type="button"
                disabled={busy}
                onClick={() => switchMode(!creating)}
              >
                {creating ? "Sign in" : "Create an account"}{" "}
                <span aria-hidden="true">→</span>
              </button>
            </p>
            <div className="account-security">
              <UiIcon name="lock" size={14} />
              <span>Your password stays private. Your time stays yours.</span>
            </div>
          </div>
          <footer className="account-footer">
            <span>© {new Date().getFullYear()} BB LaundryLink</span>
            <a href="mailto:support@bblaundrylink.com">Need a hand? ↗</a>
          </footer>
        </section>
      </div>
      {policy && (
        <Modal title={policy} onClose={() => setPolicy(null)}>
          <p>
            {policy === "Password help"
              ? "Password reset is not connected yet. Contact support@bblaundrylink.com for account assistance."
              : policy === "Privacy Notice"
                ? "We store your name, email, mobile number and a hashed password to create your customer account. Contact support@bblaundrylink.com for account or data requests."
                : "Use accurate account details and keep your password private. Customer registration and login are available; marketplace listings and booking features are currently design previews."}
          </p>
          {policy !== "Password help" && (
            <p className="notice">
              Development notice: final legal policies must be reviewed by the
              service operator before public launch.
            </p>
          )}
          <a href="mailto:support@bblaundrylink.com">Contact support →</a>
        </Modal>
      )}
    </main>
  );
}
