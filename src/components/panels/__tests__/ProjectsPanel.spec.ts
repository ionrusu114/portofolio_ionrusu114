import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectsPanel from '../ProjectsPanel.vue'

describe('ProjectsPanel', () => {
  it('renders section heading', () => {
    const wrapper = mount(ProjectsPanel)
    expect(wrapper.text()).toContain('Selected Work')
  })

  it('renders DriverHub project', () => {
    const wrapper = mount(ProjectsPanel)
    expect(wrapper.text()).toContain('DriverHub')
  })

  it('renders Electoral project', () => {
    const wrapper = mount(ProjectsPanel)
    expect(wrapper.text()).toContain('Electoral Voting Platform')
  })
})
