import { useEffect, useRef, useState } from 'react'
import { DefaultRubyVM } from '@ruby/wasm-wasi/dist/browser'
const rubyWasm = `${import.meta.env.BASE_URL}ruby+yruby.wasm`

export type VMStatus = 'loading' | 'ready' | 'error'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type VMInstance = any

export function useRubyVM() {
  const vmRef = useRef<VMInstance | null>(null)
  const [status, setStatus] = useState<VMStatus>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const response = await fetch(rubyWasm)
        const buffer = await response.arrayBuffer()
        const module = await WebAssembly.compile(buffer)

        const { vm } = await DefaultRubyVM(module, { consolePrint: false })

        if (!vm) {
          throw new Error('Ruby VM not available')
        }

        if (cancelled) return

        // Prism is built into Ruby 4.0 — require it upfront
        vm.eval(`require 'prism'`)

        // yruby gem is packed into the wasm VFS under /usr/local/lib/ruby/yruby/
        vm.eval(`$LOAD_PATH.unshift('/usr/local/lib/ruby/yruby')`)
        vm.eval(`require 'yruby'`)

        vmRef.current = vm
        setStatus('ready')
      } catch (e) {
        if (!cancelled) {
          setError(String(e))
          setStatus('error')
        }
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  return { vmRef, status, error }
}
