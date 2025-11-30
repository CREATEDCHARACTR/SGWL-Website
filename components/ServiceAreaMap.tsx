import React from 'react';

interface ServiceAreaMapProps {
    className?: string;
}

const ServiceAreaMap: React.FC<ServiceAreaMapProps> = ({ className = '' }) => {
    const hamptonRoadsCenter = "36.8529,-76.2859";
    const hamptonRoadsCities = [
        "Norfolk",
        "Virginia Beach",
        "Chesapeake",
        "Hampton",
        "Newport News",
        "Portsmouth",
        "Suffolk"
    ];

    return (
        <div className={`bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-16 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Service Area
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                        Proudly serving Hampton Roads, Virginia
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Map */}
                    <div className="order-2 lg:order-1">
                        <div className="glass-card p-2 overflow-hidden">
                            <iframe
                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent('Hampton Roads, Virginia')}&zoom=10&center=${hamptonRoadsCenter}`}
                                width="100%"
                                height="400"
                                style={{ border: 0, borderRadius: '0.5rem' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Hampton Roads Service Area"
                            ></iframe>
                        </div>
                    </div>

                    {/* Cities List */}
                    <div className="order-1 lg:order-2">
                        <div className="glass-card p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Cities We Serve
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {hamptonRoadsCities.map((city, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                                            {city}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm">
                                Available for in-person services throughout Hampton Roads.
                                Virtual services available nationwide.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceAreaMap;
