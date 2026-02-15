import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledButton = styled.button`
  padding: 10px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 15px;

  background: ${({ variant }) => variant === 'primary' ? 'linear-gradient(180deg, rgba(95, 70, 252, 0.78), #5F46FC)' : 'white'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.38);
  box-shadow: ${({ variant }) => variant === 'primary' ? '0 4px 12px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.2)'};
  font-weight: 700;
  color: white;
  color: ${({ variant }) => variant === 'primary' ? 'white' : 'black'};
  transition: background-color 0.2s ease;

  img {
    width: 1.5rem;
    height: 1.5rem;
  }

  &:hover {
    background-color: ${({ variant }) => variant === 'primary' ? 'rgb(67, 41, 233)' : 'white'};
    outline: none;
  }

  &:active {
    background-color: rgb(67, 41, 233);
    outline: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Button = ({ onClick, disabled, children, icon, variant = 'primary', ...props }) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled} variant={variant} {...props}>
      {icon && <img src={`/${icon}.svg`} alt="Icon" />}
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  icon: PropTypes.string
};

Button.defaultProps = {
  disabled: false
};

export default Button;
