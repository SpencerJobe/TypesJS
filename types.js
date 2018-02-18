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
        

        // Increments when the types.check /checkArgs is called, and decrements on completion. 
        // This is used to change functionality of the Advanced Types:
        // TArray TObjectProperty TPrototypeProperty and TGuard
        var RUNTIME_COUNTER_Testing = 0; 


        // returns true if types are currently being checked, false otherwise
        var checkInProgress = function () {

            return RUNTIME_COUNTER_Testing > 0;
        };


        // base function to return actual base type of javascript variable.
        var getType = function (value) {
            
            var stringType;
            
            if (value === undefined || value === null) { 
            
                return "undefined";
            }
            
            stringType = Object.prototype.toString.call(value);
            stringType = stringType.split(" ")[1];
            return stringType.substring(0,stringType.length-1).toLowerCase();
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

            // if null, but shouldn't be
            if (types.isNull(val)) {
            
                if (checker != TNull && checker != TAny) {
            
                    return false;
                }
            }

            //checker is a function, so we can test it.
            if (types.isFunction(checker)) {

                //is checker is PropertyChecker object or prototype?
                if (checker.__IsAdvancedChecker) {

                    return checker(target,name);
                }
                return checker(target[name]);
            }

            //checker is an object literal which needs further resolution
            if (types.isObject(checker)) {
            
                return checkWithObject(name,target,checker);
            }

            //Should never reach this point. So throw an error for funzies.
            throw new Error("types.js -[private] assertType(name,target,checker)");
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
           // return !types.isString(value) &&  (String(value).indexOf("function") === 0);

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


        types.check = function (target, targetType, optHardFail) {
        
            var checker;
            var valid = true;
            
            optHardFail = types.isNull(optHardFail) ? false : optHardFail;
            RUNTIME_COUNTER_Testing += 1;
    
            for(var name in targetType) {
          
                if (targetType.hasOwnProperty(name)) {
          
                    checker = targetType[name];
          
                    if(assertType(name,target,checker) == false) {
                       
                        setErrorLog(name,target,checker);
                        valid = false;
                    }
                }
            }
            RUNTIME_COUNTER_Testing -= 1;
    
            if (optHardFail && valid === false) {
    
                types.printErrors();
                throw new Error("Type Error, see console for details.");
            }
    
            return valid;
        };
    

        types.checkArgs = function (targetArgs,targetType,optHardFail) {
            
            var args = Array.prototype.slice.call(targetArgs);
            var target = {};
            var index = 0;
    
            for(var name in targetType) {
          
                if (targetType.hasOwnProperty(name)) {
                    
                    target[name] = args[index];
                }
    
                index += 1;
            }
            
            return types.check(target,targetType,optHardFail);
        };
    

        types.printErrors = function ( ) {
    
            for (var i = 0; i < errorLog.length; i += 1) {
            
                console.log(errorLog[i]);
            }
        };
    


    //END REGION: Public Facing Functions ---------------------------------------------------------------
    
    
    
    
    //REGION: Global Type Annotation Proxy Functions ----------------------------------------------------
        
        //Base Types

        win.TNull = function (value) {
            
            return types.isBoolean(value);
        };
        win.TNull.__TypeID = "TNull";


        win.TNotNull = function (value) {

            return types.isNotNull(value);
        };
        win.TNotNull.__TypeID = "TNotNull";


        win.TAny = function (value) {
            
            return types.isAny(value);
        };
        win.TAny.__TypeID = "TAny";


        win.TBoolean = function (value) {

            return types.isBoolean(value);
        };
        win.TBoolean.__TypeID = "TBoolean";


        win.TNumber = function (value) {
            
            return types.isNumber(value);
        };
        win.TNumber.__TypeID = "TNumber";


        win.TString = function (value) {

            return types.isString(value);
        };
        win.TString.__TypeID = "TString";


        win.TObject = function (value) {
            
            return types.isObject(value);
        };
        win.TObject.__TypeID = "TObject";


        win.TFunction = function (value) {

            return types.isFunction(value);
        };
        win.TFunction.__TypeID = "TFunction";



        //Advanced Types


        win.TArray = function (elemType) {

            if (checkInProgress()) {

                throw new Error("TArray types must be defined with an element type. " +
                                "Ex: TArray(TString). Use TArray(TAny) for a general array type.");
            }

            var TTypedArray = function (arr) {

                if (!types.isArray(arr)) {
                
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
        

        win.TUnion = function (/*arguments...*/) {

            if (checkInProgress()) {
            
                throw new Error("TUnion types must be defined with member" +
                                "types. Ex: TUnion(TString,TNumber)  but Not TUnion");
            }
            
            var typeList = Array.prototype.slice.call(arguments);
            var typeId = "";
            var TUnionChecker = function (val) {

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
            TUnionChecker.__TypeID = "TUnion(" + typeId + ")";
            
            return TUnionChecker;
        };


        win.TPrototypeProperty = function (propType) {

            if (checkInProgress()) {
                
                throw new Error("TPrototypeProperty must be used with a corresponding " +
                               "Type to check. Ex: TPrototypeProperty(TString) but " +
                               "NOT TPrototypeProperty. Use TPrototypeProperty(TAny) " + 
                               "for general use case.");
            
            } else if (!types.isObject(propType) && !types.isFunction(propType)) {

                throw new Error("TPrototypeProperty(propType:function|object) ERROR -> propType must be a function or an object.");
            }
            
            var TPropChecker = function (target,name) {
                    
                return types.isPrototypeProperty(target,name) && assertType(name,target,propType);
            };
            TPropChecker.__TypeID = "TPrototypeProperty(" + (propType.__TypeID || "<CustomType>") + ")";
            TPropChecker.__IsAdvancedChecker = true;

            return TPropChecker;
        };
        

        win.TObjectProperty = function (propType) {

            if (checkInProgress()) {
                
                throw new Error("TObjectProperty must be used with a corresponding " +
                               "Type to check. Ex: TObjectProperty(TString) but " +
                               "NOT TObjectProperty. Use TObjectProperty(TAny) " + 
                               "for general use case.");

            }  else if (!types.isObject(propType) && !types.isFunction(propType)) {

                throw new Error("TObjectProperty(propType:function|object) ERROR -> propType must be a function or an object.");
            }
            
            var TPropChecker = function (target,name) {
                    
                return types.isObjectProperty(target,name) && assertType(name,target,propType);
            };
            TPropChecker.__TypeID = "TObjectProperty(" + (propType.__TypeID || "<CustomType>") + ")";
            TPropChecker.__IsAdvancedChecker = true;

            return TPropChecker;
        };


        win.TGuard = function (rootType, guard) {
        
            if (checkInProgress()) {
                
                throw new Error("TGuard must be used with a corresponding Type to check and a " +
                               "guard function. Ex: TGuard(TNumber,function(v) { return v > 0; }) but " +
                               "NOT TGuard. Use TGuard(TAny,function(v){...}) for general use case. ");
            }

            if (!types.isObject(rootType) && !types.isFunction(rootType)) {

                throw new Error("TGuard(rootType:function|object, guard:function) ERROR -> rootType must be a function or an object.");
            }

            if (!types.isFunction(guard)) {

                throw new Error("TGuard(rootType:function|object, guard:function) ERROR -> guard must be a function.");
            }

            var TGuardChecker = function (target,name) {
                
                return assertType(name,target,rootType) && guard(target[name]);
            };
            TGuardChecker.__TypeID = "TGuard(" + (rootType.__TypeID || "<CustomType>") + ", " + String(guard) + ")";
            TGuardChecker.__IsAdvancedChecker = true;

            return TGuardChecker;
        };
        



    //END REGION: Global Type Annotation Proxy Functions ------------------------------------------------



    //Assign the internal reference back to the global reference.
    win.types = types;

}(window));