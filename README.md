# Drupal Starter Theme

Hi. I'm a Drupal 8 starter theme.

I contain modern tools such as Package manager, Gulp, Browersync, PurgeCSS and more.

## Getting Started

Git clone the theme, into your drupal_installation/themes

## Getting the theme set up on local

Run `npm install` in the theme root to do a first time setup. (this grabs node_modules, package.lock and other files required to run the theme).

You will also want to setup your local website URL for browser sync. Change the URL in `gulpconfig.json` Search for _**http://replacemewithlocalurl.loc/**_

## Build commands

###### Watch Mode

`gulp watch bs` To put your theme in "watch" mode (Watches for SCSS and JS Changes, then reloads the browser) type in the theme root.