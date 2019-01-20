# Frequently asked questions

<details>
<summary>How do I get the route name from the template?</summary>

There is a build-in variable `routeName`, so you can just use it in your templates `{{ routeName }}`

</details>

<details>
<summary>Is @import supported in .scss/.sass files?</summary>

Yes, just provide a path related to "app.assets" directory. Ex: `@import './styles/variables';`

</details>

<details>
<summary>How to add custom functions or filters for twig?</summary>

Just add an additional `.js` file in your project and provide the path in `web-boost` config file.
See details [here](./templates.md)

</details>
