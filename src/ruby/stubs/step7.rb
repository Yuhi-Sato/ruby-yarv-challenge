module Patch
  class Definemethod
    def self.call(vm, mid, iseq)
      # TODO: Register the method with vm.define_method(mid, iseq)
      raise NotImplementedError, "Definemethod.call not implemented"
    end
  end

  class OptSendWithoutBlock
    def self.call(vm, cd)
      # TODO: Dispatch the method call with vm.sendish(cd)
      raise NotImplementedError, "OptSendWithoutBlock.call not implemented"
    end
  end

  def compile_def_node(iseq, node)
    # TODO: Create method iseq with YRuby::Iseq.iseq_new_method(node),
    #       emit Definemethod(node.name, method_iseq), emit Putobject(node.name)
    raise NotImplementedError, "compile_def_node not implemented"
  end

  def compile_general_call(iseq, node)
    # TODO: Emit Putself, compile each argument, emit OptSendWithoutBlock
    #       with YRuby::CallData.new(mid: node.name, argc: args_count)
    raise NotImplementedError, "compile_general_call not implemented"
  end
end
