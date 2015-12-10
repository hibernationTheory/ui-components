/* launches the desired browser and the specified url */
/* source: https://github.com/jsoverson/grunt-open */

module.exports = function(grunt) {
grunt.config('open', {
		build : {
			path: '<%= url %>:<%= port %>/<%= dist_path %>',
			app: '<%= browser %>'
		},
		/* example 
		build : {
			path : 'http://google.com/',
			app: 'Firefox'
		},
		file : {
			path : '/etc/hosts'
		},
		custom: {
			path : function () {
				return grunt.option('path');
			} 
		}
		*/
});

grunt.loadNpmTasks('grunt-open'); // enter the full plugin name here (as it is in package.json)

};