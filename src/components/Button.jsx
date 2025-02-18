import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledButton = styled.button`
  padding: 10px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 15px;

  background: linear-gradient(180deg, rgba(95, 70, 252, 0.78), #5F46FC);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.38);
  font-weight: 700;
  color: white;
  transition: background-color 0.2s ease;

  img {
    width: 1.5rem;
    height: 1.5rem;
  }

  &:hover {
    background-color:rgb(67, 41, 233);
    outline: none;
  }

  &:active {
    background-color: rgb(67, 41, 233);
    outline: none;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const Button = ({ onClick, disabled, children, icon, ...props }) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled} {...props}>
      {icon && <img src={`/${icon}.svg`} alt="Icon" />}
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node
};

Button.defaultProps = {
  disabled: false
};

export default Button;
