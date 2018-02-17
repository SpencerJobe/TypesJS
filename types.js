/*---------------------------------------------------------------------------------------------------------
     MODULE: types.js 
    VERSION: 0.1a
     AUTHOR: Spencer A. Jobe
  COPYRIGHT: 2018
DESCRIPTION: Adds type checking functions and proxy-annotations that can be
             used in JavaScript while program is running.

--BEGIN LICENSE--

    TypesJS (types.js)
    Copyright 2018 Spencer A. Jobe

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
    associated documentation files (the "Software"), to deal in the Software without restriction, 
    including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
    and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
    subject to the following conditions:

        The above copyright notice and this permission notice shall be included in 
        all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
    LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

--END LICENSE--

---------------------------------------------------------------------------------------------------------*/
(function loadModule_types(win) {
    
    // internal reference to types 'module'
    var types = win.types || {};




    //REGION: Legacy Polyfills ---------------------------------------------------------------------------

        
        
        //BEGIN POLYFILL: Object.getPrototypeOf -------------------------------------------
            
            // source https://johnresig.com/blog/objectgetprototypeof/
            if (typeof Object.getPrototypeOf !== "function") {

                if (typeof "test".__proto__ === "object") {
                
                    Object.getPrototypeOf = function (object) {
                        
                        return object.__proto__;
                    };

                } else {
                
                    Object.getPrototypeOf = function (object) {
                        // May break if the constructor has been tampered with
                        return object.constructor.prototype;
                    };
                }
            }
        //END POLYFILL: Object.getPrototypeOf ----------------------------------------------



    //END REGION: Legacy Polyfills -----------------------------------------------------------------------




    //REGION: Internal to Module -------------------------------------------------------------------------



        // stores all the type error information. array is reset after 
        // each call to types.check / checkArgs
        var errorLog = []; 
        

        // Flips on when the types.check /checkArgs is called, and turns 
        // off on completion. Flag is used in the base types TNumber, 
        // TBoolean, ... etc to check if they are being used in a 
        // definition or are being used as a type-check.
        var RUNTIME_FLAG_isTesting = false; 


        // base function to return actual base type of javascript variable.
        var getType = function (value) {
            
            var stringType, type;
            
            if (value === undefined || value === null) { 
            
                return "undefined";
            }
            
            stringType = Object.prototype.toString.call(value);
            type = stringType.split(" ")[1];
            return type.substring(0,type.length-1).toLowerCase();
        };
    

        // attaches a slim prototype to target if its not already there.
        var createDebugObjectDisplay = function (target) {

            var display = Object.create(null);
            var proto = Object.getPrototypeOf(target);
           
            for (var name in target) {
           
                if (target.hasOwnProperty(name)) {
           
                    display[name] = target[name];
                }
            }
           
            for (var name in proto) {
           
                if (proto.hasOwnProperty(name)) {
           
                    if (types.isNull(display.__proto__)) {
           
                        display.__proto__ = Object.create(null);
                    }
                    display.__proto__[name] = proto[name];
                }
            }

            return display;
        };

        
        // sets the error text based on the args provided by types.test
        // when a value fails a test. 
        var setErrorLog = function (name, target, checker) {
            
            var debugTarget = createDebugObjectDisplay(target);

            errorLog = [
                "",
                "***************************************************",
                "Type Error",
                "",
                "[Objects/Arguments]",
                debugTarget,
                "",
                "",
                "",
                "***************************************************",
                ""
            ];
            
            if (checker.hasOwnProperty("__TypeID")) {
        
                errorLog[7] = "[ERROR]: Expected '" + name + "' to be of type " + checker.__TypeID;
            } else {

                errorLog[7] = "[ERROR]: Expected '" + name + " to match the custom type below";
                errorLog[8] = checker;
            }
        };


        // checks a target against a user-defined object literal of types
        var checkWithObject = function (name, target, obj) {
        
            var val = target[name];
        
            for(var propName in obj) {
        
                if (obj.hasOwnProperty(propName)) {
        
                    checker = obj[propName];
        
                    if(!assertType(propName,val,checker)) {
        
                        return false;
                    }
                }
            }
        
            return true;
        };

        // tests value of target[name] using the checker (EX: TNumber ... etc);
        var assertType = function(name, target, checker) {
            
            var val;

            // named property is not a member of the target object or the target.prototype
            if (!target.hasOwnProperty(name) && ! Object.getPrototypeOf(target).hasOwnProperty(name)) {
                return false;
            }

            val = target[name];

            // if undefined, but shouldn't be
            if (getType(val) == "undefined") {
            
                if (checker != TNull && checker != TAny) {
            
                    return false;
                }
            }

            //checker is a function, so we can test it.
            if (getType(checker) === "function") {

                //is checker is PropertyChecker object or prototype?
                if (checker.__IsPropertyChecker) {
                    return checker(target,name);
                }
                return checker(target[name]);
            }

            //checker is an object literal which needs further resolution
            if (getType(checker) === "object") {
            
                return checkWithObject(name,target,checker);
            }

            //Should never reach this point. So throw an error for funzies.
            throw new Error("types.js -[private] assertType(name,target,checker)");
        };


        // creates a type checker with or without a guard based on provided type and func
        var createChecker = function (TName,func) {
            
            var TBaseCheck = types["is" + TName.substring(1)];
            
            var checker = function (value) {
        
                return TBaseCheck(value);
            };
            checker.__TypeID = TName;

            if (types.isFunction(func)) {
            
                checker = function ( value ) {
                    
                    return TBaseCheck(value) && func(value);
                };
                checker.__TypeID = TName + "{Guarded}";
            }
            
            return checker;
        };
        

        // creates a wrapper around a type checker to enforce the ownership of the 
        // property itself, either the object literal or the object's prototype.
        var createPropertyOwnerChecker = function (TName, baseChecker) {

            var TBaseCheck = types["is" + TName.substring(1)];
            
            var checker = function (target,name) {
        
                return TBaseCheck(target,name);
            };
            checker.__TypeID = TName;
            
            if (types.isFunction(baseChecker)) {
            
                checker = function (target, name) {
                    
                    return TBaseCheck(target,name) && baseChecker(target[name]);
                };
                checker.__TypeID = TName + "(" + baseChecker.__TypeID + ")";
            }
            
            checker.__IsPropertyChecker = true;
            return checker;
        };


        //creates a typed array checker. used in TArray function 
        var createTypedArrayType = function (elemType) {
        
            var TTypedArray = function (arr) {

                if (getType(arr) !== "array") {
                
                    return false;
                }
        
                for(var i = 0; i < arr.length; i += 1) {
                
                    if ( !elemType(arr[i]) ) {   
                
                        return false;
                    }
                }
                return true;
            };
            
            if (types.isFunction(elemType)) {
            
                TTypedArray.__TypeID = "TArray(" + elemType.__TypeID + ")";
            
            } else if (types.isObject(elemType)) {
            
                TTypedArray.__TypeID = "TArray(<CustomType>)";
            }
            
            return TTypedArray;
        };



    //END REGION: Internal to Module  -------------------------------------------------------------------




    //REGION: Public Facing Functions -------------------------------------------------------------------



        types.isNull = function (value) { 

            return getType(value) === "undefined";
        };
        

        types.isNotNull = function (value) { 

            return getType(value) !== "undefined";
        };
        

        types.isAny = function (value) {

            return true;
        };
        

        types.isBoolean = function (value) {

            return getType(value) === "boolean";
        };
        

        types.isNumber = function (value) {

            return getType(value) === "number";
        };


        types.isString = function (value) {

            return getType(value) === "string";
        };


        types.isObject = function (value) {

            return getType(value) === "object";
        };
        

        types.isArray = function (value) {

            return getType(value) === "array";
        };


        types.isFunction = function (value) {

            return getType(value) === "function";
        };


        types.isPrototypeProperty = function (target,name) {
            
            if (types.isNull(target)) {
            
                throw new Error("types.isPrototypeProperty(target:Object,name:String): ERROR -> target is null.");
            }

            if (!types.isString(name)) {

                throw new Error("types.isPrototypeProperty(target:Object,name:String): ERROR -> name is not a string.");
            }

            return  Object.getPrototypeOf(target).hasOwnProperty(name) && (target.hasOwnProperty(name) === false);
        };


        types.isObjectProperty = function (target, name) {
            
            if (types.isNull(target)) {
            
                throw new Error("types.isObjectProperty(target:Object,name:String): ERROR -> target is null.");
            }

            if (!types.isString(name)) {

                throw new Error("types.isObjectProperty(target:Object,name:String): ERROR -> name is not a string.");
            }

            return target.hasOwnProperty(name) && (  Object.getPrototypeOf(target).hasOwnProperty(name) === false);
        };


        types.check = function (target, type, optHardFail) {
        
            var checker;
            var valid = true;
            
            optHardFail = types.isNull(optHardFail) ? false : optHardFail;
            RUNTIME_FLAG_isTesting = true;
    
            for(var name in type) {
          
                if (type.hasOwnProperty(name)) {
          
                    checker = type[name];
          
                    if(assertType(name,target,checker) == false) {
                       
                        setErrorLog(name,target,checker);
                        valid = false;
                    }
                }
            }
            RUNTIME_FLAG_isTesting = false;
    
            if (optHardFail && valid === false) {
    
                types.printErrors();
                throw new Error("Type Error, see console for details.");
            }
    
            return valid;
        };
    

        types.checkArgs = function (targetArgs,type,optHardFail) {
            
            var args = Array.prototype.slice.call(targetArgs);
            var target = {};
            var index = 0;
    
            for(var name in type) {
          
                if (type.hasOwnProperty(name)) {
                    
                    target[name] = args[index];
                }
    
                index += 1;
            }
            
            return types.check(target,type,optHardFail);
        };
    

        types.printErrors = function ( ) {
    
            for (var i = 0; i < errorLog.length; i += 1) {
            
                console.log(errorLog[i]);
            }
        };
    


    //END REGION: Public Facing Functions ---------------------------------------------------------------
    
    
    
    
    //REGION: Global Type Annotation Proxy Functions ----------------------------------------------------
        


        win.TNull = function (value) {
            
            return RUNTIME_FLAG_isTesting ?
                types.isBoolean(value) : createChecker("TNull",value);
        };
        win.TNull.__TypeID = "TNull";


        win.TNotNull = function (value) {

            return RUNTIME_FLAG_isTesting ?
                types.isNotNull(value) :  createChecker("TNotNull",value);
        };
        win.TNotNull.__TypeID = "TNotNull";


        win.TAny = function (value) {
            
            return RUNTIME_FLAG_isTesting ?
                types.isAny(value) : createChecker("TAny",value);
        };
        win.TAny.__TypeID = "TAny";


        win.TBoolean = function (value) {

            return RUNTIME_FLAG_isTesting ?
                types.isBoolean(value) : createChecker("TBoolean",value);
        };
        win.TBoolean.__TypeID = "TBoolean";


        win.TNumber = function (value) {
            
            return RUNTIME_FLAG_isTesting ?
                types.isNumber(value) : createChecker("TNumber",value);
        };
        win.TNumber.__TypeID = "TNumber";


        win.TString = function (value) {

            return RUNTIME_FLAG_isTesting ?
                types.isString(value) : createChecker("TString",value);
        };
        win.TString.__TypeID = "TString";


        win.TObject = function (value) {
            
            return RUNTIME_FLAG_isTesting ?
                types.isObject(value) : createChecker("TObject",value);
        };
        win.TObject.__TypeID = "TObject";


        win.TFunction = function (value) {

            return RUNTIME_FLAG_isTesting ?
                types.isFunction(value) : createChecker("TFunction",value);
        };
        win.TFunction.__TypeID = "TFunction";


        win.TArray = function (value) {

            return RUNTIME_FLAG_isTesting ?
                types.isArray(value) : createTypedArrayType(value);
        }
        win.TArray.__TypeID = "TArray(TAny)";


        win.TUnion = function () {
            if (RUNTIME_FLAG_isTesting) {
                throw new Error("TUnion types must be defined with member types. Ex: TUnion(TString,TNumber)  but Not TUnion");
            }
            
            var typeList = Array.prototype.slice.call(arguments);
            var typeId = "";

            var TypedUnion = function (val) {
                for(var i = 0; i < typeList.length; i += 1) {
                    if (typeList[i](val)) {
                        return true;
                    }
                }
                return false;
            };

            for (var i = 0; i < typeList.length; i += 1) {
                typeId += "," + (typeList[i].__TypeID || "<CustomType>");
            }

            typeId = typeId.substring(1);
            TypedUnion.__TypeID = "TUnion(" + typeId + ")";
            
            return TypedUnion;
        };


        win.TPrototypeProperty = function (target,name) {

            return RUNTIME_FLAG_isTesting ? 
                types.isPrototypeProperty(target,name) :
                createPropertyOwnerChecker("TPrototypeProperty",target);
        };
        win.TPrototypeProperty.__TypeID = "TPrototypeProperty";


        win.TObjectProperty = function (target,name) {

            return RUNTIME_FLAG_isTesting ?
                types.isObjectProperty(target,name) :
                createPropertyOwnerChecker("TObjectProperty",target);
        };
        win.TObjectProperty.__TypeID = "TObjectProperty";



    //END REGION: Global Type Annotation Proxy Functions ------------------------------------------------



    //Assign the internal reference back to the global reference.
    win.types = types;

}(window));