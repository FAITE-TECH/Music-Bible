// SEO Optimization for Music Bible

export const SEO_CHECKLIST = {
  completed: {
    // Technical SEO
    'meta-tags': 'Added comprehensive meta tags including title, description, keywords',
    'open-graph': 'Implemented Open Graph tags for social media sharing',
    'twitter-cards': 'Added Twitter Card meta tags',
    'structured-data': 'JSON-LD structured data for website, music, and blog content',
    'robots-txt': 'Created robots.txt to guide search engine crawling',
    'sitemap': 'Generated sitemap.xml for better indexing',
    'manifest': 'PWA manifest for better mobile experience',
    'helmet-integration': 'React Helmet Async for dynamic SEO management',
    
    // Content SEO
    'page-titles': 'Dynamic, descriptive titles for each page',
    'meta-descriptions': 'Unique meta descriptions for all pages',
    'semantic-html': 'Proper HTML structure with semantic elements',
    'alt-text': 'Image alt attributes (verify in components)',
    
    // Performance SEO
    'preconnect': 'Preconnect to external font domains',
    'theme-color': 'Theme color for mobile browsers'
  },

  
  recommendations: {
    // Content & Keywords
    'keyword-research': 'Conduct keyword research for Christian music terms',
    'content-optimization': 'Optimize existing content for target keywords',
    'internal-linking': 'Add strategic internal links between related content',
    'blog-categories': 'Create more specific blog categories and tags',
    
    // Technical Improvements
    'image-optimization': 'Optimize images (WebP format, proper sizing)',
    'lazy-loading': 'Implement lazy loading for images and videos',
    'core-web-vitals': 'Monitor and optimize Core Web Vitals',
    'mobile-optimization': 'Ensure perfect mobile responsiveness',
    
    // Schema Markup Enhancements
    'music-schema': 'Add detailed MusicRecording schema for individual songs',
    'review-schema': 'Implement review/rating schema if applicable',
    'breadcrumb-schema': 'Add breadcrumb structured data',
    'organization-schema': 'Enhanced organization schema with social profiles',
    
    // Advanced SEO
    'xml-sitemap-dynamic': 'Dynamic sitemap generation with build process',
    'canonical-urls': 'Implement canonical URLs for duplicate content',
    'hreflang': 'Add hreflang for Tamil/English language versions',
    'page-speed': 'Optimize bundle size and loading performance',
    
    // Analytics & Monitoring
    'google-analytics': 'Implement GA4 for tracking',
    'search-console': 'Set up Google Search Console',
    'schema-testing': 'Regular testing with Google Rich Results Test',
    'seo-monitoring': 'Set up SEO monitoring tools'
  },

  // MONITORING TOOLS
  tools: {
    'google-search-console': 'https://search.google.com/search-console',
    'google-pagespeed': 'https://pagespeed.web.dev/',
    'schema-validator': 'https://validator.schema.org/',
    'rich-results-test': 'https://search.google.com/test/rich-results',
    'mobile-friendly-test': 'https://search.google.com/test/mobile-friendly'
  }
};

// Helper function to generate meta keywords based on content
export const generateKeywords = (baseKeywords, contentType, language = 'en') => {
  const languageKeywords = {
    tamil: ['Tamil Christian songs', 'தமிழ் கிறிஸ்தவ பாடல்கள்', 'Tamil worship'],
    en: ['Christian music', 'worship songs', 'gospel music', 'English Christian songs']
  };

  const contentKeywords = {
    music: ['streaming', 'download', 'songs', 'audio', 'playlist'],
    blog: ['articles', 'spiritual insights', 'faith stories', 'devotional'],
    album: ['collection', 'compilation', 'artist', 'release']
  };

  return [
    ...baseKeywords,
    ...(languageKeywords[language] || languageKeywords.en),
    ...(contentKeywords[contentType] || [])
  ].join(', ');
};

// Function to extract content preview for meta description
export const generateMetaDescription = (content, maxLength = 160) => {
  if (!content) return '';
  
  // Remove HTML tags
  const cleanContent = content.replace(/<[^>]*>/g, '');
  
  // Truncate to maxLength and add ellipsis if needed
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  return cleanContent.substring(0, maxLength - 3).trim() + '...';
};

export default SEO_CHECKLIST;
