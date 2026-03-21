import { createElement as h } from 'react'
import type { StepConfig } from '../types'

// Import combined stubs as raw strings
import step1Stub from '../ruby/stubs/step1.rb?raw'
import step2Stub from '../ruby/stubs/step2.rb?raw'
import step3Stub from '../ruby/stubs/step3.rb?raw'
import step4Stub from '../ruby/stubs/step4.rb?raw'
import step5Stub from '../ruby/stubs/step5.rb?raw'
import step6Stub from '../ruby/stubs/step6.rb?raw'
import step7Stub from '../ruby/stubs/step7.rb?raw'

export const STEPS: StepConfig[] = [
  {
    id: 0,
    title: 'Introduction',
    description: h('div', { className: 'intro-content' },
      h('h2', null, 'Welcome to the YARV Challenge!'),
      h('p', null,
        'In this workshop, you will implement a ', h('strong', null, 'Ruby VM (YARV)'),
        ' and ', h('strong', null, 'compiler'), ' from scratch — step by step.',
      ),
      h('h3', null, 'What is YARV?'),
      h('p', null,
        'YARV (Yet Another Ruby VM) is the virtual machine that executes Ruby code. ',
        'It is a ', h('strong', null, 'stack-based VM'), ': every operation pushes and pops values from a stack.',
      ),
      h('p', null, 'For example, ', h('code', null, '1 + 2'), ' is executed like this:'),
      h('pre', { className: 'stack-diagram' }, h('code', null,
        'putobject 1    putobject 2    opt_plus       leave\n' +
        '\n' +
        '               ┌─────┐\n' +
        '               │  2  │\n' +
        '┌─────┐        ├─────┤        ┌─────┐\n' +
        '│  1  │        │  1  │        │  3  │        → 3\n' +
        '└─────┘        └─────┘        └─────┘\n' +
        ' stack          stack          stack        return'
      )),
      h('p', null,
        h('code', null, 'leave'), ' (return the top value) is automatically added by the system — you don\'t need to implement or emit it.',
      ),
      h('h3', null, 'What is iseq?'),
      h('p', null,
        'The sequence of instructions (', h('code', null, 'putobject'), ', ', h('code', null, 'opt_plus'), ', ', h('code', null, 'leave'), ', ...) is called an ',
        h('strong', null, 'Instruction Sequence (iseq)'), '. ',
        'The compiler reads Ruby source code, parses it into an AST, and emits instructions into an iseq. The VM then executes the iseq from top to bottom.',
      ),
      h('pre', null, h('code', null,
        'Ruby source    Compiler     iseq          VM\n' +
        '  "1 + 2"   →  compile  →  putobject 1  →  execute\n' +
        '                            putobject 2\n' +
        '                            opt_plus\n' +
        '                            leave'
      )),
      h('p', null,
        'In this workshop, you will implement both sides: ',
        h('strong', null, 'instruction behavior'), ' (what each instruction does on the VM stack) and ',
        h('strong', null, 'compiler methods'), ' (how to emit the right instructions into an iseq).',
      ),
      h('h3', null, 'What is yruby?'),
      h('p', null,
        h('a', { href: 'https://github.com/Yuhi-Sato/yruby', target: '_blank', rel: 'noopener noreferrer' }, h('strong', null, 'yruby')), ' is a Ruby VM written in Ruby itself. ',
        'It uses ', h('strong', null, 'Prism'), ' (Ruby\'s official parser) to parse source code into an AST. ',
        'Your job is to ', h('strong', null, 'patch'), ' specific parts of it — the VM instructions and compiler methods.',
      ),
      h('h3', null, 'How "patching" works'),
      h('p', null,
        'All your code goes inside ', h('code', null, 'module Patch'), '. ',
        'This module is prepended to the yruby compiler, so your methods take priority over the built-in ones.',
      ),
      h('pre', null, h('code', null,
        'module Patch\n' +
        '  # Re-open an instruction class to implement its behavior\n' +
        '  class Putobject\n' +
        '    def self.call(vm, value)\n' +
        '      vm.push(value)\n' +
        '    end\n' +
        '  end\n' +
        '\n' +
        '  # Implement a compiler method\n' +
        '  def compile_integer_node(iseq, node)\n' +
        '    iseq.emit(Putobject, node.value)\n' +
        '  end\n' +
        'end'
      )),
      h('h3', null, 'Final Goal'),
      h('p', null, 'By Step 7, you will be able to run:'),
      h('pre', null, h('code', null,
        'def fib(n)\n' +
        '  if n < 2\n' +
        '    n\n' +
        '  else\n' +
        '    fib(n - 1) + fib(n - 2)\n' +
        '  end\n' +
        'end\n' +
        'fib(10)  # => 55'
      )),
      h('p', null,
        'Click ', h('strong', null, 'Start Challenge'), ' below to begin!',
      ),
    ),
    instructions: '',
    stub: '',
    testCases: [],
  },

  {
    id: 1,
    title: 'Step 1: Integer Literals',
    description: h('div', null,
      h('h2', null, 'Step 1: Push Literals onto the Stack'),
      h('h3', null, 'Instruction: Putobject'),
      h('ul', null,
        h('li', null, h('code', null, 'putobject'), ' pushes a literal value onto the stack'),
      ),
      h('h3', null, 'Compiler: compile_integer_node'),
      h('p', null,
        'This method compiles ', h('code', null, 'Prism::IntegerNode'), ' (integer literals like ', h('code', null, '42'), ') into a ', h('code', null, 'Putobject'), ' instruction.'
      ),
      h('ul', null,
        h('li', null, h('code', null, 'Prism::IntegerNode'), ' represents a literal integer (e.g. ', h('code', null, '42'), ')'),
        h('li', null, h('code', null, 'node.value'), ' holds the integer'),
      ),
    ),
    instructions: 'putobject · compile_integer_node',
    stub: step1Stub,
    hints: [
      'vm.push(x) places a value on top of the stack.\niseq.emit(Insn, *args) appends an instruction to the iseq.',
    ],
    testCases: [
      { description: '42 → 42', source: '42', expected: 42 },
      { description: '100 → 100', source: '100', expected: 100 },
      { description: '0 → 0', source: '0', expected: 0 },
    ],
    bytecodePreview: `0000 putobject 42\n0002 leave`,
  },

  {
    id: 2,
    title: 'Step 2: Addition',
    description: h('div', null,
      h('h2', null, 'Step 2: Arithmetic — Addition'),
      h('h3', null, 'Instruction: OptPlus'),
      h('p', null,
        h('code', null, 'opt_plus'), ' pops two values and pushes their sum. ',
        'The compiler pushes ', h('strong', null, 'receiver first, then arguments'),
        ', so the stack looks like:',
      ),
      h('pre', { className: 'stack-diagram' }, h('code', null,
        '┌─────┐\n' +
        '│  2  │  ← argument (top)\n' +
        '├─────┤\n' +
        '│  1  │  ← receiver\n' +
        '└─────┘'
      )),
      h('h3', null, 'Compiler: compile_arguments_node'),
      h('p', null,
        'In Ruby, ', h('code', null, '1 + 2'), ' is actually a method call: ', h('code', null, '1.+(2)'), '. ',
        'Prism parses it as a ', h('code', null, 'CallNode'), ':'
      ),
      h('pre', null, h('code', null,
        'CallNode\n  receiver: IntegerNode   # left operand\n  name: :+\n  arguments: ArgumentsNode  # right operand'
      )),
      h('p', null,
        h('code', null, 'ArgumentsNode'), ' is a container that holds a list of arguments. ',
        h('code', null, 'node.arguments'), ' returns an array of child nodes. ',
        'Use ', h('code', null, 'compile_node(iseq, node)'),
        ' to recursively compile each one — it dispatches to the right method (e.g. ', h('code', null, 'compile_integer_node'), ' for IntegerNode).',
      ),
      h('h3', null, 'Compiler: compile_binary_plus'),
      h('p', null,
        'This method compiles ', h('code', null, '+'), ' expressions like ', h('code', null, '1 + 2'),
        ' into the instructions that push both values and then run ', h('code', null, 'OptPlus'), '.',
      ),
      h('ul', null,
        h('li', null, h('code', null, 'node.receiver'), ' — the left operand (IntegerNode)'),
        h('li', null, h('code', null, 'node.arguments'), ' — the right operand(s) (ArgumentsNode)'),
        h('li', null, 'Then emit ', h('code', null, 'OptPlus'), ' to add them'),
      ),
    ),
    instructions: 'opt_plus · compile_arguments_node · compile_binary_plus',
    stub: step2Stub,
    hints: [
      'compile_arguments_node:\n  node.arguments is an array.\n  Compile each child with compile_node.\n\nFor OptPlus, the stack before execution is [1, 2].\nPop two values, push their sum.',
      'OptPlus:\n  a = vm.pop\n  b = vm.pop\n  vm.push(b + a)\n\ncompile_arguments_node:\n  node.arguments.each { |arg| compile_node(iseq, arg) }\n\ncompile_binary_plus:\n  compile_node(iseq, node.receiver)\n  compile_node(iseq, node.arguments)\n  iseq.emit(OptPlus)',
    ],
    testCases: [
      { description: '1 + 2 = 3', source: '1 + 2', expected: 3 },
      { description: '10 + 5 = 15', source: '10 + 5', expected: 15 },
      { description: '0 + 0 = 0', source: '0 + 0', expected: 0 },
    ],
    bytecodePreview: `0000 putobject 1\n0002 putobject 2\n0004 opt_plus\n0005 leave`,
  },

  {
    id: 3,
    title: 'Step 3: Subtraction',
    description: h('div', null,
      h('h2', null, 'Step 3: Arithmetic — Subtraction'),
      h('h3', null, 'Instruction: OptMinus'),
      h('p', null,
        h('code', null, 'opt_minus'), ' pops two values and pushes their difference. ',
        h('strong', null, 'Order matters!'), ' The stack is the same as Step 2 — receiver first, argument on top:',
      ),
      h('pre', { className: 'stack-diagram' }, h('code', null,
        '┌─────┐\n' +
        '│  3  │  ← argument (top)\n' +
        '├─────┤\n' +
        '│ 10  │  ← receiver\n' +
        '└─────┘\n' +
        '\n' +
        'Result: 10 - 3 = 7 (receiver − argument)'
      )),
      h('h3', null, 'Compiler: compile_binary_minus'),
      h('p', null,
        h('code', null, '10 - 3'), ' is also a CallNode: ', h('code', null, '10.-(3)'),
        '. Same compile pattern as Step 2 — compile receiver, arguments, then emit the instruction.'
      ),
    ),
    instructions: 'opt_minus · compile_binary_minus',
    stub: step3Stub,
    hints: [
      'Same stack pattern as Step 2, but compute a - b.\nPop order matters!\n\nThe compiler pattern is identical to compile_binary_plus.',
      'OptMinus:\n  a = vm.pop\n  b = vm.pop\n  vm.push(b - a)\n\nCompiler:\n  compile_node(iseq, node.receiver)\n  compile_node(iseq, node.arguments)\n  iseq.emit(OptMinus)',
    ],
    testCases: [
      { description: '10 - 3 = 7', source: '10 - 3', expected: 7 },
      { description: '5 - 5 = 0', source: '5 - 5', expected: 0 },
      { description: '100 - 50 = 50', source: '100 - 50', expected: 50 },
    ],
    bytecodePreview: `0000 putobject 10\n0002 putobject 3\n0004 opt_minus\n0005 leave`,
  },

  {
    id: 4,
    title: 'Step 4: Local Variables',
    description: h('div', null,
      h('h2', null, 'Step 4: Local Variable Storage'),
      h('h3', null, 'How locals are stored'),
      h('p', null,
        'Local variables live inside the VM stack. Two pointers manage it:',
      ),
      h('ul', null,
        h('li', null, h('strong', null, 'SP (Stack Pointer)'), ' — top of the stack (where push/pop happen)'),
        h('li', null, h('strong', null, 'EP (Environment Pointer)'), ' — always at ', h('code', null, 'SP - 1'), ', locals are below EP'),
      ),
      h('p', null,
        'For ', h('code', null, 'x = 5; y = 10; x + y'), ':',
      ),
      h('pre', { className: 'stack-diagram' }, h('code', null,
        '     ┌───────────┐\n' +
        'SP → │           │  ← push/pop happen here\n' +
        '     ├───────────┤\n' +
        'EP → │  y = 10   │  ← offset 0  (newer)\n' +
        '     ├───────────┤\n' +
        '     │  x = 5    │  ← offset 1  (older)\n' +
        '     └───────────┘\n' +
        '\n' +
        'EP = SP - 1'
      )),
      h('p', null,
        'Instructions access locals by offset from EP. The older a variable, the larger its offset.',
      ),
      h('h3', null, 'Instruction: Getlocal / Setlocal'),
      h('ul', null,
        h('li', null, h('strong', null, 'Getlocal(idx)'), ': read the local at offset idx, push it onto the stack'),
        h('li', null, h('strong', null, 'Setlocal(idx)'), ': pop a value, store it at offset idx'),
      ),
      h('h3', null, 'Instruction: Dup'),
      h('p', null,
        'Why is ', h('code', null, 'dup'), ' needed? In Ruby, ', h('strong', null, 'assignment is an expression'), ' that returns the assigned value:',
      ),
      h('pre', null, h('code', null, 'p(x = 5)  # prints 5 — the assignment itself returns 5')),
      h('p', null,
        'So ', h('code', null, 'x = 5'), ' must leave ', h('code', null, '5'), ' on the stack as its return value, while also storing it into the local variable. ',
        h('code', null, 'dup'), ' duplicates the top of the stack so one copy goes to ', h('code', null, 'Setlocal'), ' and the other remains as the expression\'s result.',
      ),
      h('pre', { className: 'stack-diagram' }, h('code', null,
        'putobject 5    dup            setlocal 0\n' +
        '\n' +
        '               ┌─────┐\n' +
        '               │  5  │  (copy)\n' +
        '┌─────┐        ├─────┤        ┌─────┐\n' +
        '│  5  │        │  5  │        │  5  │  ← remains as return value\n' +
        '└─────┘        └─────┘        └─────┘'
      )),
      h('h3', null, 'Compiler: compile_local_var_read / write'),
      h('p', null,
        h('code', null, 'compile_local_var_read'), ' compiles ', h('code', null, 'Prism::LocalVariableReadNode'), ' (variable references like ', h('code', null, 'x'), ') into a ', h('code', null, 'Getlocal'), ' instruction. ',
        h('code', null, 'compile_local_var_write'), ' compiles ', h('code', null, 'Prism::LocalVariableWriteNode'), ' (assignments like ', h('code', null, 'x = 5'), ') into ', h('code', null, 'Dup'), ' + ', h('code', null, 'Setlocal'), '.'
      ),
      h('ul', null,
        h('li', null, 'Look up index: ', h('code', null, '@index_lookup_table[node.name]')),
        h('li', null, 'For write: compile value, emit ', h('code', null, 'Dup'), ', then ', h('code', null, 'Setlocal')),
      ),
    ),
    instructions: 'dup · getlocal · setlocal · compile_local_var_read · compile_local_var_write',
    stub: step4Stub,
    hints: [
      'Dup: peek the top of the stack and push a copy.\n\nGetlocal: read the local and push it.\nSetlocal: pop a value and store it.\n\nIn the compiler, @index_lookup_table[node.name] gives the variable index.',
      'Dup:\n  vm.push(vm.topn(1))\n\nGetlocal:\n  vm.push(vm.env_read(-idx))\n\nSetlocal:\n  vm.env_write(-idx, vm.pop)\n\ncompile_local_var_write:\n  compile node.value\n  emit Dup\n  emit Setlocal with the index',
    ],
    testCases: [
      { description: 'x = 5; x → 5', source: 'x = 5; x', expected: 5 },
      { description: 'a = 10; b = 20; a + b → 30', source: 'a = 10; b = 20; a + b', expected: 30 },
    ],
    bytecodePreview: `0000 putobject 5\n0002 dup\n0003 setlocal 0\n0005 getlocal 0\n0007 leave`,
  },

  {
    id: 5,
    title: 'Step 5: Comparison',
    description: h('div', null,
      h('h2', null, 'Step 5: Comparison — Less Than'),
      h('h3', null, 'Instruction: OptLt'),
      h('ul', null,
        h('li', null, h('code', null, 'opt_lt'), ' pops two values and pushes the comparison result (', h('code', null, 'a < b'), ')'),
        h('li', null, 'Same pattern as ', h('code', null, 'opt_plus'), ' / ', h('code', null, 'opt_minus')),
      ),
      h('h3', null, 'Compiler: compile_binary_lt'),
      h('p', null,
        h('code', null, '3 < 5'), ' is also a method call: ', h('code', null, '3.<(5)'),
        '. Same compile pattern as Steps 2 and 3 — compile receiver, arguments, then emit the instruction.'
      ),
      h('p', null,
        'The result (', h('code', null, 'true'), ' or ', h('code', null, 'false'), ') will be consumed by branch instructions in Step 6.'
      ),
    ),
    instructions: 'opt_lt · compile_binary_lt',
    stub: step5Stub,
    hints: [
      'Same stack pattern as OptPlus / OptMinus,\nbut push the boolean result of a < b.\n\nThe compiler pattern is identical to Steps 2 and 3.',
      'OptLt:\n  a = vm.pop\n  b = vm.pop\n  vm.push(b < a)\n\nCompiler:\n  compile_node(iseq, node.receiver)\n  compile_node(iseq, node.arguments)\n  iseq.emit(OptLt)',
    ],
    testCases: [
      { description: '3 < 5 → true', source: '3 < 5', expected: true },
      { description: '10 < 5 → false', source: '10 < 5', expected: false },
      { description: '5 < 5 → false', source: '5 < 5', expected: false },
    ],
    bytecodePreview: `0000 putobject 3\n0002 putobject 5\n0004 opt_lt\n0005 leave`,
  },

  {
    id: 6,
    title: 'Step 6: Control Flow',
    description: h('div', null,
      h('h2', null, 'Step 6: Conditional Branching'),
      h('h3', null, 'Key Insight: PC and offsets'),
      h('p', null,
        'The VM advances PC by instruction length ', h('strong', null, 'before'), ' executing:'
      ),
      h('pre', null, h('code', null, 'insn = iseq.fetch(pc)\npc += insn::LEN    ← advanced first\ninsn.call(vm, ...)  ← then executed')),
      h('p', null,
        'Branch instructions use ', h('strong', null, 'relative offsets'),
        ' to adjust PC from the current position.',
      ),
      h('h3', null, 'Instruction: Branchunless'),
      h('ul', null,
        h('li', null, 'Pop condition; if ', h('strong', null, 'falsy'), ' (nil or false), jump by the given offset'),
      ),
      h('h3', null, 'Instruction: Jump'),
      h('ul', null,
        h('li', null, 'Unconditionally jump by the given offset'),
      ),
      h('h3', null, 'Compiler: compile_conditional_node'),
      h('p', null,
        'This method compiles ', h('code', null, 'Prism::IfNode'), ' (if/else expressions) into a sequence of ', h('code', null, 'Branchunless'), ' and ', h('code', null, 'Jump'), ' instructions.'
      ),
      h('p', null,
        'The challenge: when you emit ', h('code', null, 'Branchunless'), ', you don\'t yet know how far to jump — the else-branch hasn\'t been compiled yet. ',
        'Use ', h('strong', null, 'forward-reference patching'), ': reserve space with a placeholder, compile the branches, then go back and fill in the correct offset.'
      ),
      h('p', null,
        'AST: ', h('code', null, 'node.predicate'), ' (condition), ',
        h('code', null, 'node.statements'), ' (then-branch), ',
        h('code', null, 'node.consequent'), ' (else-branch — may be ElseNode or nested IfNode).',
      ),
    ),
    instructions: 'branchunless · jump · compile_conditional_node',
    stub: step6Stub,
    hints: [
      'Branchunless: pop the condition, if falsy adjust PC by the offset.\nJump: always adjust PC by the offset.\n\nFor the compiler, use emit_placeholder to reserve space,\nthen patch_at! to fill in the offset once you know the target.',
      'Compiler steps:\n  1. compile predicate\n  2. emit_placeholder for Branchunless\n  3. compile then-branch\n  4. emit_placeholder for Jump\n  5. patch Branchunless → else label\n  6. compile else-branch\n  7. patch Jump → end label\n\nOffset = target - (placeholder_pc + Insn::LEN)',
    ],
    testCases: [
      { description: 'true branch', source: 'if 3 < 5; 10; else; 20; end', expected: 10 },
      { description: 'false branch', source: 'if 10 < 5; 10; else; 20; end', expected: 20 },
    ],
    bytecodePreview: `0000 putobject 3\n0002 putobject 5\n0004 opt_lt\n0005 branchunless 2\n0007 putobject 10\n0009 jump 2\n0011 putobject 20\n0013 leave`,
  },

  {
    id: 7,
    title: 'Step 7: Methods & Fibonacci!',
    description: h('div', null,
      h('h2', null, 'Step 7: Method Definition and Calling'),
      h('h3', null, 'Instruction: Definemethod'),
      h('ul', null,
        h('li', null, 'Register a method\'s iseq on the current class with a given name'),
      ),
      h('h3', null, 'Instruction: OptSendWithoutBlock'),
      h('ul', null,
        h('li', null, 'Dispatch a method call using call data (method name + argument count)'),
        h('li', null, 'Sets up a new frame with receiver + arguments'),
        h('li', null, 'The method\'s Leave instruction pushes the return value'),
      ),
      h('h3', null, 'Compiler: compile_def_node'),
      h('p', null,
        'This method compiles ', h('code', null, 'Prism::DefNode'), ' (method definitions like ', h('code', null, 'def fib(n)'), ') by creating a method iseq and emitting ', h('code', null, 'Definemethod'), '.'
      ),
      h('ul', null,
        h('li', null, h('code', null, 'YRuby::Iseq.iseq_new_method(node)'), ' compiles the body'),
        h('li', null, 'Emit ', h('code', null, 'Definemethod'), ' + ', h('code', null, 'Putobject(name)')),
      ),
      h('h3', null, 'Compiler: compile_general_call'),
      h('p', null,
        'This method compiles ', h('code', null, 'Prism::CallNode'), ' (method calls like ', h('code', null, 'fib(10)'), ') by emitting receiver, arguments, and ', h('code', null, 'OptSendWithoutBlock'), '.'
      ),
      h('ul', null,
        h('li', null, 'Emit ', h('code', null, 'Putself'), ' (implicit receiver for receiverless calls)'),
        h('li', null, 'Compile arguments, build ', h('code', null, 'CallData'), ', emit ', h('code', null, 'OptSendWithoutBlock')),
      ),
      h('h3', null, 'Final Goal: fib(10) = 55'),
      h('pre', null, h('code', null,
        'def fib(n)\n  if n < 2\n    n\n  else\n    fib(n - 1) + fib(n - 2)\n  end\nend\nfib(10)  # => 55'
      )),
    ),
    instructions: 'definemethod · opt_send_without_block · compile_def_node · compile_general_call',
    stub: step7Stub,
    hints: [
      'Definemethod:\n  vm.define_method(mid, iseq)\n\nOptSendWithoutBlock:\n  vm.sendish(cd)\n\ncompile_def_node:\n  create method iseq with YRuby::Iseq.iseq_new_method(node)\n  emit Definemethod(node.name, method_iseq)\n  emit Putobject(node.name)',
      'compile_general_call:\n  emit Putself\n  compile each argument with compile_node\n  emit OptSendWithoutBlock with\n    YRuby::CallData.new(\n      mid: node.name,\n      argc: node.arguments.arguments.length\n    )',
    ],
    testCases: [
      {
        description: 'identity(42) → 42',
        source: 'def identity(x); x; end; identity(42)',
        expected: 42,
      },
      {
        description: 'fib(5) → 5',
        source: 'def fib(n); if n < 2; n; else; fib(n - 1) + fib(n - 2); end; end; fib(5)',
        expected: 5,
      },
      {
        description: 'fib(10) → 55',
        source: 'def fib(n); if n < 2; n; else; fib(n - 1) + fib(n - 2); end; end; fib(10)',
        expected: 55,
      },
    ],
  },
]
