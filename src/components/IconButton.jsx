import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 15px;

  background-color: #FCFCFD;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);

  color: white;
  cursor: pointer;
  font-size: 1rem;
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
