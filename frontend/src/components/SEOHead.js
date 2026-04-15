import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'NRWLadies';
const SITE_URL = process.env.REACT_APP_BACKEND_URL || 'https://direct-connect-32.preview.emergentagent.com';
// For frontend canonical, we use the same domain
const FRONTEND_URL = SITE_URL.replace('/api', '');

const SEOHead = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  jsonLd,
  robots = 'index,follow'
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} – Escort & Begleitung in NRW`;
  const fullCanonical = canonical ? `${FRONTEND_URL}${canonical}` : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content={robots} />
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogType} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="de_DE" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;
