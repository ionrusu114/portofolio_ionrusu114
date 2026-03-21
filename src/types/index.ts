import type { InjectionKey, Ref, Component } from 'vue'

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

export type PanelId = 'hero' | 'about' | 'projects' | 'get-offer' | 'contact'

export interface PanelConfig {
  id: PanelId
  label: string
  component: Component
}

export interface IntroState {
  hasSeenIntro: boolean
  isPlaying: boolean
  isComplete: boolean
}

export interface ProjectDetail {
  id: string
  title: string
  description: string
  tags: string[]
  imageUrl: string
  liveUrl?: string
  repoUrl?: string
  featured: boolean
  highlights: string[]
  type: 'platform' | 'client' | 'electoral'
}

export interface BudgetOption {
  id: string
  label: string
  range: [number, number] | null
  currency: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

// Injection Keys
export const ScrollProgressKey: InjectionKey<Ref<number>> = Symbol('scrollProgress')
export const ScrollToPanelKey: InjectionKey<(index: number) => void> = Symbol('scrollToPanel')
export const CurrentPanelKey: InjectionKey<Ref<number>> = Symbol('currentPanelIndex')
