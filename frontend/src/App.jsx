import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthenticateWithRedirectCallback, useUser } from "@clerk/clerk-react";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";

import { Toaster } from "react-hot-toast";

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";

const App = () => {
  const { isLoaded: isClerkLoaded, isSignedIn: isClerkSignedIn } = useUser();
  const { isLoading: isSyncLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();
  const location = useLocation();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  // Show loader if Clerk is still checking session OR if signed in and waiting for backend sync
  if (!isClerkLoaded || (isClerkSignedIn && isSyncLoading)) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isClerkSignedIn && !isAuthenticated ? (
              <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <PageLoader />
                <p className="mt-4 text-lg font-semibold animate-pulse">Connecting to your account...</p>
              </div>
            ) : isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isClerkSignedIn ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !isClerkSignedIn ? (
              <SignUpPage />
            ) : (
              <Navigate to={isAuthenticated && isOnboarded ? "/" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/login"
          element={
            !isClerkSignedIn ? (
              <LoginPage />
            ) : !isAuthenticated ? (
              <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
                <PageLoader />
                <p className="mt-4 text-lg font-semibold animate-pulse">Synchronizing your account...</p>
                <p className="text-sm text-foreground/50">This only takes a moment.</p>
              </div>
            ) : (
              <Navigate to={
                location.state?.from?.pathname || (isOnboarded ? "/" : "/onboarding")
              } />
            )
          }
        />

        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} state={{ from: location }} replace />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false} showNavbar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              <OnboardingPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Redirect /sign-in to /login */}
        <Route path="/sign-in" element={<Navigate to="/login" replace />} />

        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
