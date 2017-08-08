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

## Libraries
[Angular | ng-sidebarjs](https://github.com/SidebarJS/ng-sidebarjs)

[AngularJS | angular-sidebarjs](https://github.com/SidebarJS/angular-sidebarjs)

## Import

Typescript
```js
import {SidebarElement, SidebarService} from 'sidebarjs';
```

ES6
```js
import {SidebarElement, SidebarService} from 'sidebarjs';
```

Require
```js
const {SidebarElement, SidebarService} = require('sidebarjs');
```

Classic
```html
<script src="your/path/sidebarjs.js"></script>
```

## Options
```js
const sidebarjs = new SidebarElement({
    component?: HTMLElement['sidebarjs'], // Sidebar DOM element
    documentMinSwipeX?: 10, // Minimum swipe in px required to trigger listener: open
    documentSwipeRange?: 40, // Range in px where document is listening for gesture: open
    nativeSwipe?: true, // Open and close sidebar with swipe gestures
    nativeSwipeOpen?: true, // Enable/Disable open on swipe
    position?: 'left', // Sidebar position, accepted values: left|right
})
```

## Single Sidebar
```html
<head>

  <link rel="stylesheet" href="sidebarjs.min.css">

</head>
<body>

  <div sidebarjs-toggle>Open/Close</div>

  <div sidebarjs>
    <nav>
      <a href="link">Home</a>
      <a href="link">About</a>
      <a href="link">Contacts</a>
    </nav>
  </div>

  <script src="sidebarjs.min.js"></script>
  <script>
  // Init SidebarJS
  var sidebarjs = new SidebarJS.SidebarElement();
  </script>

</body>
```

## Multiple Sidebars
```html
<head>

  <link rel="stylesheet" href="sidebarjs.min.css">

</head>
<body>

  <div sidebarjs-toggle="leftSidebarName">Open/Close Left Sidebar</div>
  <div sidebarjs-toggle="rightSidebarName">Open/Close Right Sidebar</div>

  <div sidebarjs="leftSidebarName">
    <nav>
      <a href="link">My</a>
      <a href="link">Left</a>
      <a href="link">Content</a>
    </nav>
  </div>

  <div sidebarjs="rightSidebarName">
    <nav>
      <a href="link">My</a>
      <a href="link">Right</a>
      <a href="link">Content</a>
    </nav>
  </div>

  <script src="sidebarjs.min.js"></script>
  <script>
  var leftSidebarjs = new SidebarJS.SidebarElement({
    component: document.querySelector('[sidebarjs="leftSidebarName"]'),
  });
  
  var rightSidebarjs = new SidebarJS.SidebarElement({
    component: document.querySelector('[sidebarjs="rightSidebarName"]'),
    position: 'right',
  });
  </script>

</body>
```

## Implementation step by step
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
const sidebarjs = new SidebarJS.SidebarElement()
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
    const sidebarjs = new SidebarJS.SidebarElement();
  </script>

</body>
```
