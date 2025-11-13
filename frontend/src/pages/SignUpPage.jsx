import { useState, useRef, useEffect } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router-dom";
import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const eyeLRef = useRef(null);
  const eyeRRef = useRef(null);
  const handLRef = useRef(null);
  const handRRef = useRef(null);

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  const normalEyeStyle = () => {
    if (eyeLRef.current) eyeLRef.current.style.cssText = `left: 0.6em; top: 0.6em;`;
    if (eyeRRef.current) eyeRRef.current.style.cssText = `right: 0.6em; top: 0.6em;`;
  };

  const eyesDownStyle = () => {
    if (eyeLRef.current) eyeLRef.current.style.cssText = `left: 0.75em; top: 1.12em;`;
    if (eyeRRef.current) eyeRRef.current.style.cssText = `right: 0.75em; top: 1.12em;`;
  };

  const normalHandStyle = () => {
    if (handLRef.current)
      handLRef.current.style.cssText = `
        height: 2.81em;
        top: 6.7em;
        left: 7.5em;
        transform: rotate(0deg);
      `;
    if (handRRef.current)
      handRRef.current.style.cssText = `
        height: 2.81em;
        top: 6.7em;
        right: 7.5em;
        transform: rotate(0deg);
      `;
  };

  const coverHandStyle = () => {
    if (handLRef.current)
      handLRef.current.style.cssText = `
        height: 6.56em;
        top: 3.87em;
        left: 11.75em;
        transform: rotate(-155deg);
      `;
    if (handRRef.current)
      handRRef.current.style.cssText = `
        height: 6.56em;
        top: 3.87em;
        right: 11.75em;
        transform: rotate(155deg);
      `;
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
      const inputs = [fullNameRef, emailRef, passwordRef];
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
  height: 22em;
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
  color: black;
  padding: 0.4em 0.6em;
  border: none;
  border-bottom: 0.12em solid rgba(0, 0, 0, 0.4);
  outline: none;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 0.4em;
  transition: all 0.3s ease-in-out;
  backdrop-filter: blur(5px);
}
.panda-wrapper form .panda-input:focus {
  border-color: #f4c531;
  background-color: rgba(255, 255, 255, 0.8);
}
/* Autofill fix */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 9999s ease-in-out 0s !important;
  -webkit-text-fill-color: black !important;
  background-color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 0.5) inset !important;
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
.panda-wrapper .ear-l { transform: rotate(-38deg); left: 10.75em; }
.panda-wrapper .ear-r { transform: rotate(38deg); right: 10.75em; }
.panda-wrapper .blush-l,
.panda-wrapper .blush-r {
  background-color: #ff8bb1;
  height: 1em;
  width: 1.37em;
  border-radius: 50%;
  position: absolute;
  top: 4em;
}
.panda-wrapper .blush-l { left: 1em; transform: rotate(25deg); }
.panda-wrapper .blush-r { right: 1em; transform: rotate(-25deg); }
.panda-wrapper .eye-l,
.panda-wrapper .eye-r {
  background-color: #3f3554;
  height: 2.18em;
  width: 2em;
  border-radius: 2em;
  position: absolute;
  top: 2.18em;
}
.panda-wrapper .eye-l { left: 1.37em; transform: rotate(-20deg); }
.panda-wrapper .eye-r { right: 1.37em; transform: rotate(20deg); }
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
.panda-wrapper .nose {
  height: 1em;
  width: 1em;
  background-color: #3f3554;
  position: absolute;
  top: 4.37em;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 1.2em 0 0 0.25em;
  transform: rotate(45deg);
}
.panda-wrapper .mouth {
  height: 0.75em;
  width: 0.93em;
  background-color: transparent;
  border-radius: 50%;
  box-shadow: 0 0.18em #3f3554;
  position: absolute;
  top: 5.31em;
  left: 3.12em;
}
.panda-wrapper .mouth:before {
  content: "";
  height: 0.75em;
  width: 0.93em;
  background-color: transparent;
  border-radius: 50%;
  box-shadow: 0 0.18em #3f3554;
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
  top: 7.4em;
}
.panda-wrapper .hand-l { left: 7.5em; }
.panda-wrapper .hand-r { right: 7.5em; }
.panda-wrapper .paw-l,
.panda-wrapper .paw-r {
  background-color: #3f3554;
  height: 3.12em;
  width: 3.12em;
  border: 0.18em solid #2e0d30;
  border-radius: 2.5em 2.5em 1.2em 1.2em;
  position: absolute;
  top: 27.56em;
}
.panda-wrapper .paw-l { left: 10em; }
.panda-wrapper .paw-r { right: 10em; }
@media screen and (max-width: 500px) {
  .panda-wrapper .panda-container { font-size: 14px; }
}
`;

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="forest">
      <style>{css}</style>
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">

        {/* LEFT - FORM */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col text-center">
          <div className="mb-4 flex items-center justify-center gap-2 ">
            <ShipWheelIcon className="size-9 text-primary " />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              TalkDude
            </span>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="flex-1 flex justify-center items-center relative h-96 mt-8">
            <div className="panda-wrapper">
              <div>
                <h2 className="text-xl font-semibold text-center">Create an Account</h2>
                <p className="text-sm opacity-70 text-center">
                  Join us and start your language adventure!
                </p>
              </div>

              <div className="panda-container">
                <form onSubmit={handleSignup}>
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    ref={fullNameRef}
                    type="text"
                    id="fullName"
                    className="panda-input"
                    placeholder="John Doe"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    onFocus={handleTextFocus}
                    required
                  />
                  <label htmlFor="email">Email</label>
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    className="panda-input"
                    placeholder="hello@example.com"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    onFocus={handleTextFocus}
                    required
                  />
                  <label htmlFor="password">Password</label>
                  <input
                    ref={passwordRef}
                    type="password"
                    id="password"
                    className="panda-input"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    onFocus={handlePasswordFocus}
                    required
                  />

                  <button className="panda-btn" type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs inline-block mr-2"></span>
                        Creating...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </button>

                  <div style={{ marginTop: "1em", textAlign: "center" }}>
                    <p className="text-sm text-black">
                      Already have an account?{" "}
                      <Link to="/login" className="text-primary hover:underline">
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>

                {/* 🐼 PANDA ELEMENTS */}
                <div className="ear-l"></div>
                <div className="ear-r"></div>
                <div className="panda-face">
                  <div className="blush-l"></div>
                  <div className="blush-r"></div>
                  <div className="eye-l"><div ref={eyeLRef} className="eyeball-l"></div></div>
                  <div className="eye-r"><div ref={eyeRRef} className="eyeball-r"></div></div>
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

        {/* RIGHT - IMAGE */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUpPage;
