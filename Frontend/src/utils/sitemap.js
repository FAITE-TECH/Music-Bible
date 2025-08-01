// Sitemap generator utility
// This would typically be run during build process

export const generateSitemap = async () => {
  const baseUrl = 'https://amusicbible.com'; 
  
  // Static pages
  const staticPages = [
    '',
    '/musics',
    '/blog',
    '/album',
    '/membership',
    '/contactus',
    '/bible/ai'
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  // Add static pages
  staticPages.forEach(page => {
    const priority = page === '' ? '1.0' : '0.8';
    const changefreq = page === '' ? 'daily' : 'weekly';
    
    sitemap += `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`;
  });

  try {
    // Fetch dynamic blog posts
    const blogResponse = await fetch('/api/blog/get?showAll=true');
    if (blogResponse.ok) {
      const blogData = await blogResponse.json();
      const blogs = blogData.blogs || [];
      
      blogs.forEach(blog => {
        sitemap += `
  <url>
    <loc>${baseUrl}/blog/${blog._id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date(blog.updatedAt || blog.createdAt).toISOString()}</lastmod>
  </url>`;
      });
    }

    // Fetch music pages (if they have individual pages)
    const musicResponse = await fetch('/api/music/music?limit=0');
    if (musicResponse.ok) {
      const musicData = await musicResponse.json();
      const music = musicData.music || [];
      
      
      // music.forEach(song => {
      //   sitemap += `
      //   <url>
      //     <loc>${baseUrl}/music/${song._id}</loc>
      //     <changefreq>monthly</changefreq>
      //     <priority>0.6</priority>
      //     <lastmod>${new Date(song.updatedAt || song.createdAt).toISOString()}</lastmod>
      //   </url>`;
      // });
    }
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error);
  }

  sitemap += `
</urlset>`;

  return sitemap;
};

// Function to save sitemap (would be called during build)
export const saveSitemap = async () => {
  try {
    const sitemapContent = await generateSitemap();
    // In a real build process, you would write this to the public directory
    console.log('Generated sitemap:', sitemapContent);
    return sitemapContent;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
};
