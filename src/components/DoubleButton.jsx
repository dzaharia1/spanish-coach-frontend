import PropTypes from "prop-types";
import styled from "styled-components";
import Button from "./Button";

const DoubleButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xSmall};

  button:first-child {
    border-radius: 12px 6px 6px 12px;
  }

  button:last-child {
    border-radius: 6px 12px 12px 6px;
  }
`;

const DoubleButton = ({
  primaryText,
  secondaryText,
  primaryToolTip,
  secondaryToolTip,
  primaryAction,
  secondaryAction,
  primaryDisabled,
  secondaryDisabled,
}) => {
  return (
    <DoubleButtonContainer>
      <Button
        variant="primary"
        onClick={primaryAction}
        disabled={primaryDisabled}
        toolTipText={primaryToolTip}
      >
        {primaryText}
      </Button>
      <Button
        variant="primary"
        onClick={secondaryAction}
        disabled={secondaryDisabled}
        toolTipText={secondaryToolTip}
      >
        {secondaryText}
      </Button>
    </DoubleButtonContainer>
  );
};

DoubleButton.propTypes = {
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string.isRequired,
  primaryToolTip: PropTypes.string,
  secondaryToolTip: PropTypes.string,
  primaryAction: PropTypes.func.isRequired,
  secondaryAction: PropTypes.func.isRequired,
  primaryDisabled: PropTypes.bool,
  secondaryDisabled: PropTypes.bool,
};

DoubleButton.defaultProps = {
  primaryDisabled: false,
  secondaryDisabled: false,
};

export default DoubleButton;
