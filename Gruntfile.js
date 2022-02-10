module.exports = function (grunt) {
	require("load-grunt-tasks")(grunt);

	grunt.initConfig({
		copy: {
			html: {
				files: [
					{
						expand: true,
						cwd: "src",
						src: "**/*.html",
						dest: "build",
					},
				],
			},
		},
		browserify: {
			default: {
				options: { browserifyOptions: { debug: true }, plugin: ["tsify"] },
				files: [
					{
						expand: true,
						cwd: "src",
						src: "view/main.tsx",
						dest: "build/",
						rename: (dest, src) => {
							return dest + src.replace(/\.tsx?$/, ".js");
						},
					},
				],
			},
		},
		sass: {
			default: {
				options: {
					noCache: true,
					sourcemap: "none",
					style: "expanded",
				},
				files: [
					{
						expand: true,
						cwd: "src",
						src: ["**/*.scss", "!**/_*.scss"],
						dest: "build/",
						ext: ".css",
					},
				],
			},
		},
		watch: {
			options: {
				livereload: true,
			},
			config: {
				files: ["Gruntfile.js"],
			},
			typescript: {
				files: "src/view/**/*.{ts,tsx}",
				tasks: "browserify",
			},
			html: {
				files: ["src/view/**/*.html"],
				tasks: "copy:html",
			},
			css: {
				files: "src/view/**/*.{scss,sass}",
				tasks: "sass",
			},
		},
	});
};
