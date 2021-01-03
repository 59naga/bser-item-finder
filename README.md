Eternal Return: Black Survival Item Finder
---

<p align="right">
  <a href="https://npmjs.org/package/bser-item-finder">
    <img src="https://img.shields.io/npm/v/bser-item-finder.svg?style=flat-square">
  </a>
  <a href="https://codeclimate.com/github/59naga/bser-item-finder/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/3ca8c3b81941d456f10a/maintainability" />
  </a>
</p>

An *unofficial* synchronous item search library using information from [gamepedia](https://eternalreturn.gamepedia.com/).

Installation
---

```bash
yarn add bser-item-finder
yarn add esm

node -r esm
```

```js
import finder from "bser-item-finder";
console.log(finder.version) // 0.1.0
```

or directly transpile and use. (experimental)

```vue
<template>
  <div>
    <pre>{{ finder.version }}</pre>
  </div>
</template>

<script>
import finder from "@/node_modules/bser-item-finder";

export default {
  data() {
    return { finder };
  }
};
</script>
```

API
---
- TODO(Current state is dogfooding, as we continue to make breaking changes to the API, we will not update the documentation.)

License
---
MIT