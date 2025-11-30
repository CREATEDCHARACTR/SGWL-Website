import React, { useState, useEffect, useCallback } from 'react';
import { Contract, Gallery, GalleryStatus, Client } from '../../types';
import { fetchGalleriesByContractId, createGallery, fetchClientById } from '../../services/geminiService';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import UploadGalleryModal from './UploadGalleryModal';
import SendGalleryModal from './SendGalleryModal';
import { Link } from 'react-router-dom';

interface ContractGalleriesTabProps {
    contract: Contract;
}

const GalleryCard: React.FC<{ gallery: Gallery, onSend: (g: Gallery) => void }> = ({ gallery, onSend }) => {
    const { galleryInfo, photoCounts, analytics } = gallery;
    const isWorkInProgress = galleryInfo.status === GalleryStatus.IN_PROGRESS;
    const progress = photoCounts.total > 0 ? (photoCounts.edited / photoCounts.total) * 100 : 0;

    return (
        <Card>
            <div className="p-6">
                <h3 className="font-bold text-lg dark:text-white">{galleryInfo.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{galleryInfo.description}</p>
                <div className="mt-4 space-y-2 text-sm">
                    <p><strong>Status:</strong> {galleryInfo.status}</p>
                    {isWorkInProgress ? (
                        <div>
                            <p><strong>Progress:</strong> {photoCounts.edited} of {photoCounts.total} photos edited</p>
                            <ProgressBar value={photoCounts.edited} max={photoCounts.total} />
                        </div>
                    ) : (
                        <p><strong>Photos:</strong> {photoCounts.total}</p>
                    )}
                    <p><strong>Views:</strong> {analytics.totalViews}</p>
                </div>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl border-t dark:border-gray-700 flex justify-end items-center gap-2">
                <Link to={`/gallery/${gallery.id}`} target="_blank">
                    <Button variant="secondary" className="text-sm !py-1.5 !px-3">View</Button>
                </Link>
                <Button variant="secondary" className="text-sm !py-1.5 !px-3" onClick={() => onSend(gallery)}>Send to Client</Button>
                <Button variant="danger" className="text-sm !py-1.5 !px-3">Delete</Button>
            </div>
        </Card>
    );
};

const ContractGalleriesTab: React.FC<ContractGalleriesTabProps> = ({ contract }) => {
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [client, setClient] = useState<Client | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [galleryToSend, setGalleryToSend] = useState<Gallery | null>(null);

    const loadGalleries = useCallback(async () => {
        setIsLoading(true);
        try {
            const [galleriesData, clientData] = await Promise.all([
                fetchGalleriesByContractId(contract.id),
                fetchClientById(contract.clientId)
            ]);
            setGalleries(galleriesData);
            setClient(clientData || null);
        } catch (error) {
            console.error("Failed to load galleries:", error);
        } finally {
            setIsLoading(false);
        }
    }, [contract.id, contract.clientId]);

    useEffect(() => {
        loadGalleries();
    }, [loadGalleries]);

    const handleUploadComplete = () => {
        setIsUploadModalOpen(false);
        loadGalleries();
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading galleries...</div>;
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold dark:text-white">Photo Galleries</h2>
                    <Button onClick={() => setIsUploadModalOpen(true)}>+ Upload Gallery</Button>
                </div>
                {galleries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {galleries.map(g => <GalleryCard key={g.id} gallery={g} onSend={setGalleryToSend} />)}
                    </div>
                ) : (
                    <Card className="text-center p-12">
                        <p className="text-gray-500">No galleries have been uploaded for this contract yet.</p>
                    </Card>
                )}
            </div>

            {isUploadModalOpen && (
                <UploadGalleryModal
                    isOpen={isUploadModalOpen}
                    onClose={() => setIsUploadModalOpen(false)}
                    contractId={contract.id}
                    clientId={contract.clientId!}
                    onUploadComplete={handleUploadComplete}
                />
            )}
            
            {galleryToSend && client && (
                <SendGalleryModal
                    isOpen={!!galleryToSend}
                    onClose={() => setGalleryToSend(null)}
                    gallery={galleryToSend}
                    client={client}
                />
            )}
        </>
    );
};

export default ContractGalleriesTab;