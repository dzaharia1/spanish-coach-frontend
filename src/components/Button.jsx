import styled from "styled-components";
import PropTypes from "prop-types";

const ButtonWrapper = styled.div`
  position: relative;
  display: inline-flex;

  &:hover .toolTip {
    display: block;
  }
`;

const StyledButton = styled.button`
  padding: 10px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 12px;

  background: ${({ variant }) =>
    variant === "primary"
      ? "linear-gradient(180deg, rgba(95, 70, 252, 0.78), #5F46FC)"
      : "white"};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.38);
  box-shadow: ${({ variant }) =>
    variant === "primary"
      ? "0 4px 12px rgba(0, 0, 0, 0.4)"
      : "0 2px 8px rgba(0, 0, 0, 0.2)"};
  font-weight: 700;
  color: white;
  color: ${({ variant }) => (variant === "primary" ? "white" : "black")};
  transition: background-color 0.2s ease;

  img {
    width: 1.5rem;
    height: 1.5rem;
  }

  &:hover {
    background-color: ${({ variant }) =>
      variant === "primary" ? "rgb(67, 41, 233)" : "white"};
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

const ToolTip = styled.div`
  display: none;
  position: absolute;
  bottom: calc(100% + ${({ theme }) => theme.spacing.small});
  right: 50%;
  transform: translateX(50%);
  width: 150%;
  max-width: 250px;
  z-index: 10;

  padding: ${({ theme }) => theme.spacing.small};
  border-radius: 12px;

  font-size: 0.8rem;
  text-align: left;

  @media (prefers-color-scheme: light) {
    background-color: ${({ theme }) => theme.lightTheme.colors.background};
    color: ${({ theme }) => theme.lightTheme.colors.text};
    border: 1px solid ${({ theme }) => theme.lightTheme.colors.border};
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.darkTheme.colors.background};
    color: ${({ theme }) => theme.darkTheme.colors.text};
    border: 1px solid ${({ theme }) => theme.darkTheme.colors.border};
  }

  @media (max-width: 768px) {
    display: none !important;
  }
`;

const Button = ({
  onClick,
  disabled,
  children,
  icon,
  variant = "primary",
  toolTipText,
  ...props
}) => {
  return (
    <ButtonWrapper>
      <StyledButton
        onClick={onClick}
        disabled={disabled}
        variant={variant}
        {...props}
      >
        {icon && <img src={`/${icon}.svg`} alt="Icon" />}
        {children}
      </StyledButton>
      {toolTipText && <ToolTip className="toolTip">{toolTipText}</ToolTip>}
    </ButtonWrapper>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  variant: PropTypes.oneOf(["primary", "secondary"]),
  icon: PropTypes.string,
  toolTipText: PropTypes.string,
};

Button.defaultProps = {
  disabled: false,
};

export default Button;
