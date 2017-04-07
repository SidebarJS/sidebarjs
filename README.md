[![GitHub release](https://img.shields.io/github/release/SidebarJS/sidebarjs.svg)](https://github.com/SidebarJS/sidebarjs/releases)
[![npm](https://img.shields.io/npm/v/sidebarjs.svg)](https://www.npmjs.com/package/sidebarjs)
[![npm](https://img.shields.io/npm/dt/sidebarjs.svg)](https://www.npmjs.com/package/sidebarjs)

# SidebarJS
Create mobile sidebar/sidenav experiance in pure javascript.

```ssh
npm install sidebarjs --save
```

## Demo
*Open the demo on your device and try the touch gestures!*

* [CodePen](http://codepen.io/lorenzodianni/full/VaqZJL/)
* [RawGit](https://rawgit.com/SidebarJS/sidebarjs/master/demo/index.html)

## Installation
Classic
```html
<script src="your/path/sidebarjs.js"></script>
```

Require
```js
let SidebarJS = require('sidebarjs');
```

ES6
```js
import SidebarJS from 'sidebarjs';
```

## Options
| Option | Default | Type | Description |
| :----- | :------ | :--- | :---------- |
| `documentMinSwipeX` | 10 | Number | Minimum swipe in px required to trigger listener: open |
| `documentSwipeRange` | 40 | Number | Range in px where document is listening for gesture: open |
| `nativeSwipe` | true | Boolean | Open and close sidebar with swipe gestures |
| `nativeSwipeOpen` | true | Boolean | Enable/Disable open on swipe
| `position` | 'left' | String | Sidebar position, accepted values: left\right |

## Implementation - Superfast explanation
Insert **sidebarjs.min.css** and **sidebarjs.min.js** in your index.html file and create a tag (div, aside or what you prefer) with the attribute **[sidebarjs]**.
All contents you will write inside tag[sidebarjs] will be rendered inside the sidebar.
For open/close the sidebar, put wherever you want the **[sidebarjs-toggle]** attribute.
Then simply init it with **new SidebarJS()** and you are ready!
```html
<head>

  <link rel="stylesheet" href="sidebarjs.min.css">

</head>
<body>

  <div sidebarjs-toggle>Open/Close</div>

  <div sidebarjs>
    <div sidebarjs-toggle>Open/Close</div>
    <nav>
      <a href="link">Home</a>
      <a href="link">About</a>
      <a href="link">Contacts</a>
    </nav>
  </div>

  <script src="sidebarjs.min.js"></script>
  <script>
  // Init SidebarJS
  var sidebarjs = new SidebarJS();
  </script>

</body>
```

## Implementation - Explanation step by step
### Download files
Download and save all files
```ssh
$ npm install sidebarjs --save
```

Insert _sidebarjs.min.css_ and _sidebarjs.min.js_ in your index.html.

```html
<head>

  <link rel="stylesheet" href="your/path/sidebarjs.min.css">

</head>
<body>

  <script src="your/path/sidebarjs.min.js"></script>

</body>
```

### Create SidebarJS element
Write **[sidebarjs]** attribute inside a tag (div, aside, or whatever you want).
```html
<div sidebarjs>
  <div>Title</div>
  <nav>
    <a href="link">Home</a>
    <a href="link">About</a>
    <a href="link">Contacts</a>
  </nav>
</div>
```

### Trigger button
Do you need a trigger button for open/close SidebarJS? Just put **[sidebarjs-toggle]** attribute inside a tag and it's done!
```html
<div sidebarjs-toggle>Open/Close</div>
```

### Init
When you have files, [sidebarjs] and [sidebarjs-toggle] you can init your SidebarJS Module like:
```js
var sidebarjs = new SidebarJS()
```

### Full file example
```html
<head>

  <link rel="stylesheet" href="your/path/sidebarjs.min.css">

</head>
<body>

  <div sidebarjs-toggle>Open/Close</div>

  <div sidebarjs>
    <div>Title</div>
    <nav>
      <a href="link">Home</a>
      <a href="link">About</a>
      <a href="link">Contacts</a>
    </nav>
  </div>

  <script src="your/path/sidebarjs.min.js"></script>
  <script>
    // Init SidebarJS
    var sidebarjs = new SidebarJS();
  </script>

</body>
```
