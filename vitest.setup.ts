import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js font
vi.mock('next/font/google')

// Mock next/navigation if it's used in the component
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    route: '/',
  }),
}))
