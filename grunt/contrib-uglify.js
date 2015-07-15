module.exports = function(grunt) {
grunt.config('uglify', {
		my_target: {
			files: {
				'<%= dist_js_path %>output.min.js':['app/*.js', '<%= src_js_path %>*.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
};