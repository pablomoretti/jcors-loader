build:
	java -jar lib/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --js src/jcors-loader.js > src/jcors-loader.min.js
	gzip -c src/jcors-loader.min.js > src/jcors-loader.min.js.gz