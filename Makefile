.PHONY: run run-watch test test-watch fmt fmt-watch fmt-check lint precommit
COMMON_ARGS = --import-map=import-map.json --allow-run --allow-net --allow-read=./config.yml --allow-write=./var/

run:
	@deno run ${COMMON_ARGS} src/server.js

run-watch:
	@deno run ${COMMON_ARGS} --watch src/server.js

test:
	@clear
	@deno test ${COMMON_ARGS} test/

test-watch:
	@clear
	@deno test ${COMMON_ARGS} --watch test/

precommit:
	@clear
	@echo "\nFORMAT" && echo "────────────────────" && deno fmt
	@echo "\nTESTS" && echo "────────────────────" && deno test ${COMMON_ARGS} test/
	@echo "LINT" && echo "────────────────────" && deno lint && echo "\n"
