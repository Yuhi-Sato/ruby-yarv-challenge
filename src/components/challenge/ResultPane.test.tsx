import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultPane } from './ResultPane'
import type { RunResult } from '../../types'

describe('ResultPane', () => {
  it('renders empty state when no result', () => {
    render(<ResultPane result={null} />)
    expect(screen.getByText(/Implement the code/i)).toBeInTheDocument()
  })

  it('renders all passed state', () => {
    const result: RunResult = {
      passed: true,
      allPassed: true,
      bytecodeDisasm: 'putobject 42\nleave',
      testResults: [
        { description: 'test 1', passed: true, expected: '', got: '' },
      ],
      errorMessage: null,
    }
    render(<ResultPane result={result} />)
    expect(screen.getByText(/ALL PASSED/i)).toBeInTheDocument()
  })

  it('renders failed state', () => {
    const result: RunResult = {
      passed: false,
      allPassed: false,
      bytecodeDisasm: '',
      testResults: [
        { description: 'test 1', passed: true, expected: '', got: '' },
        { description: 'test 2', passed: false, expected: '3', got: 'nil' },
      ],
      errorMessage: null,
    }
    render(<ResultPane result={result} />)
    expect(screen.getByText(/SOME FAILED/i)).toBeInTheDocument()
  })

  it('renders error message', () => {
    const result: RunResult = {
      passed: false,
      allPassed: false,
      bytecodeDisasm: '',
      testResults: [],
      errorMessage: 'Something went wrong',
    }
    render(<ResultPane result={result} />)
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
  })

  it('renders expected bytecode', () => {
    render(<ResultPane result={null} expectedBytecode="putobject 42" />)
    expect(screen.getByText('putobject 42')).toBeInTheDocument()
  })

  it('renders celebration on last step', () => {
    const result: RunResult = {
      passed: true,
      allPassed: true,
      bytecodeDisasm: '',
      testResults: [{ description: 'fib', passed: true, expected: '', got: '' }],
      errorMessage: null,
    }
    render(<ResultPane result={result} isLastStep={true} />)
    expect(screen.getByText(/Congratulations/i)).toBeInTheDocument()
  })
})
