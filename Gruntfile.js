
var sourceDir = "src/"
var configDir = sourceDir +"config/"
var sourceDirWebApp = sourceDir +"webapp/"
var sourceDirServerApp = sourceDir +"server/";
var buildDirWebApp = "build/webapp/";
var buildDirServerApp = "build/";

module.exports = function(grunt) {
	grunt.initConfig({
		concat: {
			options: {
				separator: ';'
			},
			webapp: {
				src: [
                    configDir + '**/*.js',
					sourceDirWebApp + 'app/lib/jquery.js',
					sourceDirWebApp + 'app/lib/bootstrap.min.js',
					sourceDirWebApp + 'app/js/Config.js',
					sourceDirWebApp + 'app/js/**/*.js'
				],
				dest: buildDirWebApp + 'app/js/app.js'
			},
			server: {
				src: [
                    configDir + '**/*.js',
					sourceDirServerApp + 'WebSocketServer.js',
					sourceDirServerApp + 'SimpleChatServer.js',
					sourceDirServerApp + '**/*.js'
				],
				dest: buildDirServerApp + 'app.js'
			}
		},
		sass: {
			dist: {
				options: {
					style: 'compressed' // compressed, expanded
				},
				files: [{
					src: [sourceDirWebApp + 'app/sass/main.scss'],
					dest: buildDirWebApp + 'app/css/styles.css'
				}]
			}
		},
		copy: {
			main: {
				files: [
					{expand: true, cwd: sourceDirWebApp + 'app/', src: ['font/**'], dest: buildDirWebApp + 'app'},
					{expand: true, cwd: sourceDirWebApp + 'app/', src: ['img/**'], dest: buildDirWebApp + 'app'},
					{expand: true, cwd: sourceDirWebApp + 'app/', src: ['audio/**'], dest: buildDirWebApp + 'app'},
					{expand: true, cwd: sourceDirWebApp, src: ['*'], dest: buildDirWebApp, filter: 'isFile'}
				]
			}
		},
		watch: {
			scripts: {
				files: [ sourceDirWebApp + '**/*'], // all files in src dir
				tasks: ['build'],
				options: {
					livereload: true,
					debounceDelay: 250
				}
			}
		},
		open: {
			server: {
				path: 'http://localhost:3000/'
			}
		},
		nodemon: {
			dev: {
				options: {
					file: buildDirServerApp + 'app.js',
					watchedExtensions: ['js'],
					watchedFolders: [sourceDirServerApp],
					delayTime: 1,
					legacyWatch: true
				}
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-open');

	grunt.registerTask('server', [
		'build',
		'nodemon'
	]);

	grunt.registerTask('build', [
		'concat',
		'sass',
		'copy'
	]);

	grunt.registerTask('default', [
		'build',
        'open'
	]);
};