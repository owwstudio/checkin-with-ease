import React, { useRef, useState, useCallback, useEffect } from 'react';

interface SelfieCameraProps {
    onCapture: (imageSrc: string) => void;
    onCancel: () => void;
    title: string;
}

export const SelfieCamera: React.FC<SelfieCameraProps> = ({ onCapture, onCancel, title }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string>('');
    const [isStreaming, setIsStreaming] = useState(false);

    const startCamera = useCallback(async () => {
        try {
            // Request video only, facing user (selfie mode)
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false
            });
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setTimeout(() => setIsStreaming(true), 0);
            }
        } catch (err) {
            setTimeout(() => {
                setError('Akses kamera ditolak atau tidak tersedia. Harap berikan izin akses kamera.');
            }, 0);
            console.error('Error accessing camera:', err);
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            setIsStreaming(false);
        }
    }, []);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera]);

    const handleCapture = () => {
        if (videoRef.current && isStreaming) {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            // Use native video resolution
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageSrc = canvas.toDataURL('image/jpeg', 0.8);
                stopCamera();
                onCapture(imageSrc);
            }
        }
    };

    const handleCancel = () => {
        stopCamera();
        onCancel();
    };

    return (
        <div className="camera-modal-overlay">
            <div className="camera-modal glass-panel">
                <h3 className="camera-title">{title}</h3>
                
                {error ? (
                    <div className="error-message mb-4">
                        {error}
                        <button className="retry-btn mt-2" onClick={startCamera}>
                            Coba Lagi
                        </button>
                    </div>
                ) : (
                    <div className="video-container">
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="live-video"
                        />
                        {!isStreaming && <div className="video-loading">Menyiapkan Kamera...</div>}
                    </div>
                )}
                
                <div className="camera-actions">
                    <button 
                        className="btn-cancel" 
                        onClick={handleCancel}
                    >
                        Batal
                    </button>
                    <button 
                        className="btn-capture" 
                        onClick={handleCapture}
                        disabled={!isStreaming}
                    >
                        <span className="icon">📸</span> Ambil Foto
                    </button>
                </div>
                <div className="camera-note">
                    * Foto harus diambil secara langsung (Live Selfie). Upload dari galeri tidak diizinkan.
                </div>
            </div>
        </div>
    );
};
