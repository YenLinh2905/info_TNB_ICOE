const Image = require('@11ty/eleventy-img');

// Generates AVIF/WebP/JPEG variants at several widths and returns a
// <picture> element with the correct srcset/sizes/width/height - browsers
// pick the smallest matching format+size instead of always downloading the
// full-resolution JPEG/PNG. Source paths come from the JSON data files as
// output-relative URLs (e.g. "images/thiet_bi/Phao.png"); the real file
// lives one level up, under src/.
async function imageShortcode(src, alt, sizes = '100vw', widths = [300, 600, 900]) {
  if (alt === undefined) {
    throw new Error(`Missing \`alt\` text for image: ${src}`);
  }

  const metadata = await Image(`src/${src}`, {
    widths: [...widths, null], // null = original size, capped to source dimensions
    formats: ['avif', 'webp', 'jpeg'],
    outputDir: '_site/images/optimized/',
    urlPath: 'images/optimized/',
  });

  // The `sizes` guess above intentionally lets the browser pick a small
  // candidate for inline thumbnails (e.g. a 112px team avatar shouldn't
  // pull a full-resolution file just to render that small). But the same
  // <img> also feeds the lightbox zoom view, which needs the largest
  // available copy regardless of how small the thumbnail is on screen -
  // exposed here as `data-full` for lightbox.js to prefer over
  // `currentSrc`/`src`.
  const jpegVariants = metadata.jpeg;
  const largest = jpegVariants[jpegVariants.length - 1];

  return Image.generateHTML(
    metadata,
    {
      alt,
      sizes,
      loading: 'lazy',
      decoding: 'async',
      'data-full': largest.url,
    },
    { whitespaceMode: 'inline' },
  );
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addAsyncShortcode('image', imageShortcode);

  // Static assets are copied as-is, preserving the same relative output
  // paths the site already used before the 11ty migration (styles/..,
  // scripts/..) so no URL referenced in the markup has to change. Content
  // photos (team/equipment/gallery) are no longer copied wholesale here -
  // they're processed individually by the {% image %} shortcode above.
  // banner.svg is the exception: it's a vector wrapper around embedded
  // raster data that eleventy-img isn't meant to transform, so it's passed
  // through untouched, same as before.
  eleventyConfig.addPassthroughCopy('src/styles');
  eleventyConfig.addPassthroughCopy('src/scripts');
  eleventyConfig.addPassthroughCopy('src/images/banner.svg');
  // Files that must land at the output root (favicon, manifest, robots.txt,
  // og-image, decision PDFs linked from the Giới thiệu section, ...).
  eleventyConfig.addPassthroughCopy({ 'src/public': '.' });

  eleventyConfig.setServerOptions({
    port: 8080,
  });

  return {
    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data',
    },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  };
};
