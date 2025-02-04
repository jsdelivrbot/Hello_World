Notes from Day 1 of the Frontend Maters live workshop 'Deep JavaScript Foundations' taught by Kyle Simpson
Slides and exercise files found here: https://github.com/FrontendMasters/workshops/blob/master/advanced-js-v2-live.md

Foundations of JS:
  1) Types and coercions
  2) Scope and closures system
  3) This and object prototype systems

## DAY 1

Computers are better at efficiently compiling code than we as humans will ever be. Rather than obsessing over the most efficient and instructive way to write, focus more on communicating what the code is supposed to accomplish. Be more declarative about your code: write code that describes what you want to happen.

It's not just the code you write that's important, the code you don't write is also important. Most languages don't properly communicate the

Syntactically JS appears to be related to C++ but actually more related to Scheme.

Types, Coercion
- Primitive Types - Set of intrinsic behaviors that we can expect given a particular value. In dynamic languages we focus on the value itself (rather than the variable) has a type.
- Natives - Added as a way to make JS more palatable for Java users.
- Coercion - Something we should embrace.
- Equality

## PRIMITIVE TYPES

Literals
  - Undefined
  - String
  - Number
  - Boolean
  - Object
  - Symbol - won't really talk about
  - Function - subtype of object
  - Null

```js
  typeof foo;                         // "undefined" - in this case var not really undefined, actually undeclared
  typeof "foo";                       // "string"
  typeof 123;                         // "number"
  typeof true;                        // "boolean"
  typeof { a:1 };                     // "object"
  typeof function() { alert(e); };    // "function"
  typeof null;                        // "object" --> what? this is a bug made permanent
```

### Quiz
```js
  var foo;
  typeof foo;                         // "undefined"

  var bar = typeof bar;
  bar;                                // "undefined"
  typeof bar;                         // "string"

  typeof typeof 2                     // "string"
```

Special Values
- NaN ("not a number")
- Infinity, -Infinity
- null
- undefined (void)
- +0, -0

NaN

```js
  var a = "a" / 2;
  a;                      // NaN
  typeof a;               // "number"
  isNaN(a);               // true
```

NaN with anything else is going to result in a NaN. NaN does not have the identity property meaning cannot be equal to itself. Must use isNaN to

```js
  isNaN("foo");           // true - a bug tries to convert to a number first, resulting in NaN. Use Number.isNaN instead

  if (!Number.isNan) {
    Number.isNaN = function isNaN (num) {
      return (
        typeof num == "number" && window.isNaN(num)
      );
    };
  }
```

or, more simply, test if value equal to itself (since as mentioned above NaN cannot equal NaN):

```js
  if (!Number.isNaN) {
    Number.isNaN = function isNaN(num) {
      return num != num;
    };
  }
```

Negative Zero
Multiplication or division are the only way to get a negative zero

```js
  var foo = 0 / -3;
  foo === -0;             // true
  foo === 0;              // true
  0 === -0;               // true
  (0/-3) === (0/3);       // true

  foo;                    // 0
```

No such thing as a negative number literal. Negative is an operator. JS tries to hide that -0 exists.
How do we test for -0? Divide into 1 to see whether it equals negative infinity:

```js
  function isNeg0(x) {
    return x === 0 && (1/x) === -Infinity;
  }

  isNeg0(0/-3);        // true
  inNeg0(0/3);         // false
```

ES6: Object.is() - Placement in object not ideal, but use for NaN and -0 testing

```js
  Object.is( "foo", NaN );    // false
  Object.is( NaN, NaN );      // true

  Object.is(0, -0);           // false
  Object.is(-0, -0);          // true
```

### Quiz

```js
  var baz = 2;
  typeof baz;             // "number"
  var baz;
  typeof baz;             // "number"
  baz = null;
  typeof baz;             // "object"

  baz = "baz" * 3;
  baz;                    // "NaN"
  typeof baz;             // "number"

  baz = 1 / 0;
  baz;                    // Infinity
  typeof baz;             // "number"
```

## NATIVES
- String
- Number
- Boolean
- Function
- Object
- Array
- RegEx
- Date
- Error

Not really types or objects. Can be used as constructors, but in most cases that is inappropriate. Natives are mostly called as functions, so they should generally be treated as functions.

### Quiz

