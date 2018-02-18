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

TypesJS add several functions to the global namespace. These function ast as type annotations for the type system provided by TypesJS. These annotations include all of the base, JavaScript types and a few additional advanced types. You can read more about them below. 

&nbsp;

&nbsp;

## Base Types
TypesJS add several functions to the global namespace. These functions act as type annotations for the base types in JavaScript. There are nine base type annotation functions and four advanced annotations. The base annotations are listed below. They are used with the `types.check` and `types.checkArgs` functions. The advanced annotations are described later on in this documentation under the "Advanced Types" section. You can also define your own custom types. See the Custom Types section below for more info. 

| Type | Description |
|---|---|
|**TAny**| any JavaScript value including null and undefined|
|**TNull**| represents both null and undefined|
|**TNotNull**| any value that is not null or undefined|
|**TBoolean**| any boolean value true or false |
|**TNumber**| any valid JavaScript number |
|**TString**| any valid JavaScript string |
|**TArray**| any valid JavaScript array |
|**TObject**| any valid JavaScript object |
|**TFunction**| any valid JavaScript function |

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

| Parameter | Type |  Description |
|---|---|---|
|`<value>`| _any_ | The variable or literal value you want to check. |

**_Information_**

Returns **true** if `<value>` is a JavaScript String

**_Examples_**

```javascript

  var a = "Hello world";
  var b = 42;

```

&nbsp;

&nbsp;


<!-- ===================================================================== -->
#
### `types.isObject( <value> )`

| Parameter | Type |  Description |
|---|---|---|
|`<value>`| _any_ | The variable or literal value you want to check. |

**_Information_**

Returns **true** if `<value>` is a JavaScript Object

**_Examples_**

```javascript

```

&nbsp;

&nbsp;


<!-- ===================================================================== -->
#
### `types.isArray( <value> )`

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
### `types.isObjectProperty( <object>, <propertyName>)`

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

## Custom Types
-Section under construction-



## Advanced Types
| Type | Description |
|---|---|
|**TUnion(T1,T2,...)**| a union of two or more types. This allows you to handle instances where more than one type is acceptable. |
|**TObjectProperty(T)**| checks that the provided type T is defined only on the object literal |
|**TPrototypeProperty(T)**| checks that the provided type T is defined only on the object's prototype |
|**TGuard(T,fn)**| checks the type T first, then passes value to provided guard function. Guards return true or false. False is considered to be a type failure. |


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
