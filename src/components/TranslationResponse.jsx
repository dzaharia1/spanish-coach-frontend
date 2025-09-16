// import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import remarkGfm from 'remark-gfm';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ResponseContainer = styled.div`
  text-align: left;
  /* max-width: 800px; */
  margin: 0;
  
  table {
    border-collapse: collapse;
    margin: ${({ theme }) => theme.spacing.large} 0;
    width: 100%;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: ${({ theme }) => theme.spacing.small};
    text-align: left;
  }
  
  th {
    background-color: ${({ theme }) => theme.lightTheme.colors.background};
    color: ${({ theme }) => theme.lightTheme.colors.text};

    @media (prefers-color-scheme: dark) {
      background-color: ${({ theme }) => theme.darkTheme.colors.background};
      color: ${({ theme }) => theme.darkTheme.colors.text};
    }
  }
  
  tr {
    color: ${({ theme }) => theme.lightTheme.colors.text};

    @media (prefers-color-scheme: dark) {
      color: ${({ theme }) => theme.darkTheme.colors.text};
    }
  }
`;

const spanishLearnerEmptyMessage = `
### Welcome to my language coach!

You can enter anything you want in either Spanish or English, and I'll figure out how to help you.

For instance:

#### Enter a verb
I'll tell you what it means and give you a conjugation table. If your verb is in English, I'll give you some options on how to say it in Spanish.

#### Enter a phrase
If it's in English, I'll show you how to say it in Spanish, with dialectic and regional notes. if it's in Spanish, I'll offer you corrections and suggestions for improvement.
`;

const englishLearnerEmptyMessage = `
### Bienvenidos a mi entrenedor de idioma!

Puedes ingresar cualquier cosa que quieras en español o inglés, y te ayudaré.

Por ejemplo:

#### Ingresa un verbo

Te diré qué significa y te daré una tabla de conjugación. Si tu verbo está en inglés, te daré algunas opciones sobre cómo decirlo en español.

#### Ingresa una frase
Si está en español, te mostraré cómo decirlo en inglés. Si está en español, te ofreceré correcciones y sugerencias para mejorar.

`;

const TranslationResponse = ({ translation, languageMode }) => {
  const [emptyMessage, setEmptyMessage] = useState(languageMode === 'spanishHelp' ? spanishLearnerEmptyMessage : englishLearnerEmptyMessage)

  useEffect(() => {
    if (languageMode === 'spanishHelp') {
      setEmptyMessage(spanishLearnerEmptyMessage);
    } else {
      setEmptyMessage(englishLearnerEmptyMessage);
    }
  }, [languageMode])

  return (
    <ResponseContainer>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{translation !== '' ? translation : emptyMessage}</ReactMarkdown>
    </ResponseContainer>
  );
};

TranslationResponse.propTypes = {
  translation: PropTypes.string.isRequired,
  languageMode: PropTypes.string.isRequired,
};

export default TranslationResponse;
