import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCardSection from '../ProjectCardSection.vue'

const mockProject = {
  id: 'test',
  title: 'Test Project',
  description: 'A test project',
  tags: ['Vue.js', 'TypeScript'],
  imageUrl: '/test.webp',
  featured: true,
  highlights: ['100 users', 'Fast'],
  type: 'platform' as const,
  liveUrl: 'https://example.com',
}

describe('ProjectCardSection', () => {
  it('renders project title', () => {
    const wrapper = mount(ProjectCardSection, { props: { project: mockProject } })
    expect(wrapper.text()).toContain('Test Project')
  })

  it('renders featured badge when featured', () => {
    const wrapper = mount(ProjectCardSection, { props: { project: mockProject } })
    expect(wrapper.text()).toContain('Featured')
  })

  it('renders highlights', () => {
    const wrapper = mount(ProjectCardSection, { props: { project: mockProject } })
    expect(wrapper.text()).toContain('100 users')
  })

  it('renders live link when provided', () => {
    const wrapper = mount(ProjectCardSection, { props: { project: mockProject } })
    expect(wrapper.find('a[href="https://example.com"]').exists()).toBe(true)
  })
})
