module Patch
  class OptMinus
    def self.call(vm)
      # TODO: Pop two values from the stack, push a - b (order matters!)
      raise NotImplementedError, "OptMinus.call not implemented"
    end
  end

  def compile_binary_minus(iseq, node)
    # TODO: Compile the receiver, compile the arguments, then emit OptMinus
    raise NotImplementedError, "compile_binary_minus not implemented"
  end
end
