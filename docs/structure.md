# web-boost application

### App structure

```text
app/                          # Root of your application
├─ assets/                    # Assets directory (scss/sass/js, needs pre-processing)
│  ├─ index.js
│  └─ index.scss
├─ static/                    # Static files directory (fonts/images/static data, serves as is)
├─ views/                     # Templates directory
│  ├─ index.twig
│  └─ layout.twig
├─ build/                     # Application build directory (static web site) 
├─ web-boost.json             # Web-boost configuration file
└─ package.json
```

### Configuration file (`web-boost.json`)

```text
{
  "$": {                      # Global config object [Optional]
    "common": [               # Common assets block (accessible via "$.common" across config)
      "styles/bootstrap.min.css",
      "styles/main.scss"
    ]
  },
  "app": {                    # Application config object [Optional] 
    "views": "views",         # Templates directory [Optional, default: "views"]
    "build": "build",         # Build directory [Optional, default: "build"]
    "assets": "assets",       # Assets source directory [Optional, default: "assets"]
    "static": "static"        # Static files directory [Optional, default: "static"]
  },
  "routes": {                 # A list of web-boost application routes [Required]
    "/": {                    # Route slug [Required]
      "view": "index.twig",   # View to render (relative to "app.views") [Required]
      "vars": {               # View variables [Optional, default: {}]
        "name": "John",       
        "age": "26"           # Example: "<p>{{ age }}-Year-Old {{ name }} liked our repo ;)</p>"
      },
      "assets": {             # Route specific assets [Optional, default: {}]
        "js/index.min.js": [  # Assets destination file (relative to "app.public")
          "$.common",         # Common assets block == ["styles/bootstrap.min.css", "styles/main.scss"]
          "js/index.js"
        ],
        "css/index.min.css": [
          "styles/main.scss", # styles/main.scss + styles/index.scss => css/index.min.css
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
