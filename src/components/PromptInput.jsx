import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import LoadingIndicator from "./LoadingIndicator";
import ModeSwitcher from "./ModeSwitcher";
import DoubleButton from "./DoubleButton";
import IconButton from "./IconButton";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadii.large};
  width: 100%;

  @media (prefers-color-scheme: light) {
    background-color: ${({ theme }) => theme.lightTheme.colors.background};
    color: ${({ theme }) => theme.lightTheme.colors.text};
    box-shadow: 0 2px 4px ${({ theme }) => theme.lightTheme.colors.shadow};
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.darkTheme.colors.background};
    color: ${({ theme }) => theme.darkTheme.colors.text};
    box-shadow: 0 2px 4px ${({ theme }) => theme.darkTheme.colors.shadow};
  }

  .clearButton {
    position: absolute;
    bottom: calc(100% + ${({ theme }) => theme.spacing.small});
    right: 0;

    @media (min-width: 768px) {
      position: relative;
      bottom: auto;
      right: auto;
    }
  }
`;

const StyledInput = styled.textarea`
  border: none;
  font-size: ${({ $inputLength }) => {
    if ($inputLength < 25) return "1.5rem";
    if ($inputLength < 50) return "1.25rem";
    if ($inputLength < 65) return "1rem";
    if ($inputLength < 85) return ".875rem";
    return ".8rem";
  }};
  padding: ${({ theme }) => theme.spacing.small};
  width: 100%;
  outline: none;
  resize: vertical;
  min-height: ${({ $inputLength }) => {
    if ($inputLength < 25) return "2.5rem";
    if ($inputLength < 50) return "3rem";
    if ($inputLength < 65) return "3.5rem";
    if ($inputLength < 85) return "4rem";
    return "4.5rem";
  }};
  overflow: hidden;
  line-height: 1.5;
  transition: font-size 0.2s ease;

  @media (prefers-color-scheme: light) {
    background-color: ${({ theme }) => theme.lightTheme.colors.inputBackground};
    color: ${({ theme }) => theme.lightTheme.colors.text};
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.darkTheme.colors.inputBackground};
    color: ${({ theme }) => theme.darkTheme.colors.text};
  }
  &::placeholder {
    @media (prefers-color-scheme: light) {
      color: ${({ theme }) => theme.lightTheme.colors.placeholder};
    }

    @media (prefers-color-scheme: dark) {
      color: ${({ theme }) => theme.darkTheme.colors.placeholder};
    }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
`;

const ButtonGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.small};
`;

const PromptInput = ({
  onSubmit,
  onStop,
  isLoading,
  languageMode,
  setLanguageMode,
}) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const [translationType, setTranslationType] = useState("concise");

  const handleSubmit = (model) => {
    setTranslationType(model);
    if (input.trim()) {
      onSubmit(input, model);
    }
  };

  const handleClear = () => {
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit("complete");
    }
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      handleSubmit("concise");
    }
  };

  useEffect(() => {
    handleClear();
    inputRef.current?.focus();
  }, [languageMode]);

  return (
    <>
      <LoadingIndicator
        active={isLoading}
        stopAction={onStop}
        text={
          languageMode === "spanishHelp"
            ? translationType === "concise"
              ? "Translating quickly..."
              : "Exploring..."
            : translationType === "concise"
              ? "Traduciendo rápidamente..."
              : "Explorando..."
        }
      />
      <InputWrapper>
        <StyledInput
          value={input}
          ref={inputRef}
          $inputLength={input.length}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            languageMode === "spanishHelp"
              ? "I can help you learn Spanish"
              : "Te ayudo a aprender inglés"
          }
        />
        <ButtonRow>
          <ButtonGroup>
            <ModeSwitcher
              languageMode={languageMode}
              setLanguageMode={setLanguageMode}
            />
            {/* {isLoading && <p className="loadingIndicator">Thinking...</p>} */}
            <IconButton
              className="clearButton"
              icon="delete"
              onClick={handleClear}
              disabled={input === "" || isLoading}
            />
            <DoubleButton
              primaryText={
                languageMode === "spanishHelp" ? "Explore" : "Explora"
              }
              secondaryText={
                languageMode === "spanishHelp" ? "Translate" : "Traduce"
              }
              primaryAction={() => handleSubmit("complete")}
              secondaryAction={() => handleSubmit("concise")}
              primaryDisabled={input === "" || isLoading}
              secondaryDisabled={input === "" || isLoading}
            />
          </ButtonGroup>
        </ButtonRow>
      </InputWrapper>
    </>
  );
};

PromptInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onStop: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  languageMode: PropTypes.string.isRequired,
  setLanguageMode: PropTypes.func.isRequired,
};

export default PromptInput;
