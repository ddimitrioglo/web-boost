# web-boost

<img src="https://rawgit.com/ddimitrioglo/web-boost/master/logo.svg" width="200"/>

`web-boost` - boost your static site development.

### Description

Web-boost is a static site generator with page-speed optimisations. You build a dynamic site by using templating 
language, CSS preprocessor and routing - web-boost will compile it into highly optimised static pages.

* Uglify, concat & minify `javascript` files
* Compile, concat & minify `css`/`scss`/`sass` files
* Compile & minify `twig` templates
* Optimise image files (supported `.jpg` and `.png`, others will be skipped)

> To speed-up compilation, all the minified files (`.min.css` and `.min.js`) will be just concatenated

### Demo application

Try the demo application to learn `web-boost` in practice.

[![asciicast](https://asciinema.org/a/169719.png)](https://asciinema.org/a/169719)

> You can also build your application by following the [structure][2]

### Commands

* Run the application: `wb-run`* or `node node_modules/web-boost/bin/run.js`**
* Prepare for deploy: `wb-compile`* or `node node_modules/web-boost/bin/compile.js`**
* Generate sitemap.xml: `wb-sitemap`* or `node node_modules/web-boost/bin/sitemap.js`**

> `*` if web-boost is installed globally, `**` - locally

### @todo:

* Find a better watcher (maybe [node-watch](https://www.npmjs.com/package/node-watch)?)
* Add unit tests

### Improvements

* If you are facing some issues, please check [FAQs][4], or don't hesitate to open an issue
* If you have an idea how to improve this module, feel free to contribute or open an issue with `enhancement` label

We will get back to you as soon as possible.

### Credits

* Logo author [@3ab2ou](https://twitter.com/3ab2ou)
* Logo adjustments [@tkaciuk](https://github.com/tkaciuk)

### License

This repository can be used under the MIT license.
> See [LICENSE][5] for more details.

[1]: https://github.com/ddimitrioglo/web-boost/blob/master/cli-component/README.md#web-boost-cli
[2]: https://github.com/ddimitrioglo/web-boost/blob/master/docs/structure.md#web-boost-application
[3]: http://localhost:8080
[4]: https://github.com/ddimitrioglo/web-boost/blob/master/docs/faq.md
[5]: https://github.com/ddimitrioglo/web-boost/blob/master/docs/LICENSE
