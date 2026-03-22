# Ruby YARV Challenge

An interactive browser-based workshop where you implement a Ruby VM (YARV) and compiler from scratch — step by step.

## What You'll Build

YARV is a **stack-based virtual machine** that executes Ruby code. In this challenge, you'll implement both:

- **VM instructions** — what each bytecode instruction does (push, pop, branch, call...)
- **Compiler methods** — how Ruby source code gets translated into bytecode

By the end, your implementation will be able to run a recursive Fibonacci function:

```ruby
def fib(n)
  if n < 2
    n
  else
    fib(n - 1) + fib(n - 2)
  end
end
fib(10)  # => 55
```

## Getting Started

Open the challenge in your browser:

**https://yuhi-sato.github.io/ruby-yarv-challenge/**

No installation required — everything runs in the browser using [ruby.wasm](https://github.com/aspect-build/aspect-cli).

## Steps

| Step | Topic | What You Implement |
|------|-------|--------------------|
| 0 | Introduction | Overview of YARV, iseq, and the stack |
| 1 | Integer Literals | `putobject`, `compile_integer_node` |
| 2 | Addition | `opt_plus`, `compile_arguments_node`, `compile_binary_plus` |
| 3 | Subtraction | `opt_minus`, `compile_binary_minus` |
| 4 | Local Variables | `getlocal`, `setlocal`, `dup`, `compile_local_var_read/write` |
| 5 | Comparison | `opt_lt`, `compile_binary_lt` |
| 6 | Control Flow | `branchunless`, `jump`, `compile_conditional_node` |
| 7 | Methods & Fibonacci | `definemethod`, `opt_send_without_block`, `compile_def_node`, `compile_general_call` |

## How It Works

1. Read the **Tutorial** pane for each step's explanation
2. Write your implementation in the **Editor**
3. Click **Run Tests** (or `Ctrl+Enter`) to check your code
4. Use **Hints** if you get stuck — they reveal progressively
5. Check the **API Reference** for available VM and compiler methods

Your code from earlier steps carries forward automatically — each step builds on what you wrote before.

## Built With

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- [ruby.wasm](https://github.com/aspect-build/aspect-cli) — Ruby running in the browser
- [yruby](https://github.com/Yuhi-Sato/yruby) — A Ruby VM written in Ruby
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) — VS Code's editor in the browser
