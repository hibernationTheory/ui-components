module.exports = function(grunt) {
grunt.config('browserify', {
	options: {
		browserifyOptions: {
        	debug: true,
        	extensions: ['.js', '.json', '.es6'],
        	transform:['babelify']
		}
	},
	dist: {
		files: {
			'<%= dist_js_path %>main_browserify.js': ['<%= dist_js_path %>main.js'],
		},
	},
});

grunt.loadNpmTasks('grunt-browserify');

};
    