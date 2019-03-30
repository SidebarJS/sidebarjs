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
* [Angular | ng-sidebarjs](https://github.com/SidebarJS/ng-sidebarjs)
* [AngularJS | angular-sidebarjs](https://github.com/SidebarJS/angular-sidebarjs)

## Import

Typescript / ES6
```js
import {SidebarElement, SidebarService} from 'sidebarjs';
import 'sidebarjs/lib/sidebarjs.css';
```

Classic
```html
<script src="your/path/sidebarjs.js"></script>
<link rel="stylesheet" href="your/path/sidebarjs.css">
```

## Options
```typescript
const sidebarjs = new SidebarJS.SidebarElement({
    // Sidebar DOM element
    component?: <HTMLElement>sidebarjs,
    
    // Minimum swipe in px required to trigger listener: open
    documentMinSwipeX?: 10,
    
    // Range in px where document is listening for gesture: open
    documentSwipeRange?: 40,
    
    // Open and close sidebar with swipe gestures
    nativeSwipe?: true,
    
    // Enable/Disable open on swipe
    nativeSwipeOpen?: true,
    
    // Sidebar position, accepted values: left|right
    position?: 'left',
    
    // Backdrop opacity on sidebar open
    backdropOpacity?: 0.3,
    
    // Show sidebar on screen > 1024px
    responsive?: false,
    
    // Page content if sidebar has option responsive
    mainContent?: <HTMLElement>
    
    // Function called after sidebar is open
    onOpen?: () => void,
    
    // Function called after sidebar is close
    onClose?: () => void,
    
    // Function called when sidebar change visibility
    onChangeVisibility?: (changes: { isVisible: boolean }) => void,
})
```

## Instance methods
### .open(): void
> Open sidebar
```typescript
const sidebarjs = new SidebarJS.SidebarElement();
sidebarjs.open();
```

### .close(): void
> Close sidebar
```typescript
const sidebarjs = new SidebarJS.SidebarElement();
sidebarjs.open();
setTimeout(() => {
  sidebarjs.close();
}, 3000);
```

### .toggle(): void
> Toggle sidebar
```typescript
const sidebarjs = new SidebarJS.SidebarElement();
sidebarjs.toggle();
```

### .isVisible(): boolean
> Check if sidebar is visible
```typescript
const sidebarjs = new SidebarJS.SidebarElement();
sidebarjs.isVisible(); // false
sidebarjs.open();
sidebarjs.isVisible(); // true
```

### .destroy(): void
> Destroy sidebar and all listeners
```typescript
const sidebarjs = new SidebarJS.SidebarElement();
sidebarjs.destroy();
```

### .setPosition(position: 'left'|'right'): void
> Set sidebar position
```typescript
const sidebarjs = new SidebarJS.SidebarElement();
sidebarjs.setPosition('right'); // sidebar move to the right side
```

### .setSwipeGestures(value: boolean): void
> Check nativeSwipe and nativeSwipeOpen props and enable/disable gestures only if prop is true
```typescript
const sidebarjs = new SidebarJS.SidebarElement({
  nativeSwipe: true,
  nativeSwipeOpen: false,
});
sidebarjs.setSwipeGestures(false); // disable only nativeSwipe listeners
sidebarjs.nativeSwipeOpen = true;
sidebarjs.setSwipeGestures(true); // enable nativeSwipe and nativeSwipeOpen listeners
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

## Responsive Sidebar
```html
<head>

  <link rel="stylesheet" href="sidebarjs.min.css">

</head>
<body>

  <div sidebarjs>
    <nav>
      <a href="link">Home</a>
      <a href="link">About</a>
      <a href="link">Contacts</a>
    </nav>
  </div>
  
  <div sidebarjs-content>
    your content
    <div sidebarjs-toggle>Open/Close</div>
  </div>

  <script src="sidebarjs.min.js"></script>
  <script>
  // Init SidebarJS
  var sidebarjs = new SidebarJS.SidebarElement({responsive: true});
  </script>

</body>
```

## Trigger onOpen/onClose/onChangeVisibility
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
  var sidebarjs = new SidebarJS.SidebarElement({
    onOpen: function() {
      console.log('sidebarjs is open');
    },
    onClose: function() {
      console.log('sidebarjs is close');
    },
    onChangeVisibility: function(changes) {
      console.log('sidebarjs is visible?', changes.isVisible);
    }
  });
  </script>

</body>
```

## Destroy Sidebar
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
  
  // After 4 seconds
  setTimeout(function() {
    
    // Destroy sidebarjs
    sidebarjs.destroy();
    
  }, 4000);
  </script>

</body>
```