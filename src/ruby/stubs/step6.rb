module Patch
  class Branchunless
    def self.call(vm, dst)
      # TODO: Pop condition; if falsy (nil or false), jump by dst
      raise NotImplementedError, "Branchunless.call not implemented"
    end
  end

  class Jump
    def self.call(vm, dst)
      # TODO: Unconditionally jump by dst
      raise NotImplementedError, "Jump.call not implemented"
    end
  end

  def compile_conditional_node(iseq, node) # node: Prism::IfNode
    # See the tutorial panel for the full patching algorithm
    raise NotImplementedError, "compile_conditional_node not implemented"
  end
end
