#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"

# Install gems to get yruby's lib files
bundle install

# Find the yruby gem lib directory
YRUBY_LIB=$(bundle exec ruby -e 'puts Gem::Specification.find_by_name("yruby").gem_dir + "/lib"')

# Base wasm from npm package
BASE_WASM="../node_modules/@ruby/4.0-wasm-wasi/dist/ruby+stdlib.wasm"

# Pack yruby gem files into a dedicated directory under the existing /usr/local/lib/ruby/
# Avoids overwriting stdlib. $LOAD_PATH is added at runtime in useRubyVM.ts.
bundle exec rbwasm pack \
  "$BASE_WASM" \
  --dir "${YRUBY_LIB}::/usr/local/lib/ruby/yruby" \
  -o ../public/ruby+yruby.wasm

echo "Built: public/ruby+yruby.wasm"
ls -lh ../public/ruby+yruby.wasm
