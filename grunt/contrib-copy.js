module.exports = function(grunt) {
grunt.config('copy', {
	main: {
	files: [
		// makes all src relative to cwd 
		{expand: true, cwd: '<%= src_path %>', src: ['**'], dest: '<%= dist_path %>'},
		],
	},
});

grunt.loadNpmTasks('grunt-contrib-copy');

};



