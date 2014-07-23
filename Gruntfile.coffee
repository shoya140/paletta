module.exports = (grunt) ->
  grunt.initConfig
    bower:
      install:
        options:
          targetDir: './app/static'
          layout: 'byComponent'
          install: true
          verbose: false
          cleanTargetDir: false
          cleanBowerDir: false

    sass:
      compile:
        src: 'app/_scss/*.scss'
        dest: 'app/static/custom/css/style.css'

    coffee:
      compile:
        src: 'app/_coffee/*.coffee'
        dest: 'app/static/custom/js/script.js'

    watch:
      scss:
        files: 'app/_scss/*.scss'
        tasks: ['sass']
      coffee:
        files: 'app/_coffee/*.coffee'
        tasks: ['coffee']

    connect:
      server:
        options:
          port: 8010
          base: 'app'
          open: true

  grunt.loadNpmTasks 'grunt-bower-task'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-connect'

  grunt.registerTask 'default',  ['sass', 'coffee', 'watch']
  grunt.registerTask 'server',  ['sass', 'coffee', 'connect', 'watch']
