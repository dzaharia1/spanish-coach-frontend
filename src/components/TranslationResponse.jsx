// import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ResponseContainer = styled.div`
  text-align: left;
  max-width: 800px;
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

const TranslationResponse = ({ translation }) => {
  return (
    <ResponseContainer>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{translation}</ReactMarkdown>
    </ResponseContainer>
  );
};

TranslationResponse.propTypes = {
  translation: PropTypes.string.isRequired
};

export default TranslationResponse;
