import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StyledIconButton = styled.button`
  padding: 8px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #4a90e2;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #357abd;
  }

  &:active {
    background-color: #2b62a1;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const IconButton = ({ icon, onClick, disabled, ...props }) => {
  return (
    <StyledIconButton onClick={onClick} disabled={disabled} {...props}>
      <FontAwesomeIcon 
        icon={icon}
        size="lg"
        fixedWidth
        style={{ width: '1em', height: '1em' }}
      />
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
