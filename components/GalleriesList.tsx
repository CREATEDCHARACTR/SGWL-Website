import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllGalleries, getContracts, deleteGallery, updateGallery } from '../services/geminiService';
import { Gallery, Contract, GalleryStatus } from '../types';
import Card from './ui/Card';
import Skeleton from './ui/Skeleton';
import Button from './ui/Button';
import ConfirmationModal from './ui/ConfirmationModal';

const getStatusColor = (status: GalleryStatus) => {
    switch (status) {
        case GalleryStatus.PUBLISHED: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        case GalleryStatus.READY: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        case GalleryStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
        case GalleryStatus.ARCHIVED: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const GalleriesList: React.FC = () => {
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [contracts, setContracts] = useState<Record<string, Contract>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
    const [galleryToDelete, setGalleryToDelete] = useState<string | null>(null);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [fetchedGalleries, fetchedContracts] = await Promise.all([
                fetchAllGalleries(),
                getContracts()
            ]);

            // Sort by creation date desc
            fetchedGalleries.sort((a, b) => new Date(b.galleryInfo.createdAt).getTime() - new Date(a.galleryInfo.createdAt).getTime());

            setGalleries(fetchedGalleries);

            const contractsMap = fetchedContracts.reduce((acc, c) => {
                acc[c.id] = c;
                return acc;
            }, {} as Record<string, Contract>);
            setContracts(contractsMap);

        } catch (error) {
            console.error("Failed to load galleries:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleArchive = async (gallery: Gallery) => {
        if (!window.confirm(`Are you sure you want to archive "${gallery.galleryInfo.name}"?`)) return;
        try {
            await updateGallery(gallery.id, {
                galleryInfo: { ...gallery.galleryInfo, status: GalleryStatus.ARCHIVED }
            });
            await loadData();
        } catch (error) {
            console.error("Failed to archive gallery:", error);
        }
    };

    const handleUnarchive = async (gallery: Gallery) => {
        try {
            await updateGallery(gallery.id, {
                galleryInfo: { ...gallery.galleryInfo, status: GalleryStatus.READY }
            });
            await loadData();
        } catch (error) {
            console.error("Failed to unarchive gallery:", error);
        }
    };

    const handleDelete = async () => {
        if (!galleryToDelete) return;
        try {
            await deleteGallery(galleryToDelete);
            setGalleryToDelete(null);
            await loadData();
        } catch (error) {
            console.error("Failed to delete gallery:", error);
        }
    };

    const filteredGalleries = useMemo(() => {
        return galleries.filter(g => {
            if (activeTab === 'active') return g.galleryInfo.status !== GalleryStatus.ARCHIVED;
            return g.galleryInfo.status === GalleryStatus.ARCHIVED;
        });
    }, [galleries, activeTab]);

    const counts = useMemo(() => {
        return {
            active: galleries.filter(g => g.galleryInfo.status !== GalleryStatus.ARCHIVED).length,
            archived: galleries.filter(g => g.galleryInfo.status === GalleryStatus.ARCHIVED).length
        };
    }, [galleries]);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">🖼️ Galleries</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton type="card" />
                    <Skeleton type="card" />
                    <Skeleton type="card" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">🖼️ Galleries</h1>
            </div>

            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'active'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    Active ({counts.active})
                </button>
                <button
                    onClick={() => setActiveTab('archived')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'archived'
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    Archived ({counts.archived})
                </button>
            </div>

            {filteredGalleries.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No {activeTab} galleries found.</p>
                    {activeTab === 'active' && (
                        <>
                            <p className="text-gray-400 dark:text-gray-500 mt-2">Galleries are created within Contracts.</p>
                            <Link to="/dashboard">
                                <Button className="mt-6">Go to Contracts</Button>
                            </Link>
                        </>
                    )}
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGalleries.map(gallery => {
                        const contract = contracts[gallery.contractId];
                        return (
                            <Card key={gallery.id} className="flex flex-col h-full hover:shadow-lg transition-shadow group relative">
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${getStatusColor(gallery.galleryInfo.status)}`}>
                                                {gallery.galleryInfo.status}
                                            </span>
                                            {gallery.galleryInfo.type && (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 w-fit">
                                                    {gallery.galleryInfo.type}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {new Date(gallery.galleryInfo.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate" title={gallery.galleryInfo.name}>
                                        {gallery.galleryInfo.name}
                                    </h3>

                                    {contract && (
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                            Client: <span className="font-medium">{contract.clientName}</span>
                                        </p>
                                    )}

                                    {gallery.galleryInfo.deliveryUrl && (
                                        <a href={gallery.galleryInfo.deliveryUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block mb-4 truncate">
                                            🔗 {gallery.galleryInfo.deliveryUrl}
                                        </a>
                                    )}

                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <div>
                                            <span className="block font-semibold text-gray-900 dark:text-white">{gallery.analytics.totalViews}</span>
                                            Views
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-100 dark:border-gray-700 rounded-b-lg flex justify-between items-center">
                                    <Link to={`/contracts/${gallery.contractId}`} className="text-brand-primary font-medium hover:text-brand-secondary text-sm">
                                        Manage &rarr;
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        {activeTab === 'active' ? (
                                            <button
                                                onClick={() => handleArchive(gallery)}
                                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm"
                                                title="Archive Gallery"
                                            >
                                                Archive
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleUnarchive(gallery)}
                                                className="text-brand-primary hover:text-brand-secondary text-sm"
                                                title="Unarchive Gallery"
                                            >
                                                Unarchive
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setGalleryToDelete(gallery.id)}
                                            className="text-red-400 hover:text-red-600 text-sm ml-2"
                                            title="Delete Gallery"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            <ConfirmationModal
                isOpen={!!galleryToDelete}
                onClose={() => setGalleryToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Gallery"
                message="Are you sure you want to permanently delete this gallery? This action cannot be undone."
            />
        </div>
    );
};

export default GalleriesList;
