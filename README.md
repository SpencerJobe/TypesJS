# TypesJS
TypesJS is an optional runtime type checking system for JavaScript.


## Easy to "install"
```html
<!DOCTYPE html>
  <head>
    <script src="types.js"></script>
  </head>
  ...
```

## Easy to use
There are simple Base Types that can be used by themselves or combined to make more complex types.

```javascript

var test = "Hello world";

types.check(test,TString,true); // Passes

var TMessage = {
  message : TString,
  count : TNumber
};

var msg1 = { message : "hello world", count : 4 };
var msg2 = { message : "hello again", count : "4" };

types.check(msg1,TMessage,true); // Passes
types.check(msg2,TMessage,true); // Fails 

```
## TypesJS Functions
TypesJS provides helper functions to check JavaScript's base types. There are also two funchtions designed to help with checking custom types and applying assertions at runtime.

| Function | Description |
|----|---|
| ``` types.isNull( value ) ``` | Returns true if value is null or undefined |
| ``` types.isNotNull( value ) ``` |  Returns true if value is Not null or undefined |
| ``` types.isAny( value ) ``` |  Always returns true.  |
| ``` types.isBoolean( value ) ``` |  Returns true if value is JavaScript Boolean |
| ``` types.isNumber( value ) ``` |  Returns true if value is JavaScript Number |
| ``` types.isString( value ) ``` |  Returns true if value is JavaScript String |
| ``` types.isObject( value ) ``` |  Returns true if value is JavaScript Object |
| ``` types.isArray( value ) ``` |  Returns true if value is JavaScript Array |
| ``` types.isFunction( value ) ``` |  Returns true if value is JavaScript Function |
| ``` types.isObjectProperty( object, propertyName ) ``` |  Returns true if property is attached to the object literal |
| ``` types.isPrototypeProperty( object, propertyName ) ``` |  Returns true if property is attached to the object's prototype |
| ``` types.check( value, type, [hardFail] ) ``` | Returns true if value matches the provided type. If the optional hardFail is set to true, then the check will throw an error if the value doesn't match type |

## Base Types
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
