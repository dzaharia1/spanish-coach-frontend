import { useState } from 'react'
import styled from 'styled-components'
import PromptInput from './components/PromptInput'
import TranslationResponse from './components/TranslationResponse'
import './App.css'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: 100vh;
  overflow: hidden;

  @media (screen and (max-width: 768px)) {
    flex-direction: column;
  }
`;

const Header = styled.header`
  padding: 1rem;
  z-index: 100;

  @media (prefers-color-scheme: dark) {
    background: var(--color-bg-dark);
  }
`;

const ContentArea = styled.main`
  flex: 1;
  overflow: scroll;
  padding: 2rem;

  @media (prefers-color-scheme: dark) {
    background: var(--color-bg-dark);
  }
`;

function App() {
  const [translation, setTranslation] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (text) => {
    try {
      setIsLoading(true)
      setTranslation('') // Clear previous translation
      
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/translate`;
      console.log('Making request to:', apiUrl); // Add debugging

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        // Add error handling for non-200 responses
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              setTranslation(prev => prev + data.text);
            }
            if (data.error) {
              console.error(data.error);
              setTranslation('Error: ' + data.error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setTranslation('Error occurred while translating');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppContainer>
      <Header>
        <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />
      </Header>
      <ContentArea>
        <TranslationResponse translation={translation} />
      </ContentArea>
    </AppContainer>
  )
}

export default App
