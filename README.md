# web-boost

<img src="https://github.com/ddimitrioglo/web-boost/blob/dev/web-boost-logo.svg" width="200"/>

`web-boost` - boost your static site development.

### Description

Web-boost is a static site generator with page-speed optimisations. You build a dynamic site by using `twig`, `scss` 
and routing - web-boost will compile it into highly optimised static pages.

* Uglify, concat & minify `javascript` files
* Compile, concat & minify `scss`/`css` files
* Compile & minify `twig` templates
* Optimise `.jpg` and `.png` files

### Usage

* Generate application with `web-boost-cli` (see [user guide][1]) or create it yourself by following the [structure][2]
* Install dependencies: `npm install`
* Run the application: `npm run start` and go to [localhost:8080][3]
* Prepare for deploy: `npm run compile`

### @todo:

* Add video tutorial
* Add unit tests
* Get rid of express.js (find simple router lib)

### Improvements

* If you are facing some issues, please check [FAQ][4], or don't hesitate to open an issue
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
