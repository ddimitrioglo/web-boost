# web-boost

<img src="https://raw.githack.com/ddimitrioglo/web-boost/master/logo.svg" width="200"/>

#### `web-boost` - boost your static site development

### Description

Web-boost is a static site generator with page-speed optimisations. You build a dynamic site by using templating 
language, CSS preprocessor and routing - web-boost will compile it into highly optimised static pages.

* Uglify, concat & minify `javascript` files
* Compile, concat & minify `css`/`scss`/`sass` files
* Compile & minify `twig` templates
* Optimise image files (supported `.jpg` and `.png`, others will be skipped)

> To speed-up compilation, all the minified files (`.min.css` and `.min.js`) will be just concatenated

### Installation

`npm install -g web-boost` (Global installation is optional)

> Linux users should previously install `sudo apt-get install libpng-dev`

### Demo application

Try the demo application to learn `web-boost` in practice.

[![asciicast](https://asciinema.org/a/222630.png)](https://asciinema.org/a/222630)

> You can also build your application by following the [structure][1]

### Commands

* Run the application: `wb-run`* or `node node_modules/web-boost/bin/run.js`**
* Prepare for deploy: `wb-compile`* or `node node_modules/web-boost/bin/compile.js`**
* Generate sitemap.xml: `wb-sitemap`* or `node node_modules/web-boost/bin/sitemap.js`**

> `*` if web-boost is installed globally, `**` - locally

### @todo:

* Add unit tests
* Investigate [consolidate.js][2]
* Rename `web-boost-cli` => `web-boost` & `web-boost` => `www-boost` (just a thought)

### Improvements

* If you are facing some issues, please check [FAQs][3], or don't hesitate to open an issue
* If you have an idea how to improve this module, feel free to contribute or open an issue with `enhancement` label

We will get back to you as soon as possible.

### Credits

* Logo author [@3ab2ou](https://twitter.com/3ab2ou)
* Logo adjustments [@tkaciuk](https://github.com/tkaciuk)

### Projects using `web-boost`

* [www.404.md](https://www.404.md)
* [www.terrahub.io](https://www.terrahub.io)
* [www.mitocgroup.com](https://www.mitocgroup.com)

### License

This repository can be used under the MIT license.
> See [LICENSE][4] for more details.

[1]: https://github.com/ddimitrioglo/web-boost/blob/master/docs/structure.md#web-boost-application
[2]: https://www.npmjs.com/package/consolidate
[3]: https://github.com/ddimitrioglo/web-boost/blob/master/docs/faq.md
[4]: https://github.com/ddimitrioglo/web-boost/blob/master/docs/LICENSE
