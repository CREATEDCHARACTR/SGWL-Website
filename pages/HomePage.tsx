import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-brand-secondary dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
            <SEO
                title="Home | SaulGOOD WEATHER Lowery"
                description="Welcome to SaulGOOD WEATHER Lowery. Professional contract and invoice management."
            />

            {/* Hero Section */}
            <div className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/hero-image.png"
                        alt="Mountain Landscape"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gray-900/60 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-90"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
                    <p className="text-blue-400 font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4 animate-fade-in-up">
                        SaulGOOD WEATHER Lowery
                    </p>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 tracking-tight animate-fade-in-up animation-delay-200">
                        BRAND SPECIALIST
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 font-light mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
                        Elevating Your Brand Through Visual Storytelling
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
                        <a
                            href="/#/contact"
                            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-600/30"
                        >
                            Book a Session
                        </a>
                        <Link
                            to="/portfolio"
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm rounded-full font-semibold transition-all transform hover:scale-105"
                        >
                            View Portfolio
                        </Link>
                    </div>
                </div>
            </div>

            {/* What is a Brand Specialist Section */}
            <div className="py-24 px-4 bg-gray-900 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">
                        What is a Brand Specialist?
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                        A Brand Specialist is your one-stop creative partner who brings your vision to life through powerful visual content.
                        From photography to videography, content creation to brand strategy – I help businesses and individuals tell their unique story without the hassle of managing multiple vendors.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="py-24 px-4 bg-gray-900/95">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Photography Card */}
                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all group hover:-translate-y-2 duration-300">
                            <div className="text-4xl mb-6 bg-blue-500/10 w-16 h-16 flex items-center justify-center rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                📸
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Photography</h3>
                            <p className="text-blue-400 text-sm font-medium mb-6">Wedding, Portrait, Commercial, Product</p>
                            <ul className="space-y-3 mb-8 text-gray-400">
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> High-end editing</li>
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Fast turnaround</li>
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Creative direction</li>
                            </ul>
                            <a href="/#/contact" className="text-white font-semibold flex items-center group-hover:text-blue-400 transition-colors">
                                Learn More <span className="ml-2">→</span>
                            </a>
                        </div>

                        {/* Videography Card */}
                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all group hover:-translate-y-2 duration-300">
                            <div className="text-4xl mb-6 bg-purple-500/10 w-16 h-16 flex items-center justify-center rounded-xl text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                🎥
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Videography</h3>
                            <p className="text-purple-400 text-sm font-medium mb-6">Commercial, Events, Music Videos</p>
                            <ul className="space-y-3 mb-8 text-gray-400">
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> 4K Cinema Cameras</li>
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Professional Audio</li>
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Color Grading</li>
                            </ul>
                            <a href="/#/contact" className="text-white font-semibold flex items-center group-hover:text-purple-400 transition-colors">
                                Learn More <span className="ml-2">→</span>
                            </a>
                        </div>

                        {/* Content Creation Card */}
                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-orange-500/50 transition-all group hover:-translate-y-2 duration-300">
                            <div className="text-4xl mb-6 bg-orange-500/10 w-16 h-16 flex items-center justify-center rounded-xl text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                📱
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Content Creation</h3>
                            <p className="text-orange-400 text-sm font-medium mb-6">Social Media, Strategy, Marketing</p>
                            <ul className="space-y-3 mb-8 text-gray-400">
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Reels & TikToks</li>
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Brand Voice</li>
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Consistency</li>
                            </ul>
                            <a href="/#/contact" className="text-white font-semibold flex items-center group-hover:text-orange-400 transition-colors">
                                Learn More <span className="ml-2">→</span>
                            </a>
                        </div>

                        {/* Website Services Card */}
                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-teal-500/50 transition-all group hover:-translate-y-2 duration-300">
                            <div className="text-4xl mb-6 bg-teal-500/10 w-16 h-16 flex items-center justify-center rounded-xl text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                                💻
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Website Services</h3>
                            <p className="text-teal-400 text-sm font-medium mb-6">Design, Development, Maintenance</p>
                            <ul className="space-y-3 mb-8 text-gray-400">
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Modern Design</li>
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> SEO Optimization</li>
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Fast Performance</li>
                            </ul>
                            <a href="/#/contact" className="text-white font-semibold flex items-center group-hover:text-teal-400 transition-colors">
                                Learn More <span className="ml-2">→</span>
                            </a>
                        </div>

                        {/* AI Agent Services Card */}
                        <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-indigo-500/50 transition-all group hover:-translate-y-2 duration-300">
                            <div className="text-4xl mb-6 bg-indigo-500/10 w-16 h-16 flex items-center justify-center rounded-xl text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                🤖
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">AI Agent Services</h3>
                            <p className="text-indigo-400 text-sm font-medium mb-6">Automation, Chatbots, Integration</p>
                            <ul className="space-y-3 mb-8 text-gray-400">
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Custom Workflows</li>
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> 24/7 Support Bots</li>
                                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span> Efficiency Boost</li>
                            </ul>
                            <a href="/#/contact" className="text-white font-semibold flex items-center group-hover:text-indigo-400 transition-colors">
                                Learn More <span className="ml-2">→</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Choose Section */}
            <div className="py-24 px-4 bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-12">
                                Why Choose a Brand Specialist?
                            </h2>
                            <div className="space-y-8">
                                {[
                                    {
                                        id: 1,
                                        title: "One Creative Partner",
                                        desc: "No need to hire multiple vendors. I handle it all."
                                    },
                                    {
                                        id: 2,
                                        title: "Consistent Vision",
                                        desc: "Cohesive brand identity across all your photos and videos."
                                    },
                                    {
                                        id: 3,
                                        title: "Cost Effective",
                                        desc: "Bundle services for better value than hiring separately."
                                    },
                                    {
                                        id: 4,
                                        title: "Expert Guidance",
                                        desc: "Strategy + execution in one seamless package."
                                    }
                                ].map((item) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                                            {item.id}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-400">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-30"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Creative Team Working"
                                className="relative rounded-2xl shadow-2xl w-full object-cover transform rotate-2 hover:rotate-0 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomePage;
