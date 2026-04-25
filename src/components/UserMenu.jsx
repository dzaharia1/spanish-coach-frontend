import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
`;

const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  background: transparent;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xSmall};
  border-radius: ${({ theme }) => theme.borderRadii.medium};

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const Avatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-color: ${({ theme }) => theme.lightTheme.colors.backgroundSecondary};
  background-image: ${({ $src }) => ($src ? `url(${$src})` : "none")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  color: white;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.xSmall});
  right: 0;
  min-width: 12rem;
  border-radius: ${({ theme }) => theme.borderRadii.medium};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  z-index: 200;
  overflow: hidden;

  @media (prefers-color-scheme: light) {
    background: ${({ theme }) => theme.lightTheme.colors.background};
    color: ${({ theme }) => theme.lightTheme.colors.text};
    border: 1px solid ${({ theme }) => theme.lightTheme.colors.border};
  }
  @media (prefers-color-scheme: dark) {
    background: ${({ theme }) => theme.darkTheme.colors.background};
    color: ${({ theme }) => theme.darkTheme.colors.text};
    border: 1px solid ${({ theme }) => theme.darkTheme.colors.border};
  }
`;

const Email = styled.div`
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  font-size: 0.85rem;
  opacity: 0.7;
  border-bottom: 1px solid;

  @media (prefers-color-scheme: light) {
    border-color: ${({ theme }) => theme.lightTheme.colors.border};
  }
  @media (prefers-color-scheme: dark) {
    border-color: ${({ theme }) => theme.darkTheme.colors.border};
  }
`;

const MenuItem = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  font-size: 0.95rem;
  color: inherit;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
`;

const initialsFor = (user) => {
  if (!user) return "";
  if (user.displayName) {
    return user.displayName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return user.email ? user.email[0].toUpperCase() : "?";
};

const UserMenu = ({ user, onSignOut }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!user) return null;

  return (
    <Wrapper ref={wrapperRef}>
      <Trigger onClick={() => setOpen((o) => !o)}>
        <Avatar $src={user.photoURL}>
          {!user.photoURL && initialsFor(user)}
        </Avatar>
      </Trigger>
      {open && (
        <Menu>
          <Email>{user.email || user.displayName}</Email>
          <MenuItem
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
          >
            Sign out
          </MenuItem>
        </Menu>
      )}
    </Wrapper>
  );
};

UserMenu.propTypes = {
  user: PropTypes.object,
  onSignOut: PropTypes.func.isRequired,
};

export default UserMenu;
