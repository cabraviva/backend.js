print('Welcome to the setup assistant!\nPlease enter the informations')


template = '''{
  "name": "#_#name#_#",
  "version": "#_#version#_#",
  "description": "#_#description#_#",
  "main": "dist/bundle.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1",
    "setup": "npm install && npm run config",
    "config": "python setup.py",
    "build": "babel src -d dist && uglifyjs dist/main.js -o dist/bundle.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/greencoder001/#_#name#_#.git"
  },
  "author": "Green_Lab",
  "license": "#_#license#_#",
  "bugs": {
    "url": "https://github.com/greencoder001/#_#name#_#/issues"
  },
  "homepage": "https://github.com/greencoder001/#_#name#_##readme",
  "devDependencies": {
    "@babel/cli": "^7.11.6",
    "@babel/core": "^7.11.6",
    "@babel/preset-env": "^7.11.5",
    "uglify-js": "^3.10.4"
  }
}'''

################################################################################

prefix = '#_#'
suffix = '#_#'

################################################################################

name = input('Name: ')
desc = input('Description: ')
vers = input('Version: ')
lice = input('License: ')

################################################################################

output = template.replace(prefix + 'version' + suffix, vers).replace(prefix + 'license' + suffix, lice).replace(prefix + 'name' + suffix, name).replace(prefix + 'description' + suffix, desc)

################################################################################

file = open('package.json', 'w')
file.write(output)
file.close()

################################################################################

file = open('.babelrc', 'w')
file.write('''{
  "presets": ["@babel/preset-env"]
}''')
file.close()
