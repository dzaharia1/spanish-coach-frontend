import PropTypes from "prop-types";
import styled from "styled-components";
import IconButton from "./IconButton";

const pulse = `
  @keyframes pulse {
    0% {
      opacity: 0.35;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0.35;
    }
  }
`;

const StyledLoadingIndicator = styled.div`
  ${pulse}
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.large};

  bottom: calc(100% - ${({ theme }) => theme.spacing.large});
  left: ${({ theme }) => theme.spacing.xLarge};
  right: ${({ theme }) => theme.spacing.xLarge};
  transform: ${(props) =>
    props.$active ? "translateY(0)" : "translateY(100%)"};
  transition: transform 0.2s ease;
  z-index: -1;

  padding: ${({ theme }) => theme.spacing.small}
    ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadii.large}
    ${({ theme }) => theme.borderRadii.large} 0 0;

  @media (prefers-color-scheme: light) {
    background-color: ${({ theme }) => theme.lightTheme.colors.background};
    color: ${({ theme }) => theme.lightTheme.colors.text};
    border: 1px solid rgba(0, 0, 0, 0.1);
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${({ theme }) => theme.darkTheme.colors.background};
    color: ${({ theme }) => theme.darkTheme.colors.text};
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  @media (min-width: 768px) {
    bottom: unset;
    top: calc(100% - ${({ theme }) => theme.spacing.large});
    left: ${({ theme }) => theme.spacing.xLarge};
    right: ${({ theme }) => theme.spacing.xLarge};
    transform: ${(props) =>
      props.$active ? "translateY(0)" : "translateY(-100%)"};
    border-radius: 0 0 ${({ theme }) => theme.borderRadii.large}
      ${({ theme }) => theme.borderRadii.large};
  }
`;

const Dot = styled.div`
  animation: pulse 1.5s infinite;
  width: ${({ theme }) => theme.spacing.small};
  height: ${({ theme }) => theme.spacing.small};
  border-radius: 50%;
  margin: 0;
  background: linear-gradient(180deg, rgba(95, 70, 252, 0.78), #5f46fc);
`;

const LoadingText = styled.p`
  animation: pulse 1.5s infinite;
  text-align: left;
  margin: 0;
  flex: 1;
`;

const LoadingIndicator = ({ active, text = "Thinking", stopAction }) => {
  return (
    <StyledLoadingIndicator $active={active}>
      <Dot />
      <LoadingText>{text}</LoadingText>
      <IconButton icon="stop" onClick={stopAction} />
    </StyledLoadingIndicator>
  );
};

LoadingIndicator.propTypes = {
  active: PropTypes.bool.isRequired,
  text: PropTypes.string,
  stopAction: PropTypes.func,
};

export default LoadingIndicator;
