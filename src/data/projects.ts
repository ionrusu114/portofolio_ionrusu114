import type { ProjectDetail } from '@/types'

export const projects: ProjectDetail[] = [
  {
    id: 'driverhub',
    title: 'DriverHub.ro',
    description: 'Full-stack platform for driver management and services coordination. Built with scalable architecture handling real-time data processing and user interactions.',
    tags: ['Vue.js', 'FastAPI', 'PostgreSQL', 'Docker', 'Stripe'],
    imageUrl: '/images/projects/driverhub.webp',
    liveUrl: 'https://driverhub.ro',
    featured: true,
    highlights: ['1000+ active users', 'Continuous growth', 'End-to-end solution'],
    type: 'platform',
  },
  {
    id: 'electoral',
    title: 'Electoral Voting Platform',
    description: 'Custom-built platform for managing and automating voter counting at polling stations across the Moldova Diaspora. Automated the entire process for transparent, real-time election monitoring.',
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Automation', 'Real-time'],
    imageUrl: '/images/projects/electoral.webp',
    featured: true,
    highlights: [
      'Presidential Elections — Round 1 & 2',
      'Parliamentary Elections 2025',
      'Automated voter counting',
    ],
    type: 'electoral',
  },
  {
    id: 'maintenance',
    title: 'Web Maintenance & Consulting',
    description: 'Ongoing maintenance, performance optimization, and technical consulting for established websites across different industries.',
    tags: ['WordPress', 'Laravel', 'React', 'Express.js', 'Shopify'],
    imageUrl: '/images/projects/maintenance.webp',
    featured: false,
    highlights: ['mad-aid.org.uk', 'biotifulbrands.com', 'kykoty.ro'],
    type: 'client',
  },
]
