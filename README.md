### `THIS DOCUMENT IS UNDER CONSTRUCTION `

<!-- ********************************************************************************************************* -->
---
# TypesJS 

TypesJS is a runtime type checking system for JavaScript. You put the types where you want them, when you what them.

#### Table of Contents
- [Overview](#overview)
- [Types](#types)
- [TypesJS Functions](#typesjs-functions)
- [Examples](#examples)

  
---
&nbsp;

&nbsp;

# Overview
[Back to Table of Contents](#typesjs)
- [Install](#install)
- [Usage](#usage)


## Install
[Back to Overview](#overview)

```html
<!DOCTYPE html>
  <head>
    <script src="types.min.js"></script>
  </head>
  ...
```

&nbsp;

## Usage
[Back to Overview](#overview)

There are simple Base Types that can be used by themselves or combined to make more complex types.

```javascript

var test = "Hello world";

//Passes 
types.check(test,TString,true);

var TMessage = {
  message : TString,
  count : TNumber
};

var msg1 = {
  message : "hello world",
  count : 4
};

var msg2 = {
  message : "hello again",
  count : "4"
};

//Passes
types.check(msg1,TMessage,true);

//Fails
types.check(msg2,TMessage,true);

```
---
&nbsp;

&nbsp;



<!-- ********************************************************************************************************* -->
# Types
[Back to Table of Contents](#typesjs)
- [Base Types](#base-types)
- [Advanced Types](#advanced-types)

TypesJS add several functions to the global namespace. These function _act_ as type annotations for the type system provided by TypesJS. These annotations include all of the base types in JavaScript and a few additional advanced types. You can read more about them below. 

&nbsp;

&nbsp;

## Base Types
[Back to Types](#types)

There are 10 base-type annotation functions. They represent the base types in JavaScript. They are used with the `types.check` function to check the type of a given value. See the [Custom Types](#customtypes) section for details on creating your own types. Click on the type in the table below to view examples. 

| Type | Description | Link |
|---|---|---|
|[**`TAny`**](#tany)| any JavaScript value including null and undefined|
|[**`TNull`**](#tnull)| represents both null and undefined|
|[**`TNotNull`**](#tnotnull)| any value that is not null or undefined|
|[**`TBoolean`**](#tboolean)| any boolean value true or false |
|[**`TNumber`**](#tnumber)| any valid JavaScript number |
|[**`TString`**](#tstring)| any valid JavaScript string |
|[**`TArray`**](#tarray)| any valid JavaScript array |
|[**`TObject`**](#tobject)| any valid JavaScript object |
|[**`TFunction`**](#tfunction)| any valid JavaScript function |
|[**`TSymbol`**](#tsymbol)| any vaild JavaScript symbol |

#

### `TAny`
[Back to Base Types](#base-types)

TAny examples are comming soon...


&nbsp;

&nbsp;

### `TNull`
[Back to Base Types](#base-types)

TNull examples are coming soon

&nbsp;

&nbsp;

### `TNotNull`
[Back to Base Types](#base-types)

TNotNull examples are coming soon


&nbsp;

&nbsp;

### `TBoolean`
[Back to Base Types](#base-types)

TBoolean examples are coming soon

&nbsp;

&nbsp;

### `TNumber`
[Back to Base Types](#base-types)

TNumber examples are coming soon

&nbsp;

&nbsp;

### `TString`
[Back to Base Types](#base-types)

TString Examples coming soon

&nbsp;

&nbsp;

### `TArray`
[Back to Base Types](#base-types)

TArray Examples coming soon

&nbsp;

&nbsp;

### `TObject`
[Back to Base Types](#base-types)

TObject Examples coming soon

&nbsp;

&nbsp;

### `TFunction`
[Back to Base Types](#base-types)

TFunction Examples are coming soon.

&nbsp;

&nbsp;

### `TSymbol`
[Back to Base Types](#base-types)

TSymbol examples coming soon

&nbsp;

&nbsp;

&nbsp; 

&nbsp;

## Advanced Types
[Back to Types](#types)

There are four advanced annotation functions in TypesJS. These functions allow you to create more advanced types. These advanced options can be used with the base types provided by TypesJS as well as custom types you defined. Examples of these advanced annotation function are provided below. See Custom Types section for details on creating your own types. 

| Type | Description |
|---|---|
|[**`TUnion(T1,T2,...)`**](#tuniont1t2)| a union of two or more types. This allows you to handle instances where more than one type is acceptable. |
|[**`TObjectProperty(T)`**](#tobjectpropertyt)| checks that the provided type T is defined only on the object literal |
|[**`TPrototypeProperty(T)`**](#tprototypepropertyt)| checks that the provided type T is defined only on the object's prototype |
|[**`TGuard(T,fn)`**](#tguardtfn)| checks the type T first, then passes value to provided guard function. Guards return true or false. False is considered to be a type failure. |

#
### `TUnion(T1,T2,...)`
[Back to Advanced Types](#advanced-types)

The TUnion type allows you to create a union of more than one type. This is helpful when a valid value could be more than one type. A common example is when a value could be either a string or a number. 
```javascript
  
var a = "hello world";
var b = 42;
var c = document.createElement("p");

// Passes a is a string and TString is a member of the union type
types.check(a,TUnion(TString,TNumber), true);

// Passes b is a number and TNumber is a member of the union type
types.check(b,TUnion(TString,TNumber), true);

// Fails c is an object and TObject is NOT a member of the union type
types.check(b,TUnion(TString,TNumber), true);

```
You won't want to type `TUnion(TString,TNumber)` every time you need to check your union type. So, you can store it in a JavaScript variable instead. 
```javascript

var a = "hello world";
var b = 42;
var c = document.createElement("p");

var TStrumber = TUnion(TString,TNumber);

// Passes a is a string and TString is a member of the union type TStrumber
types.check(a,TStrumber, true);

// Passes b is a number and TNumber is a member of the union type TStrumber
types.check(b,TStrumber, true);

// Fails c is an object and TObject is NOT a member of the union type TStrumber
types.check(b,TStrumber, true);

```

&nbsp;

&nbsp;

#
### `TObjectProperty(T)`
[Back to Advanced Types](#advanced-types)

TObjectProperty is a special advanced-annotation that wraps around a base or custom type. It checks the make sure the property is located on the object literal and is NOT present on the prototype. 
```javascript
  var TPoint = {
    x: TNumber,
    y: TNumber,
    show: TObjectProperty(TFunction)
  }
  
  var Point = function (x, y) {
    this.x = x;
    this.y = y;
  };
  Point.prototype.show = function () {
    
    console.log(this.x + "," + this.y);
  };
  
  var p1 = new Point(4,4);
  
  //Fails because 'show' is located on the object's prototype
  types.check(p1,TPoint,true);
 

```

&nbsp;

&nbsp;

#
### `TPrototypeProperty(T)`
[Back to Advanced Types](#advanced-types)

TPrototypeProperty is a special advanced-annotation that wraps around a base or custom type. It checks the make sure the property is located on the object's prototype and is NOT present on the object itself. 
```javascript
  var TPoint = {
    x: TNumber,
    y: TNumber,
    show: TPrototypeProperty(TFunction)
  };
  
  var Point = function (x, y) {
    this.x = x;
    this.y = y;
  };
  Point.prototype.show = function () {
    
    console.log(this.x + "," + this.y);
  };
  
  var p1 = new Point(4,4);
  
  //passes because 'show' is located on the object's prototype
  types.check(p1,TPoint,true);
 
  var p2 = { 
    x: 3, 
    y: 6,
    show: function () {
      console.log("foo");
    }
  };
  
  //Fails because 'show' is located on the object itself
  types.check(p2,TPoint,true);

```

&nbsp;

&nbsp;

#
### `TGuard(T,fn)`
[Back to Advanced Types](#advanced-types)

TGuard is a special advanced-annotation that wraps around a base or custom type. It allows you to assign an assertion function to your type annotation. When a value is tested with a guard, it is first tested against the provide type `T`. If it _is_ of type `T` then the value i
