import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingScreen } from './LoadingScreen'

describe('LoadingScreen', () => {
  it('renders loading message', () => {
    render(<LoadingScreen />)
    expect(screen.getByText('Ruby YARV Challenge')).toBeInTheDocument()
    expect(screen.getByText(/Loading ruby.wasm/i)).toBeInTheDocument()
  })

  it('shows API preview', () => {
    render(<LoadingScreen />)
    expect(screen.getByText(/vm.push/i)).toBeInTheDocument()
  })
})
