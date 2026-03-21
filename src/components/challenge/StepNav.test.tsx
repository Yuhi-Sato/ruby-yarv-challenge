import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StepNav } from './StepNav'

describe('StepNav', () => {
  it('renders all step buttons', () => {
    render(
      <StepNav currentStep={1} completedSteps={[]} onStepChange={() => {}} />
    )
    // Steps 0-7 = 8 buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBe(8)
  })

  it('calls onStepChange when a step is clicked', () => {
    const onStepChange = vi.fn()
    render(
      <StepNav currentStep={1} completedSteps={[]} onStepChange={onStepChange} />
    )
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[2]) // Click step 2
    expect(onStepChange).toHaveBeenCalledWith(2)
  })

  it('shows current step title', () => {
    render(
      <StepNav currentStep={1} completedSteps={[]} onStepChange={() => {}} />
    )
    expect(screen.getByText(/Integer Literals/i)).toBeInTheDocument()
  })
})
