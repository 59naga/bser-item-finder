Eternal Return: Black Survival Item Finder
---
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