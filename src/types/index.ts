export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
  liveUrl?: string
  repoUrl?: string
  featured: boolean
}

export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  icon: string
  category: SkillCategory
}

export type SkillCategory = 'frontend' | 'backend' | 'devops' | 'design'

export interface NavLink {
  label: string
  to: string
  icon?: string
}

export interface ContactForm {
  name: string
  email: string
  message: string
}
