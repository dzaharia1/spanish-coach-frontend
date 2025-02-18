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
    margin: 1em 0;
    width: 100%;
  }
  
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  th {
    background-color: #f5f5f5;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
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
