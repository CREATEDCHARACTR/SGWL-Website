import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchGalleryById, trackGalleryView, fetchAllGalleries as fetchGalleries } from '../services/geminiService';
import { Gallery, GalleryType } from '../types';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';
import PhotoViewer from '../components/galleries/PhotoViewer';
import ServiceAreaMap from '../components/ServiceAreaMap';

const PublicGalleryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true);
            try {
                if (id) {
                    // Load specific gallery
                    const galleryData = await fetchGalleryById(id);
                    if (galleryData) {
                        setGallery(galleryData);
                        trackGalleryView(id);
                    } else {
                        setError("Sorry, this gallery could not be found.");
                    }
                } else {
                    // Load list of active galleries for portfolio view
                    const allGalleries = await fetchGalleries();
                    // Filter for Published galleries that are specifically for the Portfolio
                    const activeGalleries = allGalleries.filter(g => g.galleryInfo.status === 'Published' && g.galleryInfo.type === GalleryType.PORTFOLIO);
                    setGalleries(activeGalleries);
                }
            } catch (err) {
                setError("An error occurred while loading content.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, [id]);

    const openViewer = (index: number) => {
        setSelectedPhotoIndex(index);
        setIsViewerOpen(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    // List View (Portfolio)
    if (!id) {
        return (
            <>
                <SEO
                    title="Galleries | SaulGOOD WEATHER Lowery"
                    description="Browse our gallery."
                />
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <h1 className="text-4xl font-bold mb-8 text-center font-serif">Portfolio</h1>
                        {galleries.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {galleries.map(g => (
                                    <Link key={g.id} to={`/gallery/${g.id}`} className="group block bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                                            {g.coverImage ? (
                                                <img src={g.coverImage} alt={g.galleryInfo.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                    <span className="text-4xl">📷</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                        </div>
                                        <div className="p-6">
                                            <span className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-2 block">{g.galleryInfo.type}</span>
                                            <h2 className="text-xl font-bold mb-2 group-hover:text-brand-primary transition-colors">{g.galleryInfo.name}</h2>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{g.galleryInfo.description}</p>
                                            <div className="mt-4 flex items-center text-sm text-gray-500 font-medium">
                                                <span>View Gallery</span>
                                                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-gray-500">
                                <p className="text-xl">No public galleries available at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </>
        );
    }

    if (error || !gallery) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold mb-4">Gallery Not Found</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "The gallery you are looking for does not exist or has been removed."}</p>
                    <Button onClick={() => window.location.href = '/'}>Go Home</Button>
                </div>
            </div>
        );
    }

    // Detail View (Existing Code)
    return (
        <>
            <SEO
                title={`Gallery: ${gallery.galleryInfo.name} | SaulGOOD WEATHER Lowery`}
                description={`View the ${gallery.galleryInfo.name} gallery.`}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans flex flex-col">
                {/* Hero / Header Section */}
                <div className="relative bg-gray-900 text-white py-24 px-4 overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/90" />

                    <div className="relative max-w-4xl mx-auto text-center z-10">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6 tracking-wider uppercase">
                            {gallery.galleryInfo.type || 'Gallery Delivery'}
                        </span>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight font-serif">
                            {gallery.galleryInfo.name}
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            {gallery.galleryInfo.description}
                        </p>
                    </div>
                </div>

                <main className="flex-grow -mt-10 relative z-20 px-4 pb-12">
                    {gallery.galleryInfo.deliveryUrl && (
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                                <div className="p-8 md:p-12 text-center">
                                    <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                                        Portfolio
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                                        Access your high-resolution files securely via Google Drive.
                                    </p>

                                    {gallery.galleryInfo.instructions && (
                                        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl p-6 mb-10 text-left">
                                            <div className="flex items-start gap-3">
                                                <span className="text-2xl">📝</span>
                                                <div>
                                                    <h3 className="font-bold text-blue-900 dark:text-blue-100 text-sm uppercase tracking-wide mb-2">
                                                        Instructions from Saul:
                                                    </h3>
                                                    <p className="text-blue-800 dark:text-blue-200 whitespace-pre-wrap leading-relaxed">
                                                        {gallery.galleryInfo.instructions}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <a
                                        href={gallery.galleryInfo.deliveryUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-brand-primary font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-brand-secondary transform hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <span className="mr-2">View on Google Drive</span>
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>

                                    <p className="mt-6 text-sm text-gray-400 dark:text-gray-500">
                                        Link expires in 30 days • Secure Access
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {gallery.photos && gallery.photos.length > 0 ? (
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {gallery.photos.map((photo, index) => (
                                    <div
                                        key={photo.photoId}
                                        className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => openViewer(index)}
                                    >
                                        <img
                                            src={photo.thumbnailUrl || photo.url}
                                            alt={photo.filename}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : !gallery.galleryInfo.deliveryUrl && (
                        <div className="text-center py-12 text-gray-500 bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl mx-auto">
                            No photos or delivery link available.
                        </div>
                    )}
                </main>

                <ServiceAreaMap className="mt-auto" />

                <footer className="text-center py-8 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 border-t dark:border-gray-800">
                    <p>© {new Date().getFullYear()} SaulGOOD WEATHER Lowery. All rights reserved.</p>
                </footer>
            </div>
            {isViewerOpen && (
                <PhotoViewer
                    photos={gallery.photos || []}
                    currentIndex={selectedPhotoIndex}
                    onClose={() => setIsViewerOpen(false)}
                    onNavigate={setSelectedPhotoIndex}
                />
            )}
        </>
    );
};

export default PublicGalleryPage;