```js
  var foo = new String("foo");
  foo;                                  // ???
  typeof foo;                           // "object"
  foo instanceof String;                // true
  foo instanceof string;                // false; ref error

  foo = String("foo");
  typeof foo;                           // "string"

  foo = new Number(37);
  typeof foo;                           // "object"
```

Array - use the literal form wherever possible:

```js
  var foo;
  foo = new Array(1,2,3);     // don't

  foo = [1,2,3];              // do

  foo = new Object();         // don't
  foo.a = 1;
  foo.b = 2;
  foo.c = 3;

  foo = { a:1, b:2, c:3 };    // do
```

If you set the length of the array, JS will create phantom slots for the non-existent values.
You will need to use the new constructor in certain cases, but whenever possible opt for the literal.

```js
  var foo;

  foo = new RegExp("a*b", "g");

  foo = /a*b/g;

  foo = new Date(); // no date literal
```

## COERCION

Abstract Operations:
ToString - Used to convert a value into a string value.

ToString on Special Values
- null      --> "null"
- undefined --> "undefined"
- true      --> "true"
- false     --> "false"
- 3.1415    --> "3.1415"
- 0         --> "0"
- -0        --> "0" // problematic

ToString on Arrays
- []                --> ""
- [1,2,3]           --> "1,2,3"
- [null,undefined]  --> ","
- [[[],[],[]],[]]   --> ",,,"
- [,,,,]            --> ",,,"

ToString on Objects
- {}    --> "[object Object]"
- {a:2} --> "[object Object]"

ToNumber - Used to convert a value into a number.
- ""      --> 0 // conflating an empty string to 0 is the key to all the crazy coercion issues
- "0"     --> 0
- "-0"    --> -0
- "  009" --> 0
- "3.14"  --> 3.14
- "0."    --> 0
- ".0"    --> 0
- "."     --> NaN
- "Oxaf"  --> 175

ToNumber on Booleans
- false     --> 0
- true      --> 1
- null      --> 0 // problematic
- undefined --> NaN

ToNumber(object) - When converting objects ToNumber first runs ToPrimitive (because

ToNumber can only run on a primitive.) It gets valueOf() the objects, if this is not a primitive, then runs toString().
- [""]        --> 0 // problematic
- ["0"]       --> 0
- ["-0"]      --> -0
- [null]      --> 0 // problematic
- [undefined] --> 0 // problematic
- [1,2,3]     --> NaN
- [[[[]]]]    --> 0 // problematic

ToBoolean - Used to convert a value into a string value.
  Make a determination based solely on whether a value is falsy ("", 0, +0, -0, null, NaN, false, undefined) or truthy (everything else). Only apply if the ToBoolean operation is legitimately invoked, meaning sometimes it seems like it is being applied when it is in fact not.

Explicit and Implicit Coercion

Typically it's natural to think of explicit as good, implicit is bad. This is not true. There are good and bad parts to both types of coercion.

Explicit: It's obvious from the code that you're doing it.

string --> number

```js
  var foo = "123";

  var baz = parseInt(foo, 10);
  baz;                            // 123

  // Parse is not really coercion. Pulls out integers stopping at first non-integer, coercion is all or nothing.

  baz = Number(foo);              // coerces to the primitive number type - RECOMMENDED
  baz;                            // 123

  baz = +foo;                     // unary plus operator, does the same thing as Number function
  baz;                            // 123

  // Is the unary plus operator really explicit? Many people are not familiar with how this works.

number --> string
  baz = 456;

  foo = baz.toString();           // Calling a method against a primitive value - boxing
  foo;                            // "456"

  foo = String(baz);              // very clear and explicit - RECOMMENDED
  foo;                            // "456"

* --> boolean
  var foo = "123";

  var baz = Boolean(foo);         // very clear and explicit - RECOMMENDED
  baz;                            // true

  baz = !!foo;                    // two separate operators: first ! produces boolean and flips it, second flips it back
  baz;                            // true

  // !! is the most common method, but could be confusing

  baz = foo ? true : false;       // explicitly implicit
  baz;                            // true
```

Date
```js
  var now = +new Date();    // now = Date.now(); - ES5 only
```

Search for substring of a string
Typically, not found returns -1. Another option:
```js
  var foo = "foo";
  if (~foo.indexOf("f")) {
    alert("Found it!");
  }
```

  ~ is the mathematical equivalent of adding 1 to something and negating it.

