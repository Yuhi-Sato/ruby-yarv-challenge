class ChallengeTestRunner
  def initialize(vm)
    @vm = vm
    @results = []
  end

  def test(description, source, expected)
    $challenge_output = ""
    begin
      result = @vm.exec(source)
      passed = result == expected
      @results << {
        description: description,
        source: source,
        expected: expected.inspect,
        got: result.inspect,
        passed: passed,
        error: nil
      }
    rescue => e
      @results << {
        description: description,
        source: source,
        expected: expected.inspect,
        got: nil,
        passed: false,
        error: e.message
      }
    end
  end

  def report
    all_passed = @results.all? { |r| r[:passed] }
    lines = []
    @results.each do |r|
      status = r[:passed] ? "PASS" : "FAIL"
      if r[:passed]
        lines << "[#{status}] #{r[:description]}"
      else
        lines << "[#{status}] #{r[:description]}: expected=#{r[:expected]}, got=#{r[:got]}"
        lines << "  Error: #{r[:error]}" if r[:error]
      end
    end
    lines << ""
    lines << (all_passed ? "ALL_TESTS_PASSED" : "SOME_TESTS_FAILED")
    lines.join("\n")
  end

  def all_passed?
    @results.all? { |r| r[:passed] }
  end
end
