import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from './Button';

const ModeSwitcherWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
//   flex: 1;
  gap: ${({ theme }) => theme.spacing.small};
`;


const ModeSwitcher = ({ languageMode, setLanguageMode }) => {
    const switchLanguage = () => {
        if (languageMode === 'spanishHelp') {
            setLanguageMode('englishHelp');
        } else {
            setLanguageMode('spanishHelp');
        }
    }

    return (
        <ModeSwitcherWrapper>
            <Button onClick={switchLanguage} variant="secondary">
                {languageMode === 'spanishHelp' ? '🇲🇽' : '🇺🇸'}
            </Button>
        </ModeSwitcherWrapper>
    );
}

ModeSwitcher.propTypes = {
    languageMode: PropTypes.string.isRequired,
    setLanguageMode: PropTypes.func.isRequired,
};

export default ModeSwitcher;