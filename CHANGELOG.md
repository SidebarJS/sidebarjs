# [7.0.0](https://github.com/SidebarJS/sidebarjs/compare/5.4.0...7.0.0) (2020-12-07)


### Features

* add transition-start|end classes to detect open/close actions via DOM | close [#14](https://github.com/SidebarJS/sidebarjs/issues/14) ([0b3a33c](https://github.com/SidebarJS/sidebarjs/commit/0b3a33c323670ba7e70f6b31c3f155afde9cf9c9))
* **eslint:** move from tslint to eslint ([082c579](https://github.com/SidebarJS/sidebarjs/commit/082c579ab8bffd5373f7796aad47e205ca945e13))
* **npm:** update all dependencies ([25ad50e](https://github.com/SidebarJS/sidebarjs/commit/25ad50e280ca331f47fcec10513d71a8123cc0dd))


### Performance Improvements

* bundle size ([2d916ba](https://github.com/SidebarJS/sidebarjs/commit/2d916babf140ecc0b5390a8b122e3656e79a4d91))



# [5.4.0](https://github.com/SidebarJS/sidebarjs/compare/5.3.0...5.4.0) (2018-11-30)


### Features

* **SidebarElement:** setSwipeGestures [#13](https://github.com/SidebarJS/sidebarjs/issues/13) ([2f37fab](https://github.com/SidebarJS/sidebarjs/commit/2f37fab7f650a7edc33f8837f3c4c23bb4e4109b))



# [5.3.0](https://github.com/SidebarJS/sidebarjs/compare/5.2.1...5.3.0) (2018-09-03)



## [5.2.1](https://github.com/SidebarJS/sidebarjs/compare/5.2.0...5.2.1) (2018-05-31)


### Bug Fixes

* **SidebarElement:** prevent close sidebar on opposite swipe gesture | [#9](https://github.com/SidebarJS/sidebarjs/issues/9) ([4a7a1d1](https://github.com/SidebarJS/sidebarjs/commit/4a7a1d115b5ddbd81e6e3a371f0fca52cdd968d2))


### Performance Improvements

* **SidebarElement:** use CSSOM when available | [#11](https://github.com/SidebarJS/sidebarjs/issues/11) ([6efb7e5](https://github.com/SidebarJS/sidebarjs/commit/6efb7e5acee839332d59e7ed7de0d1c0cb697b53))



# [5.2.0](https://github.com/SidebarJS/sidebarjs/compare/5.1.0...5.2.0) (2018-04-14)


### Features

* **SidebarElement:** responsive option ([3dc8d15](https://github.com/SidebarJS/sidebarjs/commit/3dc8d15f7a546b939410fb6e93e73e6d5a8178f4))



# [5.1.0](https://github.com/SidebarJS/sidebarjs/compare/5.0.0...5.1.0) (2018-03-07)


### Bug Fixes

* **SidebarElement:** correct trigger documentMinSwipeX on open ([a820765](https://github.com/SidebarJS/sidebarjs/commit/a8207650a92cfa16f6ff02e6f37f0e332ca90266))



# [5.0.0](https://github.com/SidebarJS/sidebarjs/compare/4.1.0...5.0.0) (2018-02-11)


### Bug Fixes

* **sidebarElement:** destroy method ([5bcd2b4](https://github.com/SidebarJS/sidebarjs/commit/5bcd2b4a1a8d6164ac2a7f42c618ef86182f9486))
* **sidebarElement:** destroy method ([a207f38](https://github.com/SidebarJS/sidebarjs/commit/a207f38b043b1b37ae67daa63ceb3ea32830b58e))
* **sidebarElement:** transclude ([75998f0](https://github.com/SidebarJS/sidebarjs/commit/75998f00a62d5cb760c5696c5be1f4be2ad1c175))
* **SidebarElement:** remove unnecessary will-change prop ([e4b2b62](https://github.com/SidebarJS/sidebarjs/commit/e4b2b62440b4f52fe3b0b07fb8311420d7c6ca60))


### Features

* **SidebarElement:** emit onOpen/onClose/onChangeVisibility when sidebar transition end ([4ffd5b9](https://github.com/SidebarJS/sidebarjs/commit/4ffd5b9a3714a7eae5dbd6bcc5d449e64c582c57))
* **SidebarElement:** implemented onOpen/onClose/onChangeVisibility in dist ([866fbdc](https://github.com/SidebarJS/sidebarjs/commit/866fbdcd6d0b7ca689a4bd448231864f1efbacfc))


### Performance Improvements

* **sidebarElement:** component will-change ([78030ea](https://github.com/SidebarJS/sidebarjs/commit/78030ea24bd84f1206ea88b01ed3f1fee045120f))
* **sidebarElement:** drop support IE9 ([19f9984](https://github.com/SidebarJS/sidebarjs/commit/19f998477f71cde194824e5ce4dc4c050b93edb8))
* **sidebarElement:** no more detached DOM nodes ([28061b2](https://github.com/SidebarJS/sidebarjs/commit/28061b2ac8c02a741d8cffdec2719c3a1f59cbf8))
* **SidebarElement:** __onTouchMove / __onSwipeOpenMove ([7ff77e2](https://github.com/SidebarJS/sidebarjs/commit/7ff77e282daaefe9977252063f63dbf2a4eceb76))



# [4.1.0](https://github.com/SidebarJS/sidebarjs/compare/4.0.0...4.1.0) (2018-02-05)


### Performance Improvements

* **sidebarElement:** passive listeners + will change ([ded4d67](https://github.com/SidebarJS/sidebarjs/commit/ded4d67aa222ad4f99868260ded3259750462699))



# [4.0.0](https://github.com/SidebarJS/sidebarjs/compare/3.2.0...4.0.0) (2018-01-13)


### Features

* **idebarElement:** configurable background opacity ([00a0673](https://github.com/SidebarJS/sidebarjs/commit/00a0673bd77dff2a608c98db30bcb1e794b0b121))


### Performance Improvements

* **css:** transition: all > transform ([cf81e1a](https://github.com/SidebarJS/sidebarjs/commit/cf81e1af4f7d9101d47a6a32505ed2a5ae2c13a7))



# [3.2.0](https://github.com/SidebarJS/sidebarjs/compare/3.1.0...3.2.0) (2017-11-16)


### Features

* **definition:** no more version prop in SidebarElement ([f515fcc](https://github.com/SidebarJS/sidebarjs/commit/f515fccd1983802632f8980c072ec5b6a5c295ff))



# [3.1.0](https://github.com/SidebarJS/sidebarjs/compare/3.0.0...3.1.0) (2017-09-04)


### Bug Fixes

* **ts:** create method in definition file ([dae2869](https://github.com/SidebarJS/sidebarjs/commit/dae28696877589fe8e4aa7be71e613c230d8ec8d))



# [3.0.0](https://github.com/SidebarJS/sidebarjs/compare/2.2.0...3.0.0) (2017-08-08)


### Bug Fixes

* **d.ts:** public methods/properties ([b8fb83b](https://github.com/SidebarJS/sidebarjs/commit/b8fb83bcbbc587c198272f3ecb152e864786b7c7))



# [2.2.0](https://github.com/SidebarJS/sidebarjs/compare/2.1.0...2.2.0) (2017-07-07)


### Bug Fixes

* **d.ts:** correct definition file ([f678a0e](https://github.com/SidebarJS/sidebarjs/commit/f678a0e3cb23f45284bc1241e07cd93894d39096))



# [2.1.0](https://github.com/SidebarJS/sidebarjs/compare/2.0.1...2.1.0) (2017-05-15)


### Bug Fixes

* **module:** export ([cfd5211](https://github.com/SidebarJS/sidebarjs/commit/cfd5211742dba8b1fc7d5e281b5b548ac8fdcab0))



## [2.0.1](https://github.com/SidebarJS/sidebarjs/compare/2.0.0...2.0.1) (2017-05-01)


### Bug Fixes

* **export:** removed export default ([db3c928](https://github.com/SidebarJS/sidebarjs/commit/db3c928fb2cdc95e9de99203727348726500ea1b))



# [2.0.0](https://github.com/SidebarJS/sidebarjs/compare/1.10.1...2.0.0) (2017-04-16)



## [1.10.1](https://github.com/SidebarJS/sidebarjs/compare/1.10.0...1.10.1) (2017-04-16)


### Bug Fixes

* **shadow:** shadow for right position sidebar ([dde4802](https://github.com/SidebarJS/sidebarjs/commit/dde480274ba9f82e9007b20e20d8a021afd1522d))


### Features

* **multiple:** multiple sidebar at the same time ([4d676f0](https://github.com/SidebarJS/sidebarjs/commit/4d676f09b36f09eb38060d40d1e09506629dc1cc))



# [1.10.0](https://github.com/SidebarJS/sidebarjs/compare/1.9.0...1.10.0) (2017-04-10)


### Bug Fixes

* **onSwipeOpen:** fixed mirror effect ([f30dad8](https://github.com/SidebarJS/sidebarjs/commit/f30dad8404686b8d0628502acd5649b6dfc336ef))


### Features

* **position:** Right position implemented. Closed issue: [#2](https://github.com/SidebarJS/sidebarjs/issues/2) ([d908968](https://github.com/SidebarJS/sidebarjs/commit/d908968a16f5ca9ba11115a5d28ea55b72b30d59))



# [1.9.0](https://github.com/SidebarJS/sidebarjs/compare/1.8.0...1.9.0) (2017-04-04)


### Bug Fixes

* **version:** mismatch from package.json and js file ([fc8115f](https://github.com/SidebarJS/sidebarjs/commit/fc8115f180b971ca1018b753f52425cbfc9ab92d))



# [1.8.0](https://github.com/SidebarJS/sidebarjs/compare/1.7.1...1.8.0) (2017-03-15)


### Features

* **options:** nativeSwipe option | nativeSwipeOpen option ([eabeecd](https://github.com/SidebarJS/sidebarjs/commit/eabeecddd22bc1ee764da432374d2e8ce6a9c82f))



## [1.7.1](https://github.com/SidebarJS/sidebarjs/compare/1.7.0...1.7.1) (2017-03-07)



# [1.7.0](https://github.com/SidebarJS/sidebarjs/compare/1.6.1...1.7.0) (2017-02-19)


### Features

* **swipe:** open sidebar on swipe right ([749d1bc](https://github.com/SidebarJS/sidebarjs/commit/749d1bcbcff0d34eb2ca6ba72dbcc0a1b8213c50))



## [1.6.1](https://github.com/SidebarJS/sidebarjs/compare/1.6.0...1.6.1) (2016-09-30)



# [1.6.0](https://github.com/SidebarJS/sidebarjs/compare/1.5.0...1.6.0) (2016-09-30)



# [1.5.0](https://github.com/SidebarJS/sidebarjs/compare/1.2.0...1.5.0) (2016-09-25)



# [1.2.0](https://github.com/SidebarJS/sidebarjs/compare/1.1.6...1.2.0) (2016-09-21)



## [1.1.6](https://github.com/SidebarJS/sidebarjs/compare/1.1.5...1.1.6) (2016-06-02)



## [1.1.5](https://github.com/SidebarJS/sidebarjs/compare/1.1.0...1.1.5) (2016-05-09)



# [1.1.0](https://github.com/SidebarJS/sidebarjs/compare/1.0.2...1.1.0) (2016-05-09)



## [1.0.2](https://github.com/SidebarJS/sidebarjs/compare/1.0.1...1.0.2) (2016-05-03)



## [1.0.1](https://github.com/SidebarJS/sidebarjs/compare/1.0.0...1.0.1) (2016-05-03)



# 1.0.0 (2016-05-03)



