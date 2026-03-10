import React from 'react';

export type Feedback = '👍' | '👎' | null;

interface FeedbackSelectorProps {
    onSelect: (feedback: Feedback) => void;
    selectedFeedback: Feedback;
    isAllowed: boolean;
}

export const FeedbackSelector: React.FC<FeedbackSelectorProps> = ({ onSelect, selectedFeedback, isAllowed }) => {
    if (!isAllowed) {
        return null;
    }

    return (
        <div className="mood-selector-container glass-panel">
            <h3 className="mood-title">Gimana harimu di kantor hari ini?</h3>
            <p className="mood-subtitle">Berikan evaluasi sebelum Check-out</p>
            <div className="mood-options">
                <button 
                    className={`mood-btn ${selectedFeedback === '👍' ? 'selected' : ''}`}
                    onClick={() => onSelect('👍')}
                    title="Baik / Produktif"
                >
                    👍
                </button>
                <button 
                    className={`mood-btn ${selectedFeedback === '👎' ? 'selected' : ''}`}
                    onClick={() => onSelect('👎')}
                    title="Buruk / Melelahkan"
                >
                    👎
                </button>
            </div>
        </div>
    );
};
