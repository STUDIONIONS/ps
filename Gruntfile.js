module.exports = function(grunt){
	
	require('time-grunt')(grunt);
	
	var tsCommand = grunt.option('type') || 'default',
		fs = require('fs'),
		chalk = require('chalk'),
		uniqid = function () {
			var md5 = require('md5');
			result = md5((new Date()).getTime()).toString();
			grunt.verbose.writeln("Generate hash: " + chalk.cyan(result) + " >>> OK");
			return result;
		},
		tasks = [],
		gc = {
			template: 'assets/templates/projectsoft'
		};
	switch(tsCommand){
		case "css":
		case "html":
			grunt.loadNpmTasks('grunt-contrib-less');
			grunt.loadNpmTasks('grunt-autoprefixer');
			grunt.loadNpmTasks('grunt-group-css-media-queries');
			grunt.loadNpmTasks('grunt-contrib-cssmin');
			grunt.loadNpmTasks('grunt-contrib-pug');
			tasks = [
				"less",
				"autoprefixer",
				"group_css_media_queries",
				"replace",
				"cssmin",
				"pug"
			];
			break;
		case "js":
			grunt.loadNpmTasks('grunt-contrib-uglify-es');
			grunt.loadNpmTasks('grunt-contrib-pug');
			tasks = [
				"uglify",
				"pug"
			];
			break;
		case "image":
			grunt.loadNpmTasks('grunt-contrib-less');
			grunt.loadNpmTasks('grunt-autoprefixer');
			grunt.loadNpmTasks('grunt-group-css-media-queries');
			grunt.loadNpmTasks('grunt-contrib-cssmin');
			grunt.loadNpmTasks('grunt-contrib-pug');
			grunt.loadNpmTasks('grunt-contrib-imagemin');
			grunt.loadNpmTasks('grunt-tinyimg');
			tasks = [
				"imagemin",
				"tinyimg",
				"less",
				"autoprefixer",
				"group_css_media_queries",
				"replace",
				"cssmin",
				"pug"
			];
		case "fonts":
			grunt.loadNpmTasks('grunt-contrib-less');
			grunt.loadNpmTasks('grunt-autoprefixer');
			grunt.loadNpmTasks('grunt-group-css-media-queries');
			grunt.loadNpmTasks('grunt-contrib-cssmin');
			grunt.loadNpmTasks('grunt-contrib-pug');
			grunt.loadNpmTasks('grunt-ttf2eot');
			grunt.loadNpmTasks('grunt-ttf2woff');
			grunt.loadNpmTasks('grunt-ttf2woff2');
			grunt.loadNpmTasks('grunt-webfont');
			tasks = [
				"webfont",
				"ttf2eot",
				"ttf2woff",
				"ttf2woff2",
				"less",
				"autoprefixer",
				"group_css_media_queries",
				"replace",
				"cssmin",
				"pug"
			]
			break;
		default:
			grunt.loadNpmTasks('grunt-contrib-less');
			grunt.loadNpmTasks('grunt-autoprefixer');
			grunt.loadNpmTasks('grunt-group-css-media-queries');
			grunt.loadNpmTasks('grunt-contrib-cssmin');
			grunt.loadNpmTasks('grunt-contrib-uglify-es');
			grunt.loadNpmTasks('grunt-contrib-imagemin');
			grunt.loadNpmTasks('grunt-tinyimg');
			grunt.loadNpmTasks('grunt-contrib-pug');
			grunt.loadNpmTasks('grunt-ttf2eot');
			grunt.loadNpmTasks('grunt-ttf2woff');
			grunt.loadNpmTasks('grunt-ttf2woff2');
			grunt.loadNpmTasks('grunt-webfont');
			tasks = [
				"imagemin",
				"tinyimg",
				"webfont",
				"ttf2eot",
				"ttf2woff",
				"ttf2woff2",
				"less",
				"autoprefixer",
				"group_css_media_queries",
				"replace",
				"cssmin",
				"uglify",
				"pug"
			]
			break;
	}
	grunt.initConfig({
		globalConfig : gc,
		pkg : grunt.file.readJSON('package.json'),
		imagemin: {
			base: {
				options: {
					optimizationLevel: 3,
					svgoPlugins: [
						{
							removeViewBox: false
						}
					]
				},
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'src/images/*.{png,jpg,jpeg}'
						],
						dest: 'test/images/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten : true,
						src: [
							'src/images/*.{gif,svg}'
						],
						dest: '<%= globalConfig.template %>/images/',
						filter: 'isFile'
					}
				],
			}
		},
		tinyimg: {
			dynamic: {
				files: [
					{
						expand: true,
						cwd: 'test/images', 
						src: ['**/*.{png,jpg,jpeg}'],
						dest: '<%= globalConfig.template %>/images/'
					}
				]
			}
		},
		webfont: {
			icons: {
				src: 'src/glyph/*.svg',
				dest: 'src/fonts',
				options: {
					hashes: true,
					relativeFontPath: '@{fontpath}',
					destLess: 'src/less',
					font: 'icon-ps',
					types: 'ttf,eot,woff,woff2',
					fontFamilyName: 'IconPS',
					stylesheets: ['less'],
					syntax: 'bootstrap',
					execMaxBuffer: 1024 * 400,
					htmlDemo: false,
					version: gc.fontVers,
					normalize: true,
					startCodepoint: 0xE900,
					iconsStyles: false,
					templateOptions: {
						baseClass: '',
						classPrefix: 'icon-'
					},
					embed: false,
					template: 'src/font-build.template'
				}
			},
		},
		ttf2eot: {
			default: {
				src: 'src/fonts/*.ttf',
				dest: '<%= globalConfig.template %>/fonts/'
			}
		},
		ttf2woff: {
			default: {
				src: 'src/fonts/*.ttf',
				dest: '<%= globalConfig.template %>/fonts/'
			}
		},
		ttf2woff2: {
			default: {
				src: 'src/fonts/*.ttf',
				dest: '<%= globalConfig.template %>/fonts/'
			}
		},
		less: {
			css: {
				options : {
					compress: false,
					ieCompat: false,
					plugins: [
						new NpmImportPlugin({prefix: '~'})
					],
					modifyVars: {
						hashes: '\'' + uniqid() + '\'',
						fontpath: '/<%= globalConfig.template %>/fonts',
						imagepath: '/<%= globalConfig.template %>/images'
					}
				},
				files : {
					'test/css/main.css' : [
						'src/less/main.less'
					]
				}
			}
		},
		autoprefixer:{
			options: {
				browsers: [
					"last 4 version"
				],
				cascade: true
			},
			css: {
				files: {
					'test/css/prefix.main.css' : ['test/css/main.css']
				}
			},
		},
		group_css_media_queries: {
			group: {
				files: {
					'test/css/media/main.css': ['test/css/prefix.main.css']
				}
			}
		},
		replace: {
			css: {
				options: {
					patterns: [
						{
							match: /\/\* *(.*?) *\*\//g,
							replacement: ' '
						},
						{
							match: / \/ /g,
							replacement: '/'
						}
					]
				},
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'test/css/media/main.css'
						],
						dest: 'test/css/replace/',
						filter: 'isFile'
					},
					{
						expand: true,
						flatten : true,
						src: [
							'test/css/media/main.css'
						],
						dest: '<%= globalConfig.template %>/css/',
						filter: 'isFile'
					}
				]
			}
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			minify: {
				files: {
					'<%= globalConfig.template %>/css/main.min.css' : ['test/css/replace/main.css']
				}
			}
		},
		concat: {
			options: {
				separator: "\n",
			},
			appjs: {
				src: [
					'bower_components/jquery/dist/jquery.js',
					//"bower_components/jquery-lazy/jquery.lazy.js",
					"bower_components/fancybox/src/js/core.js",
					"bower_components/fancybox/src/js/media.js",
					"bower_components/fancybox/src/js/guestures.js",
					"bower_components/fancybox/src/js/slideshow.js",
					"bower_components/fancybox/src/js/fullscreen.js",
					"bower_components/fancybox/src/js/thumbs.js",
					//"src/js/fancybox.share.js",
					"bower_components/fancybox/src/js/hash.js",
					"bower_components/fancybox/src/js/wheel.js",
					'bower_components/slick-carousel/slick/slick.js',
					'bower_components/js-cookie/src/js.cookie.js',
					//'src/js/lazysizes.min.js'
				],
				dest: 'test/js/appjs.js'
			},
			main: {
				src: [
					//'src/js/tooltip.js',
					'src/js/main.js'
				],
				dest: 'test/js/main.js'
			}
		},
		uglify: {
			app: {
				options: {
					sourceMap: false,
					compress: {
						drop_console: false
	  				}
				},
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'test/js/appjs.js',
							'test/js/main.js'
						],
						dest: '<%= globalConfig.template %>/js/',
						filter: 'isFile'
					}
				]
			},
		},
	});
	grunt.registerTask('default', tasks);
}