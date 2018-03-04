# web-boost application

### App structure

```text
app/                          # Root of your application
├─ assets/                    # Source directory for all assets
│  ├─ img/                    # Image folder
│  ├─ fonts/                  # Fonts folder
│  ├─ index.js
│  └─ index.scss
├─ views/                     # Templates directory
│  ├─ index.twig
│  └─ layout.twig
├─ public/                    # Destination directory for compiled/minimized assets 
├─ web-boost.json             # Web-boost configuration file
└─ package.json
```
> Image folder is **always** `img` (**not** `imgs`, `images` etc.) which is relative to "app.assets" (supported `.jpg` and `.png`)

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
    "assets": "assets"        # Assets source directory [Optional, default: "assets"]
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
