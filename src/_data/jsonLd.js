const site = require('./site.json');

module.exports = {
  '@context': 'https://schema.org',
  '@type': 'ResearchOrganization',
  name: site.jsonLd.name,
  alternateName: site.jsonLd.alternateName,
  description: site.jsonLd.description,
  parentOrganization: {
    '@type': 'Organization',
    name: site.jsonLd.parentOrganizationName,
  },
  inLanguage: 'vi',
};
