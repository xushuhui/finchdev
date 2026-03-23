import { useHead } from '@unhead/vue'

import type { RouteMetaDefinition } from '../types/tools'
import { SITE_NAME, SITE_URL } from '../data/tools'

export function useSeoHead(meta: RouteMetaDefinition): void {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: meta.title,
    url: meta.url,
    description: meta.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }

  useHead({
    title: meta.title,
    link: [{ rel: 'canonical', href: meta.url }],
    meta: [
      { name: 'description', content: meta.description },
      { property: 'og:title', content: meta.title },
      { property: 'og:description', content: meta.description },
      { property: 'og:url', content: meta.url },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: meta.title },
      { name: 'twitter:description', content: meta.description },
    ],
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }],
  })
}
