1️⃣ What is the difference between var, let, and const?
--> In terms of scope- var only maintain function scope, where let and const care both block and function scopes.
--> In terms of hoisting- var, let and const all are hoisted, but var return undefined, where let and const stay in TDZ(Temporal Dead Zone) and trow an error. The TDZ end after the value assignment of into the variable.
--> In terms of usability- var can re-declared and re-assigned also, let can re-assign value, but cannot re-declared, where cons is only once can declare.
2️⃣ What is the spread operator (...)?
--> The spread operator spread or peak elements of an array or object.We use spread operator to avoid mutation
3️⃣ What is the difference between map(), filter(), and forEach()?
--> map() is use to transform the elements of an array into new array.
--> filter() is use to filter the true elements form the array. It always ignore the false value. when meet condition it keeps elements into a new array.
-->forEach() is use to conduct loop over array elements. it does not return a new array. The result of forEach is not direcly executed, it works as side effect.
4️⃣ What is an arrow function?
--> An arrow function is a modern javaScript syntax. It is a function expression that's why it is partially hoisted.The syntax is: const function = ()=>{}
5️⃣ What are template literals?
--> Template literals also a modern javaScript syntax. It reduces code and make more cleaner. The syntax is ` `(backticks)
