import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import IconButton from './IconButton';
import Button from './button';

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
  gap: 1rem;
  width: 100%;
  margin: 0 auto;
`;

const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.5rem;
`;

const PromptInput = ({ onSubmit }) => {
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
        {input !== "" && (
            <ButtonGroup style={{ position: 'absolute', top: '28px', right: '28px' }}>
                <IconButton 
                icon={['fa', 'broom']}
                onClick={handleClear}
                />
                <Button onClick={handleSubmit}>Translate</Button>
            </ButtonGroup>
        )}
    </InputWrapper>
  );
};

PromptInput.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default PromptInput;
