debug: src/test.cpp
	~/projects/emscripten/emsdk_portable/emscripten/1.35.0/em++ -o out/out.js -s EXPORTED_FUNCTIONS="['_buildBMSTable', '_BMSMatch']" src/test.cpp

prod: src/test.cpp
	~/projects/emscripten/emsdk_portable/emscripten/1.35.0/em++ -O3 -o out/out.js -s EXPORTED_FUNCTIONS="['_buildBMSTable', '_BMSMatch']" -s AGGRESSIVE_VARIABLE_ELIMINATION=1  src/test.cpp

clean:
	rm out/out.js out/out.js.mem
