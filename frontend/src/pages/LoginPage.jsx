import { useState, useRef, useEffect } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();

  // Refs for interactions
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const eyeLRef = useRef(null);
  const eyeRRef = useRef(null);
  const handLRef = useRef(null);
  const handRRef = useRef(null);

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  const normalEyeStyle = () => {
    if (eyeLRef.current) {
      eyeLRef.current.style.cssText = `left: 0.6em; top: 0.6em;`;
    }
    if (eyeRRef.current) {
      eyeRRef.current.style.cssText = `right: 0.6em; top: 0.6em;`;
    }
  };

  const eyesDownStyle = () => {
    if (eyeLRef.current) {
      eyeLRef.current.style.cssText = `left: 0.75em; top: 1.12em;`;
    }
    if (eyeRRef.current) {
      eyeRRef.current.style.cssText = `right: 0.75em; top: 1.12em;`;
    }
  };

  const normalHandStyle = () => {
    if (handLRef.current) {
      handLRef.current.style.cssText = `
        height: 2.81em;
        top: 8.9em;
        left: 7.5em;
        transform: rotate(0deg);
      `;
    }
    if (handRRef.current) {
      handRRef.current.style.cssText = `
        height: 2.81em;
        top: 8.9em;
        right: 7.5em;
        transform: rotate(0deg);
      `;
    }
  };

  const coverHandStyle = () => {
    if (handLRef.current) {
      handLRef.current.style.cssText = `
        height: 6.56em;
        top: 3.87em;
        left: 11.75em;
        transform: rotate(-155deg);
      `;
    }
    if (handRRef.current) {
      handRRef.current.style.cssText = `
        height: 6.56em;
        top: 3.87em;
        right: 11.75em;
        transform: rotate(155deg);
      `;
    }
  };

  const handleTextFocus = () => {
    eyesDownStyle();
    normalHandStyle();
  };

  const handlePasswordFocus = () => {
    normalEyeStyle();
    coverHandStyle();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      const inputs = [emailRef, passwordRef];
      const isInput = inputs.some((input) => input.current && input.current.contains(e.target));
      if (!isInput) {
        normalEyeStyle();
        normalHandStyle();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const css = `
    .panda-wrapper * {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      font-family: "Poppins", sans-serif;
    }
    .panda-wrapper .panda-container {
      height: 31.25em;
      width: 31.25em;
      position: relative;
    }
    .panda-wrapper form {
      width: 23.75em;
      height: 18.75em;
      background-color: #ffffff;
      position: absolute;
      top: calc(50% + 3.1em);
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 0 3.1em;
      display: flex;
      flex-direction: column;
      justify-content: center;
      border-radius: 0.5em;
    }
    .panda-wrapper form label {
      display: block;
      margin-bottom: 0.2em;
      font-weight: 600;
      color: #2e0d30;
    }
.panda-wrapper form .panda-input {
  font-size: 0.95em;
  font-weight: 400;
  color: black; /* 👈 text ka color black */
  padding: 0.4em 0.6em;
  border: none;
  border-bottom: 0.12em solid rgba(0, 0, 0, 0.4);
  outline: none;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5); /* 👈 transparent white background */
  border-radius: 0.4em;
  transition: all 0.3s ease-in-out;
  backdrop-filter: blur(5px); /* 👈 nice glass effect */
}

.panda-wrapper form .panda-input:focus {
  border-color: #f4c531;
  background-color: rgba(255, 255, 255, 0.8); /* thoda kam transparent jab focus ho */
}
/* Prevent autofill background / hover color change */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 9999s ease-in-out 0s !important;
  -webkit-text-fill-color: black !important; /* 👈 autofill text bhi black hi rahe */
  background-color: rgba(255, 255, 255, 0.5) !important; /* 👈 transparent white background same rahe */
  box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.5) inset !important;
}

    .panda-wrapper form .panda-input:not(:last-child) {
      margin-bottom: 0.9em;
    }
    .panda-wrapper form .panda-btn {
      font-size: 0.95em;
      padding: 0.8em 0;
      border-radius: 2em;
      border: none;
      outline: none;
      background-color: #f4c531;
      color: #2e0d30;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.15em;
      margin-top: 0.8em;
      cursor: pointer;
      width: 100%;
    }
    .panda-wrapper form .panda-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .panda-wrapper .panda-face {
      height: 7.5em;
      width: 8.4em;
      background-color: #ffffff;
      border: 0.18em solid #2e0d30;
      border-radius: 7.5em 7.5em 5.62em 5.62em;
      position: absolute;
      top: 2em;
      margin: auto;
      left: 0;
      right: 0;
    }
    .panda-wrapper .ear-l,
    .panda-wrapper .ear-r {
      background-color: #3f3554;
      height: 2.5em;
      width: 2.81em;
      border: 0.18em solid #2e0d30;
      border-radius: 2.5em 2.5em 0 0;
      top: 1.75em;
      position: absolute;
    }
    .panda-wrapper .ear-l {
      transform: rotate(-38deg);
      left: 10.75em;
    }
    .panda-wrapper .ear-r {
      transform: rotate(38deg);
      right: 10.75em;
    }
    .panda-wrapper .blush-l,
    .panda-wrapper .blush-r {
      background-color: #ff8bb1;
      height: 1em;
      width: 1.37em;
      border-radius: 50%;
      position: absolute;
      top: 4em;
    }
    .panda-wrapper .blush-l {
      transform: rotate(25deg);
      left: 1em;
    }
    .panda-wrapper .blush-r {
      transform: rotate(-25deg);
      right: 1em;
    }
    .panda-wrapper .eye-l,
    .panda-wrapper .eye-r {
      background-color: #3f3554;
      height: 2.18em;
      width: 2em;
      border-radius: 2em;
      position: absolute;
      top: 2.18em;
    }
    .panda-wrapper .eye-l {
      left: 1.37em;
      transform: rotate(-20deg);
    }
    .panda-wrapper .eye-r {
      right: 1.37em;
      transform: rotate(20deg);
    }
    .panda-wrapper .eyeball-l,
    .panda-wrapper .eyeball-r {
      height: 0.6em;
      width: 0.6em;
      background-color: #ffffff;
      border-radius: 50%;
      position: absolute;
      left: 0.6em;
      top: 0.6em;
      transition: 1s all;
    }
    .panda-wrapper .eyeball-l {
      transform: rotate(20deg);
    }
    .panda-wrapper .eyeball-r {
      transform: rotate(-20deg);
    }
    .panda-wrapper .nose {
      height: 1em;
      width: 1em;
      background-color: #3f3554;
      position: absolute;
      top: 4.37em;
      margin: auto;
      left: 0;
      right: 0;
      border-radius: 1.2em 0 0 0.25em;
      transform: rotate(45deg);
    }
    .panda-wrapper .nose:before {
      content: "";
      position: absolute;
      background-color: #3f3554;
      height: 0.6em;
      width: 0.1em;
      transform: rotate(-45deg);
      top: 0.75em;
      left: 1em;
    }
    .panda-wrapper .mouth,
    .panda-wrapper .mouth:before {
      height: 0.75em;
      width: 0.93em;
      background-color: transparent;
      position: absolute;
      border-radius: 50%;
      box-shadow: 0 0.18em #3f3554;
    }
    .panda-wrapper .mouth {
      top: 5.31em;
      left: 3.12em;
    }
    .panda-wrapper .mouth:before {
      content: "";
      position: absolute;
      left: 0.87em;
    }
    .panda-wrapper .hand-l,
    .panda-wrapper .hand-r {
      background-color: #3f3554;
      height: 2.81em;
      width: 2.5em;
      border: 0.18em solid #2e0d30;
      border-radius: 0.6em 0.6em 2.18em 2.18em;
      transition: 1s all;
      position: absolute;
      top: 8.4em;
    }
    .panda-wrapper .hand-l {
      left: 7.5em;
    }
    .panda-wrapper .hand-r {
      right: 7.5em;
    }
    .panda-wrapper .paw-l,
    .panda-wrapper .paw-r {
      background-color: #3f3554;
      height: 3.12em;
      width: 3.12em;
      border: 0.18em solid #2e0d30;
      border-radius: 2.5em 2.5em 1.2em 1.2em;
      position: absolute;
      top: 26.56em;
    }
    .panda-wrapper .paw-l {
      left: 10em;
    }
    .panda-wrapper .paw-r {
      right: 10em;
    }
    .panda-wrapper .paw-l:before,
    .panda-wrapper .paw-r:before {
      position: absolute;
      content: "";
      background-color: #ffffff;
      height: 1.37em;
      width: 1.75em;
      top: 1.12em;
      left: 0.55em;
      border-radius: 1.56em 1.56em 0.6em 0.6em;
    }
    .panda-wrapper .paw-l:after,
    .panda-wrapper .paw-r:after {
      position: absolute;
      content: "";
      background-color: #ffffff;
      height: 0.5em;
      width: 0.5em;
      border-radius: 50%;
      top: 0.31em;
      left: 1.12em;
      box-shadow: 0.87em 0.37em #ffffff, -0.87em 0.37em #ffffff;
    }
    @media screen and (max-width: 500px) {
      .panda-wrapper .panda-container {
        font-size: 14px;
      }
    }
  `;

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
      <style>{css}</style>
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* LOGIN FORM SECTION */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col text-center">
          {/* LOGO */}
          <div className="mb-4 flex items-center justify-center gap-2 ">
            <ShipWheelIcon className="size-9 text-primary " />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              TalkDude
            </span>
          </div>
          {/* ERROR MESSAGE DISPLAY */}
          {error && (
            <div className="alert alert-error mb-4 text-white">
              <span>{error.response?.data?.message || error.message || "An unexpected error occurred"}</span>
            </div>
          )}
          {/* PANDA CONTAINER */}
          <div className="flex-1 flex justify-center items-center relative h-96 mt-8">
            <div className="panda-wrapper">
              <div>
                <h2 className="text-xl font-semibold text-center" >
                  Welcome Back
                </h2>
                <p className="text-sm opacity-70 text-center">Sign in to your account to continue your language journey</p>
              </div>
              <div className="panda-container">
                <form onSubmit={handleLogin}>
                  {/* Description */}

                  {/* EMAIL */}
                  <label htmlFor="email">Email</label>
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    className="panda-input"
                    placeholder="hello@example.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    onFocus={handleTextFocus}
                  />
                  {/* PASSWORD */}
                  <label htmlFor="password">Password</label>
                  <input
                    ref={passwordRef}
                    type="password"
                    id="password"
                    className="panda-input"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    onFocus={handlePasswordFocus}
                  />
                  <button className="panda-btn" type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs inline-block mr-2"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                  <div style={{ marginTop: "1em", textAlign: "center" }}>
                    <p className="text-sm text-black">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-primary hover:underline">
                        Create one
                      </Link>
                    </p>
                  </div>
                </form>
                {/* PANDA ELEMENTS */}
                <div className="ear-l"></div>
                <div className="ear-r"></div>
                <div className="panda-face">
                  <div className="blush-l"></div>
                  <div className="blush-r"></div>
                  <div className="eye-l">
                    <div ref={eyeLRef} className="eyeball-l"></div>
                  </div>
                  <div className="eye-r">
                    <div ref={eyeRRef} className="eyeball-r"></div>
                  </div>
                  <div className="nose"></div>
                  <div className="mouth"></div>
                </div>
                <div ref={handLRef} className="hand-l"></div>
                <div ref={handRRef} className="hand-r"></div>
                <div className="paw-l"></div>
                <div className="paw-r"></div>
              </div>
            </div>
          </div>
        </div>
        {/* IMAGE SECTION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">Practice conversations, make friends, and improve your language skills together</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;