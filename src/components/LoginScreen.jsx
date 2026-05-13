import { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useAuth } from "../auth/AuthContext";
import { auditRecaptcha } from "../api/recaptcha";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.large};
  min-height: 100%;
  padding: ${({ theme }) => theme.spacing.xLarge};
  text-align: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;

  @media (prefers-color-scheme: light) {
    color: ${({ theme }) => theme.lightTheme.colors.text};
  }
  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.darkTheme.colors.text};
  }
`;

const Subtitle = styled.p`
  margin: 0;
  max-width: 28rem;
  line-height: 1.5;
  font-size: 1rem;

  @media (prefers-color-scheme: light) {
    color: ${({ theme }) => theme.lightTheme.colors.placeholder};
  }
  @media (prefers-color-scheme: dark) {
    color: ${({ theme }) => theme.darkTheme.colors.placeholder};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.medium};
  justify-content: center;
`;

const AuthButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s ease;
  border: none;

  background: ${({ $variant }) =>
    $variant === "primary"
      ? "linear-gradient(180deg, rgba(95, 70, 252, 0.78), #5F46FC)"
      : "white"};
  color: ${({ $variant }) => ($variant === "primary" ? "white" : "black")};
  box-shadow: ${({ $variant }) =>
    $variant === "primary"
      ? "0 4px 12px rgba(0, 0, 0, 0.4)"
      : "0 2px 8px rgba(0, 0, 0, 0.2)"};

  &:hover {
    background: ${({ $variant }) =>
      $variant === "primary" ? "rgb(67, 41, 233)" : "#F5F5F5"};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  img {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const ErrorText = styled.p`
  color: #d33;
  margin: 0;
  font-size: 0.9rem;
`;

const LoginScreen = ({ languageMode }) => {
  const { signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const isSpanish = languageMode === "spanishHelp";

  const handleSignIn = async () => {
    setBusy(true);
    setError(null);
    try {
      const token = await window.executeRecaptcha?.("LOGIN");
      const audit = await auditRecaptcha(token, "LOGIN");
      if (!audit.success || audit.score < 0.5) {
        setError("Security check failed. Please try again.");
        return;
      }
      await signInWithGoogle();
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message || "Sign-in failed");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Wrapper>
      <Title>
        {isSpanish ? "Save your translations" : "Guarda tus traducciones"}
      </Title>
      <Subtitle>
        {isSpanish
          ? "Log in or register to keep a searchable history of every translation you ask for."
          : "Inicia sesión o regístrate para guardar un historial buscable de cada traducción que pidas."}
      </Subtitle>
      <ButtonRow>
        <AuthButton
          $variant="primary"
          onClick={handleSignIn}
          disabled={busy}
        >
          <img src="/google.svg" alt="" />
          {isSpanish ? "Log in with Google" : "Inicia sesión con Google"}
        </AuthButton>
        <AuthButton
          $variant="secondary"
          onClick={handleSignIn}
          disabled={busy}
        >
          <img src="/google.svg" alt="" />
          {isSpanish ? "Register with Google" : "Regístrate con Google"}
        </AuthButton>
      </ButtonRow>
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  );
};

LoginScreen.propTypes = {
  languageMode: PropTypes.string.isRequired,
};

export default LoginScreen;
