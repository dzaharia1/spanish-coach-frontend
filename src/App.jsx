import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import PromptInput from "./components/PromptInput";
import TranslationResponse from "./components/TranslationResponse";
import LoginScreen from "./components/LoginScreen";
import HistoryModal from "./components/HistoryModal";
import "./App.css";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, spacing, borderRadii } from "./theme";
import { useAuth } from "./auth/AuthContext";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.large} 0;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    padding: 0;
  }
`;

const Header = styled.header`
  position: relative;

  padding: ${({ theme }) => theme.spacing.large};
  z-index: 100;

  @media (prefers-color-scheme: dark) {
    background: var(--color-bg-dark);
  }
`;

const ContentArea = styled.main`
  flex: 1;
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
  padding: ${({ theme }) => theme.spacing.large}
    ${({ theme }) => theme.spacing.xLarge};

  @media (prefers-color-scheme: dark) {
    background: var(--color-bg-dark);
  }
`;

const theme = {
  lightTheme,
  darkTheme,
  spacing,
  borderRadii,
};

const routes = ["spanishHelp", "englishHelp"];

function App() {
  const { user, loading: authLoading, getIdToken, signOut } = useAuth();
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [languageMode, setLanguageMode] = useState(
    localStorage.getItem("languageMode") || routes[0],
  );
  const abortControllerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("languageMode", languageMode);
  }, [languageMode]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleSubmit = async (text, model) => {
    try {
      setIsLoading(true);

      // Generate recaptcha token
      const recaptchaToken = await window.executeRecaptcha?.("TRANSLATE");

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const apiUrl = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/${languageMode}`;

      const headers = { "Content-Type": "application/json" };
      const idToken = await getIdToken();
      if (idToken) headers.Authorization = `Bearer ${idToken}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ text, model, recaptchaToken }),
        signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`,
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let isFirstChunk = true;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (isFirstChunk && (data.text || data.error)) {
                let content = "";
                if (data.text) content += data.text;
                if (data.error) content += "Error: " + data.error;
                setTranslation(content);
                isFirstChunk = false;
              } else {
                if (data.text) {
                  setTranslation((prev) => prev + data.text);
                }
                if (data.error) {
                  console.error(data.error);
                  setTranslation((prev) => prev + "Error: " + data.error);
                }
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error:", error);
        setTranslation("Error occurred while translating");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleSignOut = async () => {
    await window.executeRecaptcha?.("LOGOUT");
    await signOut();
  };

  const showLoginScreen = !authLoading && !user && !translation && !isLoading;

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Header>
          <PromptInput
            onSubmit={handleSubmit}
            onStop={handleStop}
            isLoading={isLoading}
            languageMode={languageMode}
            setLanguageMode={setLanguageMode}
            user={user}
            onOpenHistory={() => setHistoryOpen(true)}
            onSignOut={handleSignOut}
          />
        </Header>
        <ContentArea>
          {showLoginScreen ? (
            <LoginScreen languageMode={languageMode} />
          ) : (
            <TranslationResponse
              translation={translation}
              languageMode={languageMode}
            />
          )}
        </ContentArea>
        <HistoryModal
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          user={user}
        />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
