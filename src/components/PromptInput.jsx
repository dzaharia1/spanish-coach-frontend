import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import IconButton from './IconButton';
import Button from './Button';

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
  
`;

const StyledInput = styled.textarea`
  border: none;
  font-size: 1.5rem;
  padding: ${({ theme }) => theme.spacing.small};
  width: 100%;
  outline: none;
  resize: vertical;
  min-height: 2.5rem;
  overflow: hidden;
  line-height: 1.5;

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

const ButtonRow = styled.div`    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;

    @keyframes pulse {
      0% { opacity: .65; }
      50% { opacity: 1; }
      100% { opacity: .65; }
    }

    p {
      font-weight: 700;
      margin: 0;
      animation: pulse .75s ease-in-out infinite;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.small};
`;

const PromptInput = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input);
    }
  };

  const handleClear = () => {
    setInput('');
    document.querySelector('textarea').focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <InputWrapper>
      <StyledInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter text to translate..."
      />
      <ButtonRow>
        <div>
          {isLoading && (
            <p>Translating...</p>
          )}
        </div>
        <ButtonGroup>
            <IconButton icon="delete" onClick={handleClear} disabled={input === ""} />
            <Button onClick={handleSubmit} disabled={input === ""}>Translate</Button>
        </ButtonGroup>
      </ButtonRow>
    </InputWrapper>
  );
};

PromptInput.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default PromptInput;

