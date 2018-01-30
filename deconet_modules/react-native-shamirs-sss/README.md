<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [React Native Shamir's Secret Sharing Module](#react-native-shamirs-secret-sharing-module)
- [Installation](#installation)
  - [Link the dependencies into your project via NPM](#link-the-dependencies-into-your-project-via-npm)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# React Native Shamir's Secret Sharing Module

This module can split a secret into n-of-m parts.  Learn more here: https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing

Note that this module depends on https://github.com/mvayngrib/react-native-crypto so you should follow those installation instructions as well.

# Installation

```sh
deconet get react-native-shamirs-sss
```

## Link the dependencies into your project via NPM


```sh
npm i --save deconet_modules/react-native-shamirs-sss

```

```js
import RNSSSS from 'react-native-shamirs-sss'
```

# Usage

To split into 4 parts with 2 required to recover the secret:

```js
let secret = 'd94527908e99bcff99bf7106f16d2490cf60e692'
let s = new RNSSSS()
let shares = s.share(secret, 4, 2)
console.log(shares)
// console output: 
[ '801e67cef502048d33b350e37d98827b9651ba6491b9c',
  '802d28e0cc9ed1f0daf76aab23c0740d8a69b1d32018e',
  '803352ba6be5dd94728bc3d3a9489960ce710741bfc80',
  '804ba77d7e66ab1ac9af0ffa5eb048e1a3d8676c435aa' ]
```


To combine:

```js
let shares = [
  '802d28e0cc9ed1f0daf76aab23c0740d8a69b1d32018e',
  '803352ba6be5dd94728bc3d3a9489960ce710741bfc80'
]
let s = new RNSSSS()
let combined = s.combineShares(shares)
console.log(combined)
// console output:
d94527908e99bcff99bf7106f16d2490cf60e692
```