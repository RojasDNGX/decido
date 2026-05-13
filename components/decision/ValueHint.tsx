'use client';

import { useState, useEffect } from 'react';

const MESSAGES = [
  "Essa decisão é para agora 🔒",
  "Com continuidade, isso pode evoluir 🔒",
  "Com contexto, isso pode melhorar 🔒",
];

interface ValueHintProps {
  onUpgradeClick: () => void;
}

export default function ValueHint({ onUpgradeClick }: ValueHintProps) {
  const [message, setMessage] = useState<string>(() => {
    const randomIndex = Math.floor(Math.random() * MESSAGES.length);
    return MESSAGES[randomIndex];
  });

  return (
    <div className="upsell-signal-container">
      <button 
        className="upsell-signal-btn"
        onClick={onUpgradeClick}
      >
        {message}
      </button>
    </div>
  );
}
