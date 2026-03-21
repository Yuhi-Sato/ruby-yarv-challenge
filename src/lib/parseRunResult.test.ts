import { describe, it, expect } from 'vitest'
import { parseRunResult, rubyLiteral } from './parseRunResult'

describe('rubyLiteral', () => {
  it('converts null to nil', () => {
    expect(rubyLiteral(null)).toBe('nil')
  })

  it('converts true', () => {
    expect(rubyLiteral(true)).toBe('true')
  })

  it('converts false', () => {
    expect(rubyLiteral(false)).toBe('false')
  })

  it('converts numbers', () => {
    expect(rubyLiteral(42)).toBe('42')
    expect(rubyLiteral(0)).toBe('0')
    expect(rubyLiteral(-1)).toBe('-1')
  })

  it('converts strings with JSON escaping', () => {
    expect(rubyLiteral('hello')).toBe('"hello"')
    expect(rubyLiteral('he"llo')).toBe('"he\\"llo"')
  })
})

describe('parseRunResult', () => {
  it('parses all passing tests', () => {
    const output = [
      '---START_REPORT---',
      '[PASS] integer literal 42',
      '[PASS] integer literal 0',
      '---END_REPORT---',
    ].join('\n')

    const result = parseRunResult(output)
    expect(result.allPassed).toBe(true)
    expect(result.passed).toBe(true)
    expect(result.testResults).toHaveLength(2)
    expect(result.testResults[0]).toEqual({
      description: 'integer literal 42',
      passed: true,
      expected: '',
      got: '',
    })
    expect(result.errorMessage).toBeNull()
  })

  it('parses failing tests with expected/got', () => {
    const output = [
      '---START_REPORT---',
      '[PASS] integer literal 42',
      '[FAIL] addition 1+2: expected=3, got=nil',
      '---END_REPORT---',
    ].join('\n')

    const result = parseRunResult(output)
    expect(result.allPassed).toBe(false)
    expect(result.testResults).toHaveLength(2)
    expect(result.testResults[1]).toEqual({
      description: 'addition 1+2',
      passed: false,
      expected: '3',
      got: 'nil',
    })
  })

  it('parses failing tests with error messages', () => {
    const output = [
      '---START_REPORT---',
      '[FAIL] addition 1+2: expected=3, got=nil',
      '  Error: NotImplementedError: opt_plus not implemented',
      '---END_REPORT---',
    ].join('\n')

    const result = parseRunResult(output)
    expect(result.testResults[0].error).toBe('NotImplementedError: opt_plus not implemented')
  })

  it('parses bytecode disassembly', () => {
    const output = [
      '---START_REPORT---',
      '[PASS] test',
      '---END_REPORT---',
      '---DISASM_START---',
      'putobject 42',
      'leave',
      '---DISASM_END---',
    ].join('\n')

    const result = parseRunResult(output)
    expect(result.bytecodeDisasm).toBe('putobject 42\nleave')
  })

  it('handles empty output', () => {
    const result = parseRunResult('')
    expect(result.allPassed).toBe(true)
    expect(result.testResults).toHaveLength(0)
    expect(result.bytecodeDisasm).toBe('')
    expect(result.errorMessage).toBeNull()
  })

  it('handles output without report markers', () => {
    const result = parseRunResult('some random output')
    expect(result.allPassed).toBe(true)
    expect(result.testResults).toHaveLength(0)
  })

  it('handles failing test without expected/got pattern', () => {
    const output = [
      '---START_REPORT---',
      '[FAIL] some test failed',
      '---END_REPORT---',
    ].join('\n')

    const result = parseRunResult(output)
    expect(result.allPassed).toBe(false)
    expect(result.testResults[0]).toEqual({
      description: 'some test failed',
      passed: false,
      expected: '',
      got: '',
      error: undefined,
    })
  })
})
