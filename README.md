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

var TYourThing = {
  message : TString,
  count : TNumber
};

var thing1 = {
  message : "This is the message",
  count : 45
};

var thing2 = {
  message : "this is a message",
  count : "45" //<-- not a number
};

//passes
types.check(thing1,TYourThing,true);

//fails
types.check(thing2,TYourThing,true);

```
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
Guards are functions that you write to further check a value. Guards can be added directly to all base types as seen in Example 1 below. Custom types can be wrapped using TGuard as seen in Example 2 below. 
### Example 1 ###
```javascript

//x must be positive and y must be negative
var TPoint = {
  x : TNumber(function (v) { return v > 0; }),
  y : TNumber(function (v) { return v < 0; })
}
```
## Example 2 ##
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

//Passes
types.check(thing1,TYourThing,true);

//fails because count is less than 10
types.check(thing1,TYourGuardedThing,true);
```
