import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../contexts/LanguageContext'; // Adjust the import path as necessary
import './LanguageSelectionModal.css'; // Assuming you have a CSS file for styling

function LanguageSelectionModal() {
    const { handleLanguageChange } = useLanguage(); // Use the context
    const [showModal, setShowModal] = useState(true);
    const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default language

    useEffect(() => {
        if (!showModal) {
            axios.post('https://api.solsonthesquare.online/api/save-language', { language: selectedLanguage })
                .then(response => console.log(response.data))
                .catch(error => console.error('Error posting language selection:', error));
            // Apply the language change using the context method
            handleLanguageChange(selectedLanguage);
        }
    }, [showModal, selectedLanguage, handleLanguageChange]); // Add handleLanguageChange to the dependency array

    if (!showModal) return null;

    const selectLanguage = (lang) => {
        setSelectedLanguage(lang);
        setShowModal(false); // This will trigger the useEffect and change the language
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Select Language</h2>
                <button className="language-button" onClick={() => selectLanguage('en')}>English</button>
                <button className="language-button" onClick={() => selectLanguage('ko')}>한국어</button>
                <button className="language-button" onClick={() => selectLanguage('ch')}>中文</button>
                <h3>Add to cart and show it to our server</h3>
            </div>
        </div>
    );
}

export default LanguageSelectionModal;
