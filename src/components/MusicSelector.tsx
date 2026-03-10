import React, { useState } from 'react';

interface MusicSelectorProps {
    onSubmit: (url: string) => void;
    onSkip: () => void;
}

export const MusicSelector: React.FC<MusicSelectorProps> = ({ onSubmit, onSkip }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation for Spotify or YouTube URLs
        const isSpotify = url.includes('spotify.com/track');
        const isYouTube = url.includes('youtube.com/watch') || url.includes('youtu.be/');
        
        if (isSpotify || isYouTube) {
            setError('');
            onSubmit(url);
        } else {
            setError('Mohon masukkan link lagu dari Spotify (track) atau YouTube.');
        }
    };

    return (
        <div className="music-selector glass-panel">
            <div className="music-header">
                <span className="music-icon">🎵</span>
                <div className="music-title-group">
                    <h3 className="music-title">Kamu yang Tercepat!</h3>
                    <p className="music-subtitle">Pilih lagu "Music of the Day" untuk tim hari ini.</p>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="music-form">
                <input 
                    type="url" 
                    placeholder="Tempel link Spotify atau YouTube di sini..." 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="music-input"
                    required
                />
                {error && <div className="music-error">{error}</div>}
                
                <div className="music-actions">
                    <button type="button" onClick={onSkip} className="btn-skip-music">
                        Lewati
                    </button>
                    <button type="submit" className="btn-submit-music" disabled={!url.trim()}>
                        Pilih Lagu
                    </button>
                </div>
            </form>
        </div>
    );
};
