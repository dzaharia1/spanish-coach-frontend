import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import IconButton from "./IconButton";
import ModeSwitcher from "./ModeSwitcher";
import DoubleButton from "./DoubleButton";

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

const LoadingIndicator = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.large};

  bottom: calc(100% - ${({ theme }) => theme.spacing.large});
  left: ${({ theme }) => theme.spacing.xLarge};
  right: ${({ theme }) => theme.spacing.xLarge};
  transform: ${(props) =>
    props.active ? "translateY(0)" : "translateY(100%)"};
  transition: transform 0.2s ease;
  z-index: -1;

  padding: ${({ theme }) => theme.spacing.small}
    ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadii.small}
    ${({ theme }) => theme.borderRadii.small} 0 0;

  @media (prefers-color-scheme: light) {
    background-color: ${({ theme }) => theme.lightTheme.colors.background};
    color: ${({ theme }) => theme.lightTheme.colors.text};
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.darkTheme.colors.background};
    color: ${({ theme }) => theme.darkTheme.colors.text};
  }

  @media (min-width: 768px) {
    bottom: unset;
    top: calc(100% - ${({ theme }) => theme.spacing.large});
    left: ${({ theme }) => theme.spacing.xLarge};
    right: ${({ theme }) => theme.spacing.xLarge};
    transform: ${(props) =>
      props.active ? "translateY(0)" : "translateY(-100%)"};
    border-radius: 0 0 ${({ theme }) => theme.borderRadii.small}
      ${({ theme }) => theme.borderRadii.small};
  }

  @keyframes pulse {
    0% {
      opacity: 0.35;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0.35;
    }
  }

  .dot {
    animation: pulse 1.5s infinite;
    width: ${({ theme }) => theme.spacing.small};
    height: ${({ theme }) => theme.spacing.small};
    border-radius: 50%;
    margin: 0;
    background: linear-gradient(180deg, rgba(95, 70, 252, 0.78), #5f46fc);
  }

  p {
    animation: pulse 1.5s infinite;
    text-align: left;
    margin: 0;
  }
`;

const PromptInput = ({
  onSubmit,
  isLoading,
  languageMode,
  setLanguageMode,
}) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (model) => {
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
  };

  useEffect(() => {
    handleClear();
    inputRef.current?.focus();
  }, [languageMode]);

  return (
    <>
      <LoadingIndicator active={isLoading}>
        <div className="dot"></div>
        <p>Thinking</p>
      </LoadingIndicator>
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
                languageMode === "spanishHelp" ? "Explain" : "Explica"
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
  isLoading: PropTypes.bool.isRequired,
  languageMode: PropTypes.string.isRequired,
  setLanguageMode: PropTypes.func.isRequired,
};

export default PromptInput;
