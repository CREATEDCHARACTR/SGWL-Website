import React, { useEffect } from 'react';
import { Photo } from '../../types';

interface PhotoViewerProps {
    photos: Photo[];
    currentIndex: number;
    onClose: () => void;
    onNavigate: (newIndex: number) => void;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ photos, currentIndex, onClose, onNavigate }) => {
    
    const goToNext = () => {
        onNavigate((currentIndex + 1) % photos.length);
    };

    const goToPrev = () => {
        onNavigate((currentIndex - 1 + photos.length) % photos.length);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'ArrowLeft') goToPrev();
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, photos.length]);

    const currentPhoto = photos[currentIndex];

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-white text-4xl hover:opacity-80 transition-opacity z-10"
                    onClick={onClose}
                    aria-label="Close photo viewer"
                >
                    &times;
                </button>

                {/* Previous Button */}
                <button
                    className="absolute left-4 text-white text-5xl hover:opacity-80 transition-opacity"
                    onClick={goToPrev}
                    aria-label="Previous photo"
                >
                    &#8249;
                </button>

                {/* Image Display */}
                <div className="max-w-[90vw] max-h-[90vh] flex flex-col items-center">
                    <img
                        src={currentPhoto.url}
                        alt={currentPhoto.filename}
                        className="max-w-full max-h-full object-contain shadow-2xl"
                    />
                    <div className="text-white text-center mt-2 bg-black/30 px-2 py-1 rounded">
                        <p>{currentPhoto.filename}</p>
                        <p className="text-sm opacity-80">{currentIndex + 1} / {photos.length}</p>
                    </div>
                </div>

                {/* Next Button */}
                <button
                    className="absolute right-4 text-white text-5xl hover:opacity-80 transition-opacity"
                    onClick={goToNext}
                    aria-label="Next photo"
                >
                    &#8250;
                </button>
            </div>
        </div>
    );
};

export default PhotoViewer;