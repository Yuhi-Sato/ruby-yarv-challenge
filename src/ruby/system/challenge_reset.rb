# ============================================================
# Challenge Reset — stub out VM instruction methods
#
# yruby gem provides fully working implementations. This file
# overrides the VM instruction methods that workshop participants
# must implement, replacing them with NotImplementedError.
#
# Uses Patch module aliases so participants see short names
# (e.g. Putobject instead of YRuby::Insns::Putobject).
# ============================================================

module Patch
  # ---- Step 1: Integer Literals ----
  class Putobject
    def self.call(vm, value)
      raise NotImplementedError, "Putobject.call not implemented"
    end
  end

  # ---- Step 2: Addition ----
  class OptPlus
    def self.call(vm)
      raise NotImplementedError, "OptPlus.call not implemented"
    end
  end

  # ---- Step 3: Subtraction ----
  class OptMinus
    def self.call(vm)
      raise NotImplementedError, "OptMinus.call not implemented"
    end
  end

  # ---- Step 4: Local Variables ----
  class Getlocal
    def self.call(vm, idx)
      raise NotImplementedError, "Getlocal.call not implemented"
    end
  end

  class Setlocal
    def self.call(vm, idx)
      raise NotImplementedError, "Setlocal.call not implemented"
    end
  end

  class Dup
    def self.call(vm)
      raise NotImplementedError, "Dup.call not implemented"
    end
  end

  # ---- Step 5: Comparison ----
  class OptLt
    def self.call(vm)
      raise NotImplementedError, "OptLt.call not implemented"
    end
  end

  # ---- Step 6: Control Flow ----
  class Branchunless
    def self.call(vm, dst)
      raise NotImplementedError, "Branchunless.call not implemented"
    end
  end

  class Jump
    def self.call(vm, dst)
      raise NotImplementedError, "Jump.call not implemented"
    end
  end

  # ---- Step 7: Methods & Fibonacci ----
  class Definemethod
    def self.call(vm, mid, iseq)
      raise NotImplementedError, "Definemethod.call not implemented"
    end
  end

  class OptSendWithoutBlock
    def self.call(vm, cd)
      raise NotImplementedError, "OptSendWithoutBlock.call not implemented"
    end
  end
end
