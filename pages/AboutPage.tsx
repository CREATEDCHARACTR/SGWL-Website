import React from 'react';
import SEO from '../components/SEO';
import headshotImage from '../assets/headshot.jpg';

const AboutPage: React.FC = () => {
    // Hampton Roads area - centered on Norfolk/Virginia Beach
    const hamptonRoadsCenter = "36.8529,-76.2859";
    const hamptonRoadsCities = [
        "Norfolk, VA",
        "Virginia Beach, VA",
        "Chesapeake, VA",
        "Hampton, VA",
        "Newport News, VA",
        "Portsmouth, VA",
        "Suffolk, VA"
    ];

    return (
        <>
            <SEO
                title="About | SaulGOOD WEATHER Lowery"
                description="Learn more about SaulGOOD WEATHER Lowery and our services."
            />
            <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-brand-secondary to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-purple-600/5 backdrop-blur-3xl"></div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* Left: Image */}
                            <div className="order-2 md:order-1">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                                    <div className="relative">
                                        <img
                                            src={headshotImage}
                                            alt="Saul Lowery - Professional Headshot"
                                            className="w-full h-auto rounded-2xl shadow-2xl object-cover transform transition duration-500 group-hover:scale-[1.02]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right: Text */}
                            <div className="order-1 md:order-2 text-center md:text-left">
                                <div className="inline-block px-4 py-2 bg-brand-primary/10 dark:bg-brand-accent/10 rounded-full mb-6">
                                    <span className="text-brand-primary dark:text-brand-accent font-semibold text-sm tracking-wide uppercase">
                                        Creative Professional
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                                    Saul Lowery
                                </h1>
                                <p className="text-2xl md:text-3xl text-brand-primary dark:text-brand-accent font-light mb-6">
                                    SaulGOOD WEATHER Lowery
                                </p>
                                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                                    Creative professional specializing in photography, videography, and digital solutions.
                                    Dedicated to delivering exceptional visual storytelling and unforgettable client experiences.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <button
                                        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="px-8 py-3 bg-brand-primary text-white rounded-lg font-semibold hover:bg-brand-primary/90 transition shadow-lg hover:shadow-xl"
                                    >
                                        My Services
                                    </button>
                                    <a
                                        href="/#/contact#form"
                                        className="px-8 py-3 bg-white dark:bg-gray-800 text-brand-primary dark:text-brand-accent rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition border-2 border-brand-primary/20"
                                    >
                                        Get in Touch
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            What I Do
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Bringing your vision to life through creative excellence
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: '📸', title: 'Photography', desc: 'Professional photography for all occasions' },
                            { icon: '🎥', title: 'Videography', desc: 'Cinematic video production & editing' },
                            { icon: '💻', title: 'Web Development', desc: 'Custom websites & digital experiences' },
                            { icon: '🤖', title: 'AI Solutions', desc: 'Cutting-edge AI integration & automation' }
                        ].map((service, idx) => (
                            <div key={idx} className="glass-card p-8 text-center group hover:scale-105 transition-all duration-300">
                                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {service.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Service Area Section */}
                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                                Service Area
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                                Proudly serving Hampton Roads, Virginia
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Map */}
                            <div className="order-2 lg:order-1">
                                <div className="glass-card p-2 overflow-hidden">
                                    <iframe
                                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent('Hampton Roads, Virginia')}&zoom=10&center=${hamptonRoadsCenter}`}
                                        width="100%"
                                        height="450"
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
                                <div className="glass-card p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                        Cities We Serve
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {hamptonRoadsCities.map((city, idx) => (
                                            <div key={idx} className="flex items-center space-x-3">
                                                <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                    {city}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-6 text-gray-600 dark:text-gray-400 text-sm">
                                        Available for in-person services throughout the Hampton Roads region.
                                        Virtual services available nationwide.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div id="contact" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="glass-card p-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Let me help you bring your idea to life.
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                            Ready to bring your vision to life? Let's make something amazing.
                        </p>
                        <a
                            href="/#/contact#form"
                            className="inline-block px-10 py-4 bg-brand-primary text-white rounded-lg font-semibold text-lg hover:bg-brand-primary/90 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
                        >
                            Get Started Today
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutPage;
