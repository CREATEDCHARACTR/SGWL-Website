"use client";
import React, { useState, useEffect, useCallback } from 'react';

// --- Types ---
interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    image?: string;
    audio?: string;
    videoUrl?: string;
    thumbnail?: string;
    url?: string;
    date?: string;
    featured?: boolean;
    platforms?: Record<string, string>;
}

interface CategoryData {
    title: string;
    description: string;
    items: PortfolioItem[];
}

// Photography and Music are nested objects (categories) with an optional hero
type NestedSection = Record<string, CategoryData | string> & { hero?: string };

// Websites and Video are flat sections
interface FlatSection {
    title: string;
    description: string;
    hero?: string;
    items: PortfolioItem[];
}

interface PortfolioData {
    photography: NestedSection;
    music: NestedSection;
    websites: FlatSection;
    video: FlatSection;
}

type SectionType = 'photography' | 'music' | 'websites' | 'video' | null;

export default function PortfolioGallery() {
    const [data, setData] = useState<PortfolioData | null>(null);
    const [activeSection, setActiveSection] = useState<SectionType>(null);
    const [activeCategory, setActiveCategory] = useState<string>('all'); // For photography/music categories
    const [loading, setLoading] = useState(true);

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Music Player State
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // Fetch the JSON file when the page loads
    useEffect(() => {
        fetch('/portfolio-data.json')
            .then((res) => res.json())
            .then((jsonData) => {
                setData(jsonData);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading portfolio:", err);
                setLoading(false);
            });
    }, []);

    // Lock body scroll when lightbox is open
    useEffect(() => {
        if (lightboxOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [lightboxOpen]);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    // Helper to get items based on active category (for nested sections)
    const getNestedItems = useCallback((sectionKey: 'photography' | 'music') => {
        if (!data) return [];
        const section = data[sectionKey];
        if (activeCategory === 'all') {
            // Filter out 'hero' key and aggregate items
            return Object.entries(section)
                .filter(([key]) => key !== 'hero')
                .flatMap(([, cat]) => (cat as CategoryData).items);
        }
        return (section[activeCategory] as CategoryData)?.items || [];
    }, [data, activeCategory]);

    // Helper for lightbox navigation
    const getCurrentLightboxItems = useCallback(() => {
        if (activeSection === 'photography') return getNestedItems('photography');
        if (activeSection === 'websites') return data?.websites.items || [];
        return [];
    }, [activeSection, getNestedItems, data]);

    const nextImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        const items = getCurrentLightboxItems();
        setCurrentImageIndex((prev) => (prev + 1) % items.length);
    }, [getCurrentLightboxItems]);

    const prevImage = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        const items = getCurrentLightboxItems();
        setCurrentImageIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [getCurrentLightboxItems]);

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, nextImage, prevImage]);


    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
    );

    if (!data) return <div className="p-10 text-center text-gray-500">Portfolio data not found.</div>;

    // --- LANDING VIEW ---
    if (!activeSection) {
        const sections = [
            { key: 'photography', title: 'Photography', image: data.photography.hero || '/images/photography-hero.jpg' },
            { key: 'music', title: 'Music', image: data.music.hero || '/images/music-hero.jpg' },
            { key: 'websites', title: 'Website Builds', image: data.websites.hero || '/images/websites-hero.jpg' },
            { key: 'video', title: 'Videography', image: data.video.hero || '/images/video-hero.jpg' },
        ];

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {sections.map((section) => (
                    <div
                        key={section.key}
                        onClick={() => {
                            setActiveSection(section.key as SectionType);
                            setActiveCategory('all'); // Reset category
                        }}
                        className="group relative h-80 md:h-96 rounded-3xl overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
                    >
                        <img
                            src={`/${section.image}`}
                            alt={section.title}
                            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${section.key === 'websites' ? 'object-top' : 'object-center'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:bg-black/40" />
                        <div className="absolute bottom-0 left-0 p-8">
                            <h2 className="text-4xl font-serif font-bold text-white mb-2 transform translate-y-0 transition-transform duration-300 group-hover:-translate-y-2">{section.title}</h2>
                            <div className="h-1 w-12 bg-white rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // --- SECTION HEADER & BACK BUTTON ---
    const renderHeader = (title: string, description?: string) => (
        <div className="mb-12">
            <button
                onClick={() => setActiveSection(null)}
                className="mb-8 flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Portfolio
            </button>
            <h2 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
            {description && <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">{description}</p>}
        </div>
    );

    // --- PHOTOGRAPHY SECTION ---
    if (activeSection === 'photography') {
        const categories = Object.keys(data.photography).filter(k => k !== 'hero');
        const currentItems = getNestedItems('photography');

        return (
            <section className="max-w-7xl mx-auto animate-fade-in">
                {renderHeader('Photography', 'A collection of moments frozen in time.')}

                {/* Category Nav */}
                <div className="flex flex-wrap gap-2 mb-12">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'}`}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'}`}
                        >
                            {(data.photography[cat] as CategoryData).title}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {currentItems.map((item, index) => (
                        <div key={item.id} className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-zoom-in" onClick={() => openLightbox(index)}>
                            <img src={`/${item.image}`} alt={item.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <p className="text-white font-medium">{item.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Lightbox (Reused) */}
                {lightboxOpen && (
                    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeLightbox}>
                        <button className="absolute top-6 right-6 text-white/70 hover:text-white p-2" onClick={closeLightbox}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 hidden md:block" onClick={prevImage}>
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 hidden md:block" onClick={nextImage}>
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <img src={`/${currentItems[currentImageIndex]?.image}`} alt={currentItems[currentImageIndex]?.title} className="max-w-full max-h-[85vh] object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
                    </div>
                )}
            </section>
        );
    }

    // --- MUSIC SECTION ---
    if (activeSection === 'music') {
        const playlist = getNestedItems('music');
        return (
            <section className="max-w-5xl mx-auto animate-fade-in">
                {renderHeader('Music', 'Original compositions and latest releases.')}

                {/* Hidden Audio Player Logic */}
                <audio
                    ref={(el) => {
                        if (el && playlist.length > 0) {
                            const currentSong = playlist[currentSongIndex];
                            const newSrc = currentSong ? `/${currentSong.audio}` : '';
                            if (el.src !== window.location.origin + newSrc && newSrc) el.src = newSrc;
                            if (isPlaying) el.play().catch(e => console.log("Playback prevented:", e));
                            else el.pause();
                            el.onended = () => {
                                const nextIndex = currentSongIndex + 1;
                                if (nextIndex < playlist.length) {
                                    setCurrentSongIndex(nextIndex);
                                    setIsPlaying(true);
                                } else {
                                    setIsPlaying(false);
                                    setCurrentSongIndex(0);
                                }
                            };
                        }
                    }}
                />

                <div className="grid grid-cols-1 gap-6">
                    {playlist.map((song, index) => {
                        const isCurrentSong = currentSongIndex === index;
                        return (
                            <div key={song.id} className={`flex items-center p-6 rounded-2xl bg-white dark:bg-gray-900 border transition-all ${isCurrentSong && isPlaying ? 'border-blue-500 shadow-lg ring-1 ring-blue-500/20' : 'border-gray-100 dark:border-gray-800 hover:shadow-md'}`}>
                                <button
                                    onClick={() => {
                                        if (isCurrentSong) setIsPlaying(!isPlaying);
                                        else { setCurrentSongIndex(index); setIsPlaying(true); }
                                    }}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center mr-6 transition-colors ${isCurrentSong && isPlaying ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-600'}`}
                                >
                                    {isCurrentSong && isPlaying ? (
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                                    ) : (
                                        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    )}
                                </button>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{song.title}</h3>
                                    <p className="text-gray-500 dark:text-gray-400">{song.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    }

    // --- WEBSITES SECTION ---
    if (activeSection === 'websites') {
        return (
            <section className="max-w-7xl mx-auto animate-fade-in">
                {renderHeader(data.websites.title, data.websites.description)}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.websites.items.map((site) => (
                        <a key={site.id} href={site.url} target="_blank" rel="noopener noreferrer" className="group block bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img src={`/${site.image}`} alt={site.title} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{site.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{site.description}</p>
                            </div>
                        </a>
                    ))}
                </div>
            </section>
        );
    }

    // --- VIDEO SECTION ---
    if (activeSection === 'video') {
        return (
            <section className="max-w-7xl mx-auto animate-fade-in">
                {renderHeader(data.video.title, data.video.description)}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {data.video.items.map((video) => (
                        <div key={video.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm">
                            {/* Placeholder for Video Embed or Thumbnail */}
                            <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="block relative aspect-video bg-black group cursor-pointer">
                                {video.thumbnail ? (
                                    <img src={`/${video.thumbnail}`} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">Video Placeholder</div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                </div>
                            </a>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{video.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{video.description}</p>
                                <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium">Watch Video &rarr;</a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return null;
}
