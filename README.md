buClassCallback
===============

AngularJS directive ngClass-like with callbacks

This directive is like embedded ng-class one but invokes a callback after animation with a class is done, which ng-class can not make.

Usage is 
```
<div class="my-class" bu-class-callback="{'animate': {on: somethingHappened, after: 'doSomething()'}}"></div>
```
