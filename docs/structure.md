# web-boost application

### App structure

```text
app/                            // Root of your application
├─ assets/                      // Assets directory (scss/sass/js, needs pre-processing)
│  ├─ index.js
│  └─ index.scss
├─ static/                      // Static files directory (fonts/images/static data, server serves them as is)
├─ views/                       // Templates directory
│  ├─ index.twig
│  └─ layout.twig
├─ build/                       // Application build directory (static web site) 
├─ web-boost.js                 // Web-boost configuration file (could be `js` or `json`)
└─ package.json
```

### Configuration file (`web-boost.js`)

```js
module.exports = {
  app: {                        // Application config object [Optional] 
    views: 'views',             // Templates directory [Optional, default: 'views']
    build: 'build',             // Build directory [Optional, default: 'build']
    assets: 'assets',           // Assets source directory [Optional, default: 'assets']
    static: 'static'            // Static files directory [Optional, default: 'static']
  },
  server: {                     // Server config object [Optional]
    port: 8080,                 // Server port [Optional, default: 8080]
    delay: 2000,                // Server restart delay on changes [Optional, default: 2000]
    retries: 3,                 // Server restart retries on error [Optional, default: 3]
    ignorePatterns: ['build']   // List of patterns to changes ignore [Optional, default: 'node_nodules']
  },
  template: {
    extensions: '/some/ext.js'  // Path to the extensions see more in `../templates.md` [Optional, default: 'false']
  },
  routes: {                     // A list of web-boost application routes [Required]
    '/': {                      // Route slug [Required]
      view: 'index.twig',       // View to render (relative to 'app.views') [Required]
      vars: {                   // View variables [Optional, default: {}]
        name: 'John',       
        age: 26                 // Example: "<p>{{ age }}-Year-Old {{ name }} liked our repo ;)</p>"
      },
      assets: {                 // Route specific assets [Optional, default: {}]
        'js/index.min.js': [    // Assets destination file (relative to "app.public")
          'js/index.js'
        ],
        'css/index.min.css': [
          'styles/main.scss',   // styles/main.scss + styles/index.scss => css/index.min.css
          'styles/index.scss' 
        ]
      }
    },
    '/other-route': {
      // other route definition
    }
  }
}
```

> Route's slug should begin with `/` symbol
> Configuration file could be `json` but it less configurable :wink:
