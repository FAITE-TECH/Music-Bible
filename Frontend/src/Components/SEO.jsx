import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'aMusicBible - Experience Holy Bible Through Music | Christian Music App',
  description = 'Experience the Holy Bible through beautiful music and spiritual songs. Stream Christian music in Tamil, English, and multiple languages. Transform your spiritual journey with aMusicBible - the revolutionary Christian music platform.',
  keywords = 'aMusicBible, music bible, holy bible music, Christian music app, Tamil Christian songs, English Christian songs, spiritual music, biblical music, worship songs, Christian app, bible through music',
  image = '/assets/newlogo-D9O6xs8i.png',
  url,
  type = 'website',
  author = 'aMusicBible',
  publishedTime,
  modifiedTime,
  section,
  tags,
  canonicalUrl,
  schema
}) => {
  const siteName = 'aMusicBible';
  const siteUrl = 'https://amusicbible.com'; 
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Generate JSON-LD structured data
  const generateSchema = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteName,
      url: siteUrl,
      description: description,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    };

    if (schema) {
      return schema;
    }

    return baseSchema;
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />

      {/* Article specific meta tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      {section && <meta property="article:section" content={section} />}
      {tags && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@aMusicBible" /> 
      <meta name="twitter:creator" content="@aMusicBible" />

      {/* Additional Meta Tags for Music/Audio Content */}
      <meta property="music:duration" content="180" />
      <meta property="music:album" content="Christian Music Collection" />
      <meta property="music:musician" content="Various Christian Artists" />

      {/* Theme Color */}
      <meta name="theme-color" content="#0119FF" />
      <meta name="msapplication-TileColor" content="#0119FF" />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateSchema())}
      </script>
    </Helmet>
  );
};

export default SEO;
