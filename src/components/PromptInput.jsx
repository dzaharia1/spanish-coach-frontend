import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import IconButton from './IconButton';
import Button from './Button';

const StyledInput = styled.textarea`
  border: none;
  font-size: 1.5rem;
  padding: 0.5rem;
  width: 100%;
  outline: none;
  resize: vertical;
  min-height: 2.5rem;
  overflow: hidden;
  line-height: 1.5;
  
  &::placeholder {
    color: #999;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: .75rem;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.38);
  width: 100%;
`;

const ButtonRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
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
      {input !== "" &&
        <ButtonRow>
          {isLoading && (
            <p>Translating...</p>
          )}
          <ButtonGroup>
              <IconButton icon="delete" onClick={handleClear} />
              <Button onClick={handleSubmit}>Translate</Button>
          </ButtonGroup>
        </ButtonRow>
      }
    </InputWrapper>
  );
};

PromptInput.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default PromptInput;
