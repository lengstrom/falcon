debug: src/search.cpp src/interop.js
	~/projects/emscripten/emsdk_portable/emscripten/1.35.0/em++ -o test/search.js -s EXPORTED_FUNCTIONS="['_buildBMSTable', '_BMSMatch']" src/search.cpp
	cp src/interop.js test/interop.js

build: src/search.cpp src/interop.js
	if [ ! -d test ]; then
		mkdir out
	fi
	~/projects/emscripten/emsdk_portable/emscripten/1.35.0/em++ -O3 -o out/search.js -s EXPORTED_FUNCTIONS="['_buildBMSTable', '_BMSMatch']" -s AGGRESSIVE_VARIABLE_ELIMINATION=1  src/search.cpp
	cp src/interop.js out/interop.js

clean: 
	rm out/search.js out/search.js.mem out/interop.js 
	rm test/search.js test/search.js.mem test/interop.js 
