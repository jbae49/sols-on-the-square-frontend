// App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Menu from './Menu'; // Ensure you have this component created as per your setup
import { CartProvider } from './contexts/CartContext'; // Ensure this context is set up
import Cart from './components/Cart'; // Ensure you have this component created as per your setup
import LanguageSelectionModal from './components/LanguageSelectionModal'; // Ensure you've created this component
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
  const [sessionId, setSessionId] = useState(null); // State to store the session ID

  const handleLanguageSelected = (lang) => {
    axios.post('http://127.0.0.1:5000/api/save-language', { language: lang })
      .then(response => console.log(response.data))
      .catch(error => console.error('Error posting language selection:', error));
  };

  useEffect(() => {
    let isMounted = true; // Flag to handle async operation

    // Function to track the visit start
    const trackVisit = async () => {
      try {
        const response = await axios.post('http://127.0.0.1:5000/track-visit', {});
        console.log('Visit tracked successfully.');
        if (isMounted) {
          setSessionId(response.data.sessionId); // Save the session ID from the response
        }
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();

    // Add event listener for beforeunload to handle when the user leaves
    const updateSessionEnd = async () => {
      if (sessionId) { // Only send if sessionId is set
        try {
          await axios.post('http://127.0.0.1:5000/update-session-end', { sessionId });
          console.log('Session end updated successfully.');
        } catch (error) {
          console.error('Error updating session end:', error);
        }
      }
    };

    window.addEventListener('beforeunload', updateSessionEnd);

    // Cleanup function
    return () => {
      isMounted = false; // Prevent setting state on unmounted component
      window.removeEventListener('beforeunload', updateSessionEnd);
      // Remove the direct call to updateSessionEnd here to prevent multiple additions
    };
  }, []); // Empty dependency array to ensure this effect only runs once on mount

  return (
    <div>
      <LanguageProvider>
        <CartProvider>
          <LanguageSelectionModal onLanguageSelected={handleLanguageSelected} />
          <div className="App">
            <Menu />
            <Cart />
          </div>
        </CartProvider>
      </LanguageProvider>
      <div className='tip-julia'>
        Loved the digital menu? 💓<br />
        <a href="https://account.venmo.com/u/juliabae">
          Feel free to drop Julia a tip for creating this!
        </a>
      </div>
    </div>
  );
}

export default App;
