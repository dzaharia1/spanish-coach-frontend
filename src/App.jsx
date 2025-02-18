import { useState } from 'react'
import styled from 'styled-components'
import PromptInput from './components/PromptInput'
import TranslationResponse from './components/TranslationResponse'
import './App.css'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const Header = styled.header`
  position: sticky;
  width: 100%;
  top: 0;
  background: var(--color-bg-light);
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;

  @media (prefers-color-scheme: dark) {
    background: var(--color-bg-dark);
  }
`;

const ContentArea = styled.main`
  flex: 1;
  overflow-y: auto;
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
      
      const response = await fetch('http://localhost:3000/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

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
        <PromptInput onSubmit={handleSubmit} />
      </Header>
      <ContentArea>
        <TranslationResponse translation={translation} />
      </ContentArea>
    </AppContainer>
  )
}

export default App
