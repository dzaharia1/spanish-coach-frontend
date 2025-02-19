import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px;
  width: 2.75rem;
  height: 2.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 15px;

  @media (prefers-color-scheme: light) {
    background-color: ${({ theme }) => theme.lightTheme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.lightTheme.colors.text};
    box-shadow: 0 2px 4px ${({ theme }) => theme.lightTheme.colors.shadow};
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.darkTheme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.darkTheme.colors.text};
    box-shadow: 0 2px 4px ${({ theme }) => theme.darkTheme.colors.shadow};
  }

  cursor: pointer;
  transition: background-color 0.2s ease;

  img {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  &:hover {
    background-color: darken(rgba(0, 0, 0, .25), .25);
  }

  &:active {
    background-color: darken(rgba(0, 0, 0, .25), .25);
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const IconButton = ({ icon, onClick, disabled, ...props }) => {
  return (
    <StyledIconButton onClick={onClick} disabled={disabled} {...props}>
      <img src={`/${icon}.svg`} alt="Icon" />
    </StyledIconButton>
  );
};

IconButton.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

IconButton.defaultProps = {
  disabled: false
};

export default IconButton;
