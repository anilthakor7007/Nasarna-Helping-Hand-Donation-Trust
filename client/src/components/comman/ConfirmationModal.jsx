// ConfirmationModal.js
import React from 'react';

function ConfirmationModal({ isVisible, email, initialPassword, message, onConfirm, onCancel }) {
    if (!isVisible) return null; 

    return (
        <div className="modal-background">
            <div className="modal-content">
                <h3>Save Credentials</h3>
                <p>{message}</p>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Initial Password:</strong> {initialPassword}</p>
                <p>Credentials Sent to your registered Email.</p>
                <p>Please save these credentials securely. Click "Yes" to confirm.</p>
                <button onClick={onConfirm}>Yes</button>
                <button onClick={onCancel}>No</button>
            </div>
        </div>
    );
}

export default ConfirmationModal;
