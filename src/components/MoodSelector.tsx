import React from 'react';

export type Mood = '😊' | '😐' | '😔' | '😫' | null;

interface MoodSelectorProps {
    onSelect: (mood: Mood) => void;
    selectedMood: Mood;
    isAllowed: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelect, selectedMood, isAllowed }) => {
    if (!isAllowed) {
        return null;
    }

    return (
        <div className="mood-selector-container glass-panel">
            <h3 className="mood-title">Bagaimana perasaan Anda hari ini?</h3>
            <p className="mood-subtitle">Pilih mood Anda sebelum Check-in</p>
            <div className="mood-options">
                <button 
                    className={`mood-btn ${selectedMood === '😊' ? 'selected' : ''}`}
                    onClick={() => onSelect('😊')}
                    title="Senang / Semangat"
                >
                    😊
                </button>
                <button 
                    className={`mood-btn ${selectedMood === '😐' ? 'selected' : ''}`}
                    onClick={() => onSelect('😐')}
                    title="Biasa saja / Netral"
                >
                    😐
                </button>
                <button 
                    className={`mood-btn ${selectedMood === '😔' ? 'selected' : ''}`}
                    onClick={() => onSelect('😔')}
                    title="Sedih / Kecewa"
                >
                    😔
                </button>
                <button 
                    className={`mood-btn ${selectedMood === '😫' ? 'selected' : ''}`}
                    onClick={() => onSelect('😫')}
                    title="Lelah / Stres"
                >
                    😫
                </button>
            </div>
        </div>
    );
};
