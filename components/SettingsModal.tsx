import React from 'react';

// FIX: Per @google/genai Coding Guidelines, UI elements for managing API keys are not permitted.
// The API key must be sourced exclusively from `process.env.API_KEY`.
// This component has been disabled to comply with the guidelines, which also resolves the missing icon error.

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentApiKey: string | null;
}

const SettingsModal: React.FC<SettingsModalProps> = () => {
  return null;
};

export default SettingsModal;