More information on coercions:
  http://davidwalsh.name/fixing-coercion
  http://getify.github.io/coercions-grid/

Implicit: Happens as a side-effect of some other operation.
string --> number
```js
  var foo = "123";

  var baz = foo - 0;    // - operator can only do math on numbers, so runs ToNumber on foo
  baz;                  // 123

  baz = foo - "0";      // both foo and "0" are coerced to numbers
  baz;                  // 123

  baz = foo / 1;
  baz;                  // 123

number --> string
  baz = foo 456;

  foo = baz + "";       // + is overloaded - if one or more is a string prefer string concatenation
  baz;                  // "456"

  foo = baz - "";
  baz;                  // 456
```

* --> boolean
```js
  var foo = "123";
  if (foo) {
    alert("Sure.");         // yup
  }

  foo = 0;
  if (foo) {
    alert("Right.");        // nope
  }
  if (foo == false) {       // makes false into 0 rather than 0 into false because it prefers to compare #s
    alert("Yeah.");         // yup
  }

  var baz = foo || "foo";   // more like selector operands, boolean check against foo and selects one of them
  baz;                      // "foo"

  var foo = "123";
  if (foo == true) {        // "123" is truthy but != to true, because == coerces both to numbers: 123 and 1
    alert("WAT!?");         // nope
  }
```

  Don't ever compare with == true or == false. Will only work as a happy accident.

```js
  foo = [];
  if (foo) {              // empty array is truthy
    alert("Sure.");       // yup
  }
  if (foo == false) {     // again, does a numeric coercion rather than a boolean
    alert("WAT!?");
  }
```

Double Equals Coercive Equality
Seven problematic == edge cases:
  1) "0" == false;  // true - easy to ignore if never use == false
  2) false == 0;    // true - easy to ignore if never use == false
  3) false == "";   // true - easy to ignore if never use == false
  4) false == [];   // true - easy to ignore if never use == false
  5) "" == 0;       // true
  6) "" == [];      // true - unlikely to be used
  7) 0 == [];       // true - unlikely to be used

Before using == ask yourself:
  1) Can either value be true or false?
  2) Can either value ever be [], "", or 0?
If you don't know err on the side of caution

Primitive --> (Boxing and Unboxing)

```js
  var foo = "123";
  foo.length;                 // 3

  foo.charAt(2);              // "3"

  foo = new String("123");
  var baz = foo + "";
  typeof baz;                 // "string"
```

Common (mis-)understanding of == vs. ===
  == checks the value
  === checks the value and the Types

Actual difference
  == allows coercion
  === disallows coercion

Null and undefined are coercively equivalent to each other and no other value.

```js
  var foo = [];
  var baz = "";
  if (foo == baz) {
    alert("Doh!");        // yup
  }
  if (foo === baz) {
    alert("Phew.");       // nope
  }

  foo = 0;
  if (foo == "") {
    alert("Argh!");       // yup
  }

  var foo = "3";
  if (foo === 3 || foo === "3") {
    alert("Thanks, but...");        // yup
  }

  if (foo == 3) {                   // yup
    alert("That's nicer!");
  }

  var foo;
  if (foo == null) {
    alert("Thanks!");               // yup
  }

  foo = null;
  if (foo == null) {
    alert("Thanks, again!");        // yup
  }

  foo = false;
  if (foo == null) {
    alert("Phew!");                 // nope
  }
```

Performance of == or ===?
  == will be slower under certain circumstances
  Will do exactly the same thing if the types are the same

```js
    var x = 2;
    var y = 2;
    var z = "2";

    x == y;
    x == z;   // slower

    x === y;
    x === z;  // same
```

## SCOPE, CLOSURES
  - Nested Scope
  - Hoisting - metaphor for how the complier works
  - Closure - "most important concept in all computing"
  - Modules - "most important pattern in all of JS"

Scope - Set of rule by which we know where to look for things (variables).

Contrary to common belief, JS is a complied language not an interpreted language. JS does two passes of the code. First pass compiles and validates the code. During this pass lexical scope is set.

JS has a function scope only

```js
  var foo = "bar";

  function bar() {
    var foo = "baz";
  }

  function baz (foo) {
    foo = "bam";
    ban = "yay";
  }
```
