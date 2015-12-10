/* start up a static web server, contains livereload as a middleware */
/* source: https://github.com/gruntjs/grunt-contrib-connect */
/* source for connect livereload middleware : https://github.com/intesso/connect-livereload */

module.exports = function(grunt) {
grunt.config('connect', {
	connect: {
	    server: {
			options: {
				port: '<%= port %>',
				hostname: '<%= url %>',
				base: '<%= dist_path %>'
	      	},
	      	build: {
	      		options:{
		      		middleware: function (connect) {
						return [
							require('connect-livereload')()
						];
					}
				}
      		}
    	}
	}
});

grunt.loadNpmTasks('grunt-contrib-connect'); // enter the full plugin name here (as it is in package.json)
};