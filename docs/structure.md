# web-boost application

### App structure

```text
.                             // Root of your application
├─ assets                     // Assets source directory
│  ├─ index.js
│  └─ index.scss
├─ views                      // Templates directory
│  ├─ index.twig
│  └─ layout.twig
├─ public                     // Compiled assets directory 
├─ web-boost.json             // Web-boost configuration file
└─ package.json
```

### Configuration file (`web-boost.json`)

```text
{
  "app": {                    // Application config object [Optional] 
    "views": "views",         // Templates directory [Optional, default: "views"]
    "public": "public",       // Compiled assets directory [Optional, default: "public"]
    "assets": "assets"        // Assets source directory [Optional, default: "assets"]
  },
  "routes": {                 // A list of web-boost application routes [Required]
    "/": {                    // Route slug [Required]
      "view": "index.twig",   // View to render (relative to "app.views") [Required]
      "vars": {               // View variables [Optional, default: {}]
        "name": "John",       
        "age": "26"           // Example: "<p>{{ age }}-Year-Old {{ name }} liked our repo ;)</p>"
      },
      "assets": {             // Route specific assets [Optional, default: {}]
        "js/index.min.js": [  // Assets destination file (relative to "app.public")
          "js/main.js",       // js/main.js + js/index.js => js/index.min.js
          "js/index.js"
        ],
        "css/index.min.css": [
          "styles/main.scss", // styles/main.scss + styles/index.scss => css/index.min.css
          "styles/index.scss" 
        ]
      }
    },
    "/other-route": {
      ...
    }
  }
}
```

> Route's slug should begin with `/` symbol
