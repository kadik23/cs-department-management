import React from 'react';

export default function Alert({ type = 'success', message, onClose }) {
  if (!message) return null;
  return (
    <div className={`dialogue-alert-message alert-${type}`} >
      <span>{message}</span>
      {onClose && (
        <button
          style={{
            marginLeft: 12,
            background: 'none',
            border: 'none',
            fontSize: 18,
            fontWeight: 'bold',
            color: 'inherit',
            cursor: 'pointer',
            position: 'absolute',
            right: 12,
            top: 0,
          }}
          onClick={onClose}
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
} 