import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';
import Button from '../components/ui/Button';
import ServiceAreaMap from '../components/ServiceAreaMap';

const ContactPage: React.FC = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        eventDate: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        // Scroll to form on mount or when hash changes
        const scrollToForm = () => {
            const hash = window.location.hash || location.hash;
            if (hash.includes('form')) {
                setTimeout(() => {
                    const formElement = document.getElementById('contact-form');
                    if (formElement) {
                        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 300);
            }
        };

        scrollToForm();
    }, [location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission - in production, this would send to your backend
        try {
            // For now, just create a mailto link with the form data
            const subject = `New Contact Request - ${formData.serviceType}`;
            const body = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Service Type: ${formData.serviceType}
Event Date: ${formData.eventDate}

Message:
${formData.message}
            `.trim();

            window.location.href = `mailto:contact@saulgoodweather.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            setSubmitStatus('success');
            setFormData({ name: '', email: '', phone: '', serviceType: '', eventDate: '', message: '' });
        } catch (error) {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SEO
                title="Contact | SaulGOOD WEATHER Lowery"
                description="Get in touch with SaulGOOD WEATHER Lowery."
            />
            <div className="min-h-screen bg-gradient-to-br from-brand-secondary via-brand-secondary to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Hero Section - Reduced Height */}
                <div className="relative overflow-hidden py-12 md:py-16">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-purple-600/5 backdrop-blur-3xl"></div>
                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Let's Work Together
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                            Fill out the form below and I'll get back to you within 24 hours.
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div id="contact-form" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 scroll-mt-32">
                    <div className="glass-card p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                                    placeholder="John Doe"
                                />
                            </div>

                            {/* Email & Phone */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                                        placeholder="(555) 123-4567"
                                    />
                                </div>
                            </div>

                            {/* Service Type */}
                            <div>
                                <label htmlFor="serviceType" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Service Type *
                                </label>
                                <select
                                    id="serviceType"
                                    name="serviceType"
                                    required
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                                >
                                    <option value="">Select a service...</option>
                                    <option value="Photography">Photography</option>
                                    <option value="Videography">Videography</option>
                                    <option value="Web Development">Web Development</option>
                                    <option value="AI Solutions">AI Solutions</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            {/* Event Date */}
                            <div>
                                <label htmlFor="eventDate" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Preferred Date (if applicable)
                                </label>
                                <input
                                    type="date"
                                    id="eventDate"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                    Tell me about your project *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={6}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-primary focus:border-transparent transition resize-none"
                                    placeholder="Describe your project, vision, and any specific requirements..."
                                />
                            </div>

                            {/* Status Messages */}
                            {submitStatus === 'success' && (
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                    <p className="text-green-800 dark:text-green-200 font-medium">
                                        ✓ Your message has been prepared! Your email client will open shortly.
                                    </p>
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                    <p className="text-red-800 dark:text-red-200 font-medium">
                                        ✗ Something went wrong. Please try again or email directly.
                                    </p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isSubmitting}
                                    className="w-full py-4 text-lg font-semibold"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </Button>
                            </div>
                        </form>

                        {/* Alternative Contact */}
                        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Prefer to reach out directly?
                            </p>
                            <a
                                href="mailto:contact@saulgoodweather.com"
                                className="text-brand-primary dark:text-brand-accent hover:underline font-semibold"
                            >
                                contact@saulgoodweather.com
                            </a>
                        </div>
                    </div>
                </div>

                {/* Service Area Map */}
                <ServiceAreaMap />
            </div>
        </>
    );
};

export default ContactPage;
