module Patch
  class OptLt
    def self.call(vm)
      # TODO: Pop two values from the stack, push (a < b)
      raise NotImplementedError, "OptLt.call not implemented"
    end
  end

  def compile_binary_lt(iseq, node)
    # TODO: Compile the receiver, compile the arguments, then emit OptLt
    raise NotImplementedError, "compile_binary_lt not implemented"
  end
end
