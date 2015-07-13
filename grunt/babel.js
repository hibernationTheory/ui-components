module.exports = function(grunt) {
grunt.config("babel", {
	options: {
		sourceMap: true
	},
	dist: {
		files: {
			"dist/main.js": "src/main.js"
		}
	}
});

grunt.loadNpmTasks('grunt-babel');

};

