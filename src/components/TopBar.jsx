import PropTypes from "prop-types";
import styled from "styled-components";
import UserMenu from "./UserMenu";

const TopBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: calc(${({ theme }) => theme.spacing.small} * -1);
`;

const HistoryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xSmall};
  padding: ${({ theme }) => theme.spacing.xSmall}
    ${({ theme }) => theme.spacing.medium};
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.borderRadii.medium};
  border: 1px solid;
  cursor: pointer;
  background: transparent;

  @media (prefers-color-scheme: light) {
    color: ${({ theme }) => theme.lightTheme.colors.text};
    border-color: ${({ theme }) => theme.lightTheme.colors.border};
  }
  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.darkTheme.colors.text};
    border-color: ${({ theme }) => theme.darkTheme.colors.border};
  }

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  img {
    width: 1.1rem;
    height: 1.1rem;
  }
`;

const TopBar = ({ user, onOpenHistory, onSignOut, languageMode }) => {
  if (!user) return null;

  return (
    <TopBarContainer>
      <HistoryButton type="button" onClick={onOpenHistory}>
        <img src="/history.svg" alt="" />
        {languageMode === "spanishHelp" ? "History" : "Historial"}
      </HistoryButton>
      <UserMenu user={user} onSignOut={onSignOut} />
    </TopBarContainer>
  );
};

TopBar.propTypes = {
  user: PropTypes.object,
  onOpenHistory: PropTypes.func,
  onSignOut: PropTypes.func,
  languageMode: PropTypes.string.isRequired,
};

export default TopBar;
