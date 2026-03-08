import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "stream-chat-react/dist/css/v2/index.css";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SocketContextProvider } from "./context/SocketContext.jsx";
import { ChatContextProvider } from "./context/ChatContext.jsx";

import { ClerkProvider } from "@clerk/clerk-react";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      signInUrl="/login"
      signUpUrl="/signup"
      appearance={{
        baseTheme: undefined,
        variables: { colorPrimary: "#2563eb" },
      }}
    >
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <SocketContextProvider>
            <ChatContextProvider>
              <App />
            </ChatContextProvider>
          </SocketContextProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
