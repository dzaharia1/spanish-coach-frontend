
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  font-family: inherit;
  flex: 1;
`;

const ToggleButton = styled.button`
  appearance: none;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.lightTheme?.colors?.border || '#ccc'};
  border-radius: ${({ theme }) => theme.borderRadii?.medium || '8px'};
  padding: ${({ theme }) => theme.spacing?.small || '8px'} ${({ theme }) => theme.spacing?.medium || '16px'};
  padding-right: 2.5rem;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  color: inherit;
  display: flex;
  align-items: center;
  min-width: 120px;
  position: relative;
  transition: all 0.2s ease;

  @media (prefers-color-scheme: light) {
    color: ${({ theme }) => theme.lightTheme?.colors?.text || '#000'};
    border-color: ${({ theme }) => theme.lightTheme?.colors?.border || '#ccc'};
    background-color: ${({ theme }) => theme.lightTheme?.colors?.backgroundSecondary || '#f5f5f5'};
  }

  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.darkTheme?.colors?.text || '#fff'};
    border-color: ${({ theme }) => theme.darkTheme?.colors?.border || '#555'};
    background-color: ${({ theme }) => theme.darkTheme?.colors?.backgroundSecondary || '#333'};
  }

  &:hover {
    opacity: 0.9;
  }
`;

const Arrow = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%) rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0deg')});
  transition: transform 0.2s ease;
  pointer-events: none;
  font-size: 0.8em;
`;

const DropdownMenu = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 300px; /* Fixed width for the rich content */
  margin-bottom: 8px;
  border-radius: ${({ theme }) => theme.borderRadii?.medium || '8px'};
  overflow: hidden;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 4px;

  @media (prefers-color-scheme: light) {
    background-color: ${({ theme }) => theme.lightTheme?.colors?.background || '#fff'};
    border: 1px solid ${({ theme }) => theme.lightTheme?.colors?.border || '#eee'};
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.darkTheme?.colors?.background || '#222'};
    border: 1px solid ${({ theme }) => theme.darkTheme?.colors?.border || '#444'};
  }
`;

const MenuItem = styled.div`
  padding: 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  background-color: ${({ $isSelected, theme }) =>
    $isSelected
      ? (theme.lightTheme ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)')
      : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => theme.lightTheme ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'};
  }

  h3 {
    margin: 0 0 4px 0;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    opacity: 0.8;
    line-height: 1.4;
  }
`;

const ModelSelector = ({ model, setModel, languageMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const isSpanish = languageMode === 'spanishHelp';

  const options = [
    {
      value: 'complete',
      label: isSpanish ? 'Completo' : 'Complete',
      description: isSpanish
        ? 'Dame una lección breve sobre mi entrada, con notas culturales y gramaticales'
        : 'Give me a short lesson around my input, with cultural and grammatical notes'
    },
    {
      value: 'concise',
      label: isSpanish ? 'Conciso' : 'Concise',
      description: isSpanish
        ? 'Simplemente traduce rápido mi inglés y corrige mi español'
        : 'Just quickly translate my english and proofread my Spanish'
    }
  ];

  const selectedOption = options.find(opt => opt.value === model) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Wrapper ref={wrapperRef}>
      <ToggleButton onClick={() => setIsOpen(!isOpen)} type="button">
        {selectedOption.label}
        <Arrow $isOpen={isOpen}>▼</Arrow>
      </ToggleButton>

      {isOpen && (
        <DropdownMenu>
          {options.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => {
                setModel(option.value);
                setIsOpen(false);
              }}
              $isSelected={model === option.value}
            >
              <h3>{option.label}</h3>
              <p>{option.description}</p>
            </MenuItem>
          ))}
        </DropdownMenu>
      )}
    </Wrapper>
  );
};

ModelSelector.propTypes = {
  model: PropTypes.string.isRequired,
  setModel: PropTypes.func.isRequired,
  languageMode: PropTypes.string.isRequired,
};

export default ModelSelector;
