import { useState, useEffect } from "react";
import styled from "styled-components";
import PromptInput from "./components/PromptInput";
import TranslationResponse from "./components/TranslationResponse";
import "./App.css";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, spacing, borderRadii } from "./theme";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
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
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [languageMode, setLanguageMode] = useState(
    localStorage.getItem("languageMode") || routes[0],
  );

  useEffect(() => {
    localStorage.setItem("languageMode", languageMode);
  }, [languageMode]);

  const handleSubmit = async (text, model) => {
    try {
      setIsLoading(true);
      setTranslation(""); // Clear previous translation

      const apiUrl = `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/${languageMode}`;
      console.log("Making request to:", apiUrl); // Add debugging

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, model }),
      });

      if (!response.ok) {
        // Add error handling for non-200 responses
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`,
        );
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              setTranslation((prev) => prev + data.text);
            }
            if (data.error) {
              console.error(data.error);
              setTranslation("Error: " + data.error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setTranslation("Error occurred while translating");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <Header>
          <PromptInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
            languageMode={languageMode}
            setLanguageMode={setLanguageMode}
          />
        </Header>
        <ContentArea>
          <TranslationResponse
            translation={translation}
            languageMode={languageMode}
          />
        </ContentArea>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
