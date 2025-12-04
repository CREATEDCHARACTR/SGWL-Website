import React from 'react';

interface SEOProps {
    title: string;
    description?: string;
    name?: string;
    type?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = "Professional contract and invoice management for SaulGOOD WEATHER Lowery.",
    name = "SaulGOOD WEATHER Lowery",
    type = "website"
}) => {
    return (
        <>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={description} />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </>
    );
};

export default SEO;
