### `THIS DOCUMENT IS UNDER CONSTRUCTION `

<!-- ********************************************************************************************************* -->
---
# TypesJS 

TypesJS is a runtime type checking system for JavaScript. You put the types where you want them, when you what them.

#### Table of Contents
- [Overview](#overview)
- [Types](#types)
- [TypesJS Functions](#typesjs-functions)
- [Simple Examples](#simple-examples)
- [Advanced Examples](#advanced-examples)
  
---
&nbsp;

&nbsp;

# Overview
[Back to Table of Contents](#typesjs)
- [Install](#install)
- [Usage](#usage)


## Install
```html
<!DOCTYPE html>
  <head>
    <script src="types.min.js"></script>
  </head>
  ...
```

&nbsp;

## Usage
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

TypesJS add several functions to the global namespace. These function _act_ as type annotations for the type system provided by TypesJS. These annotations include all of the base, JavaScript types and a few additional advanced types. You can read more about them below. 

&nbsp;

&nbsp;

## Base Types
[Back to Types](#types)

There are 10 base-type annotation functions. They represent the base types in JavaScript. They are used with the `types.check` to check the type of a given value. See the Custom Types section for details on creating your own types. The example below shows how you would use a base type to check the type of a value. For more examples check out the Examples section of this documentation.

| Type | Description |
|---|---|
|**`TAny`**| any JavaScript value including null and undefined|
|**`TNull`**| represents both null and undefined|
|**`TNotNull`**| any value that is not null or undefined|
|**`TBoolean`**| any boolean value true or false |
|**`TNumber`**| any valid JavaScript number |
|**`TString`**| any valid JavaScript string |
|**`TArray`**| any valid JavaScript array |
|**`TObject`**| any valid JavaScript object |
|**`TFunction`**| any valid JavaScript function |
|**`TSymbol`**| any vaild JavaScript symbol |

**_Simple Example_**
```javascript

var a = "hello world";

//Passes
types.check(a,TString,true);

//Fails
types.check(a,TNumber,true);

```

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

TGuard is a special advanced-annotation that wraps around a base or custom type. It allows you to assign an assertion function to your type annotation. When a value is tested with a guard, it is first tested against the provide type `T`. If it _is_ of type `T` then the value is passed to the guard function `fn`. If _this_ function returns **true**, the value is considered to be a valid, guarded, type `T`. If the function returns **false**, then the value is considered invalid. 

```javascript
  var TPoint = {
    x: TGuard(TNumber, function (x) {
      return x >= 0;
    },
    y: TNumber,
  };

  var p1 = { x:4, y:4 };
  var p2 = ( x:-100, y:4 };

  
  // Passes - p1 matches TPoint, and p1.x >= 0
  types.check(p1,TPoint,true);
 
  // Fails - although p2 matches TPoint, it fails the guard, p2.x < 0
  types.check(p2,TPoint,true);
 

```

---

&nbsp;

&nbsp;

<!-- ********************************************************************************************************* -->
# TypesJS Functions
TypesJS provides helper functions to check JavaScript's base types. There are also two functions designed to help with checking custom types and applying assertions at runtime.

[Back to Table of Contents](#typesjs)
- [`types.check(<value>,<type>,[hardfail])`](#typescheck-value-type-hardfail-)
- [`types.checkArgs(<arguments>,<type>,[hardfail])`](#typescheckargs-arguments-type-hardfail-)
- [`types.isNull(<value>)`](#typesisnull-value-)
- [`types.isNotNull(<value>)`](#typesisnotnull-value-)
- [`types.isAny(<value>)`](#typesisany-value-)
- [`types.isBoolean(<value>)`](#typesisboolean-value-)
- [`types.isNumber(<value>)`](#typesisnumber-value-)
- [`types.isString(<value>)`](#typesisstring-value-)
- [`types.isArray(<value>)`](#typesisarray-value-)
- [`types.isObject(<value>)`](#typesisobject-value-)
- [`types.isFunction(<value>)`](#typesisfunction-value-)
- [`types.isSymbol(<value>)`](#typesissymbol-value-)
- [`types.isObjectProperty( <object>, <propertyName>)`](#typesisobjectproperty-object-propertyname)
- [`types.isPrototypeProperty( <object>, <propertyName>)`](#typesisprototypeproperty-object-propertyname)

&nbsp;

&nbsp;

<!-- ===================================================================== -->
#
### `types.check( <value>, <type>, [hardFail] )`
[Back to Function List](#typesjs-functions)

| Parameter | Type |  Description |
|---|---|---|
|`<value>`| _any_ | The variable or literal value you want to check. |
|`<type>` | _function_\|_object_ | The TypesJS annotation function, or your own custom Type object |
|`[hardFail]`| _boolean_ | **OPTIONAL** If true, then the function will throw an error if `<value>` does not match `<type>` |

**_Information_** 

Returns true if value matches the provided type. If the optional hardFail is set to true, then the check will throw an error if the value doesn't match type.

**_Examples_** 

```javascript
var test = "hello world";

types.check(test,TString,true); //Passes, test is a string

types.check(test,TNumber,true); //Fails, test is not a number
```

&nbsp;

&nbsp;

<!-- ===================================================================== -->
#
### `types.checkArgs( <arguments>, <type>, [hardFail] )`
[Back to Function List](#typesjs-functions)

| Parameter | Type |  Description |
|---|---|---|
|`<arguments>`| JavaScript's **_arguments_** | This must be the **`arguments`** variable.  |
|`<type>` | _function_\|_object_ | The TypesJS annotation function, or your own custom Type object |
|`[hardFail]`| _boolean_ | **OPTIONAL** If true, then the function will throw an error if `<value>` does not match `<type>` |


**_Information_** 

Returns **true** if the provided arguments match the provide type. Otherwise it returns **false** If the optional `[hardFail]` is set to **true**, then checkArgs will throw an error if the arguments don't match the type. This function should be used inside a function to check the values passed to it. The `<arguments>` parameter should always be JavaScript's **`arguments`** variable as seen in the example below. 

Furthermore, the `<type>` parameter should be defined as an object literal who's properties correspond to the expected types of the arguments passed to the containing function.

**_Examples_** 

```javascript

  var IAdd = {
    a : TNumber,
    b : TNumber
  };
  
  function add(a,b) {
    types.checkArgs(arguments,IAdd,true);
    
    return a + b;
  }

  add(1,1); //Passes
  
  add(1,"1"); //Fails
```

&nbsp;

&nbsp;

<!-- ===================================================================== -->
#
### `types.isNull( <value> )`
[Back to Function List](#typesjs-functions)

| Parameter | Type |  Description |
|---|---|---|
|`<value>`| _any_ | The variable or literal value you want to check. |

**_Information_**

Returns **true** if `<value>` is null or undefined. Otherwise it returns **false**.

**_Examples_**
```javascript

  var a = null;
  var b = undefined;
  var c = 42;
  
  //Returns true
  types.isNull(a);
  
  //Returns true
  types.isNull(b);
  
  //Returns false
  types.isNull(c);

```

&nbsp;

&nbsp;

<!-- ===================================================================== -->
#
### `types.isNotNull( <value> )`
[Back to Function List](#typesjs-functions)

| Parameter | Type |  Description |
|---|---|---|
|`<value>`| _any_ | The variable or literal value you want to check. |

**_Information_**

Returns **true** if `<value>` is **NOT** null or undefined. Otherwise it returns **false**.

**_Examples_**
```javascript

  var a = null;
  var b = undefined;
  var c = 42;
  
  //Returns false
  types.isNull(a);
  
  //Returns false
  types.isNull(b);
  
  //Returns true
  types.isNull(c);

```

&nbsp;

&nbsp;

<!-- ===================================================================== -->
#
### `types.isAny( <value> )`
[Back to Function List](#typesjs-functions)

| Parameter | Type |  Description |
|---|---|---|
|`<value>`| _any_ | The variable or literal value you want to check. |

**_Information_**

Always returns true. [More Info](https://en.wikipedia.org/wiki/Philosophy)

**_Examples_**
```javascript

  var a = null;
  var b = undefined;
  var c = 42;
  
  //Returns true
  types.isNull(a);
  
  //Returns true
  types.isNull(b);
  
  //Returns true
  types.isNull(c);

```

&nbsp;

&nbsp;

<!-- ===================================================================== -->
#
### `types.isBoolean( <value> )`
[Back to Function List](#typesjs-functions)

| Parameter | Type |  Description |
|---|---|---|
|`<value>`| _any_ | The variable or literal value you want to check. |

**_Information_**

Returns **true** if `<value>` is JavaScript Boolean.

**_Examples_**
```javascript

  var a = true;
  var b = false;
  var c = 1;
  var d = "true";
  
  // Returns true
  types.isBoolean(a);
  
  // Returns true
  types.isBoolean(b);
  
  // Returns false
  types.isBoolean(c);
  
  // Returns false
  types.isBoolean(d);

```

&nbsp;

&nbsp;

<!-- ===================================================================== -->
#
### `types.isNumber( <value> )`
[Back to Function List](#typesjs-functions)

| Parameter | Type |  Description |
|---|---|---|
|`<value>`| _any_ | The variable or literal value you want to check. |

**_Information_**

Returns **true** if `<value>` is a JavaScript Number

**_Examples_**

```javascript

  types.isNumber(25); // true
  types.isNumber(-123); // true
  
  types.isNumber("0"); // false
  types.isNumber("foo"); // false
  
  types.isNumber(Infinity); // true
  types.isNumber("Infinity"); // false
  types.isNumber(NaN); // false;
  
  types.isNumber(null); // false
  types.isNumber(undefined); // false
  
  var a = { x:21, y: 32 };
  types.isNumber(a); // false;

```

&nbsp;

&nbsp;

<!-- ===================================================================== -->
#
### `types.isString( <value> )`
[Back to Function List](#typesjs-functions)

| Parameter | Type |  Description |
|---|---|---|
|`<value>`| _any_ | The variable or literal value you want to check. |

**_Information_**

Returns **true** if `<value>` is a JavaScript String

**_Examples_**

```javascript

  var a = "Hello world";
  var b = "";
  var c = 42;
  var d = true;
  
  
  types.isString(a); // true
  
  types.isString(b); // true
  
  types.isString(c); // false

  types.isString(d); // false

```

&nbsp;

&nbsp;


<!-- ===================================================================== -->
#
### `types.isObject( <value> )`
[Back to Function List](#typesjs-functions)

| Parameter | Type |  Description |
|---|---|---|
|`<value>`| _any_ | The variable or literal value you want to check. |

**_Information_**

Returns **true** if `<value>` is a JavaScript Object

**_Examples_**

```javascript

  const MySymbol = Symbol("test");
  
  var a = { x:3, y:4 };
  var b = { };
  var c = Object.create(null);
  var d = [1,2,3];
  var fn = function (a,b) {
    return a + b;
  };
  
  types.isObject(a); // true
  types.isObject(b); // true
  types.isObject(c); // true
  types.isObject(d); // false
  types.isObject(fn); // false
  
  types.isObject(window); // true 
  types.isObject(document.body); // true

  types.isObject(MySymbol); // false
  
```

&nbsp;

&nbsp;


<!-- ===================================================================== -->
#
### `types.isArray( <value> )`
[Back to Function List](#typesjs-functions)

| Parameter | Type |  Description |
|---|---|---|
|`<value>`| _any_ | The variable or literal value you want to check. |

**_Information_**

Returns **true** if `<value>` is a JavaScript Array

**_Examples_**

```javascript

```

&nbsp;

&nbsp;


<!-- ===================================================================== -->
#
### `types.isFunction( <value> )`
[Back to Function List](#typesjs-functions)

| Parameter | Type |  Description |
|---|---|---|
|`<value>`| _any_ | The variable or literal value you want to check. |

**_Information_**

Returns **true** if `<value>` is a  JavaScript Function

**_Examples_**

```javascript

```

&nbsp;

&nbsp;

<!-- ===================================================================== -->
#
### `types.isSymbol( <value> )`
[Back to Function List](#typesjs-functions)

| Parameter | Type |  Description |
|---|---|---|
|`<value>`| _any_ | The variable or literal value you want to check. |

**_Information_**

Returns **true** if `<value>` is a  JavaScript Symbol

**_Examples_**

```javascript

  const a = Symbol();
  const b = Symbol(42);
  const c = Symbol("test");
  const d = "hello world";
  const e = 43;
  
  types.isSymbol(a); // true
  types.isSymbol(b); // true
  types.isSymbol(c); // true
  
  types.isSymbol(d); // false
  types.isSymbol(e); // false

```

&nbsp;

&nbsp;
<!-- ===================================================================== -->
#
### `types.isObjectProperty( <object>, <propertyName>)`
[Back to Function List](#typesjs-functions)

| Parameter | Type |  Description |
|---|---|---|
|`<object>`| _object_ | The object you're checking. |
|`<propertyName>`| _string_ | The name of the property on the object |

**_Information_**

Returns **true** if `<propertyName>` is a property on the object literal `<object>` and **NOT** present on the `<object>.prototype`.

**_Examples_**

```javascript

```

&nbsp;

&nbsp;


<!-- ===================================================================== -->
#
### `types.isPrototypeProperty( <object> , <propertyName> )`
[Back to Function List](#typesjs-functions)

| Parameter | Type |  Description |
|---|---|---|
|`<object>`| _object_ | The object you're checking. |
|`<propertyName>`| _string_ | The name of the property on the object |

Returns **true** if `<propertyName>` is a property on the `<object>.prototype` and **NOT** present on the object literal `<object>`

**_Examples_**

```javascript

```

&nbsp;

&nbsp;


---

<!-- ********************************************************************************************************************* -->
## Custom Types
-Section under construction-


<!-- ********************************************************************************************************************* -->



## Guards - (Runtime Assertions)
Guards are functions that you write to further check a value. Guards can be wrapped around Base Types and Custom Types as seen in examples below. 
### Base Type with Guard
```javascript

//x must be positive and y must be negative
var TPoint = {
  x : TGuard(TNumber,function (v) { return v > 0; }),
  y : TGuard(TNumber,function (v) { return v < 0; })
}

var p1 = { x:10, y:-10 };
var p2 = { x:-1, y:1 };

//Passes, x is positive, y is negative
types.check(p1,TPoint,true);

//Fails, x is negative, y is positive
types.check(p2,TPoint,true);

```
### Custom Type with Guard 
```javascript

var TYourThing = {
  message : TString,
  count : TNumber
};

var YourGuard = function (t) {
  if (t.count < 10) {
    console.log("count cannot be less than 10");
    return false;
  }
  return true;
};

var TYourGuardedThing = TGuard(TYourThing, YourGuard);


var thing1 = {
  message: "hello world",
  count : 4
};

//Passes, thing1 matches type, and no guard is used.
types.check(thing1,TYourThing,true);

//Fails, thing1 matched the type, but it's count is less than 10 which fails the gaurd.
types.check(thing1,TYourGuardedThing,true);
```
