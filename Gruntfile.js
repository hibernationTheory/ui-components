var source_js_path = 'app/js/';
var dest_js_path = 'dest/js/';

module.exports = function(grunt) {
    grunt.initConfig({
        'dest_js_path': dest_js_path,
        'source_js_path':source_js_path,
        pkg:require('./package.json')
    });

    grunt.loadTasks('grunt');

    // task setup
    grunt.registerTask('build', 'Build site files for testing or deployment.', ['babel']);
};