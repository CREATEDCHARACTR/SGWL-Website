import React from 'react';
import PortfolioGallery from '../components/PortfolioGallery';
import SEO from '../components/SEO';

const PortfolioPage: React.FC = () => {
    return (
        <>
            <SEO
                title="Portfolio | SaulGOOD WEATHER Lowery"
                description="View our portfolio of work."
            />
            <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-brand-primary selection:text-white">

                {/* Hero Section */}
                <section className="relative py-32 px-4 overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-brand-primary/5 blur-[100px]" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px]" />
                    </div>

                    <div className="container mx-auto text-center max-w-4xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-xs font-bold tracking-widest uppercase mb-6 text-gray-500 dark:text-gray-400">
                            Selected Works
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 tracking-tight leading-tight">
                            Capturing Life's <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                                Finest Moments
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            A curated collection of photography and music that tells stories, evokes emotion, and preserves memories forever.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 pb-24">
                    <PortfolioGallery />
                </div>
            </main>
        </>
    );
};

export default PortfolioPage;
