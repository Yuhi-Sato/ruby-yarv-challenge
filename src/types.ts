// TypeScript type definitions for Ruby YARV Challenge
import type { ReactNode } from 'react'

export type VMStatus = 'loading' | 'ready' | 'error'

export interface TestCase {
  description: string
  source: string
  expected: number | string | boolean | null
}

export interface StepConfig {
  id: number
  title: string
  description: ReactNode // JSX content rendered directly
  instructions: string // Instructions introduced in this step
  stub: string // Combined VM + compiler stub (participant-editable)
  testCases: TestCase[]
  hints?: string[] // Progressive hints (vague → specific)
  bytecodePreview?: string // Expected bytecode for tutorial pane
}

export interface TestResult {
  description: string
  passed: boolean
  expected: string
  got: string
  error?: string
}

export interface RunResult {
  passed: boolean
  allPassed: boolean
  bytecodeDisasm: string
  testResults: TestResult[]
  errorMessage: string | null
}

export interface ChallengeState {
  currentStep: number
  userCode: Record<number, string> // step id → user's code for that step
  completedSteps: number[]
  lastResult: RunResult | null
  isRunning: boolean
}
