## Extending Twig

In order to add custom functions/filters in `Twig` just create a `.js` file in your project and add your functions
in the following format:

```js
module.exports = {
  extendFilter: {
    backwords: (value) => value.split(' ').reverse().join(' ')
  },
  extendFunction: {
    repeat: (value, times) => {
      return new Array(times + 1).join(value);
    }
  }
};
```

> Examples are taken from [twig.js](https://github.com/twigjs/twig.js/wiki/Extending-twig.js)
