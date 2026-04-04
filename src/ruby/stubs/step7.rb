module Patch
  class Definemethod
    def self.call(vm, mid, iseq)
      # TODO: Register the method on the VM — check the API Reference
      raise NotImplementedError, "Definemethod.call not implemented"
    end
  end

  class OptSendWithoutBlock
    def self.call(vm, cd)
      # TODO: Dispatch the method call — check the API Reference
      raise NotImplementedError, "OptSendWithoutBlock.call not implemented"
    end
  end

  def compile_def_node(iseq, node)
    # TODO: Create a method iseq, emit Definemethod to register it, emit the return value (method name)
    raise NotImplementedError, "compile_def_node not implemented"
  end

  def compile_general_call(iseq, node)
    # TODO: Emit receiver (self), compile arguments, emit the call instruction with CallData
    raise NotImplementedError, "compile_general_call not implemented"
  end
end
