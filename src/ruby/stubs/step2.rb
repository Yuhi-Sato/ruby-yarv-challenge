module Patch
  class OptPlus
    def self.call(vm)
      # TODO: Pop two values from the stack, push their sum
      raise NotImplementedError, "OptPlus.call not implemented"
    end
  end

  def compile_arguments_node(iseq, node)
    # TODO: Compile each argument in order
    raise NotImplementedError, "compile_arguments_node not implemented"
  end

  def compile_binary_plus(iseq, node)
    # TODO: Compile the receiver, compile the arguments, then emit OptPlus
    raise NotImplementedError, "compile_binary_plus not implemented"
  end
end
