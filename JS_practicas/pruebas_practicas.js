
//Practica 1
const celsius=prompot("Ingrese los celsius: ")
const fahrenheit = celsius * 9/5 +32
console.log (celsius + "° son "+fahrenheit+ "°F" )

//Practica 2
2. Calculadora de propina
Simula que tenés una cuenta de un restaurante y queres calcular la propina. Declarar una variable monto, 
pedirle al usuario que ingrese un valor y calcular la propina del 10%.
Mostrá un mensaje como: "El total es $100. La propina sugerida es $10"

const monto = Number(prompt("¿Cuál es el monto de la cuenta?"));
const propina = monto * 0.1;
console.log(`El total es $${monto}. La propina sugerida es $${propina}`);

3. Predicción de operaciones
Predecí y explicá el resultado de cada expresión. Luego ejecuta el código en la consola y compara con tu predicción.

console.log(10 + "190"); // ? 200 numero
console.log("8" * "4"); // ? NaN
console.log(true + false); // ? undefined
console.log(null + 1); // ? 1
console.log(undefined + 1); // ? 1
Pistas: Pensá en la coerción de tipos y cómo JavaScript maneja las operaciones entre diferentes tipos de datos.

4. Validador de ingreso a un club secreto
Pedile al usuario su edad y si conoce la "palabra clave".
Solo puede ingresar si:
Tiene 21 años o más
Y escribió exactamente "snorlax" como palabra clave
Mostrá un mensaje acorde:

const edad = Number(prompt("¿Cuál es tu edad?"));
const clave = prompt("Decí la palabra clave:");
if(edad >= 21 && clave === "snorlax"){
    console.log("Puede pasar")
}else{console.log("No puede pasar")}

// tu código acá
5. Simulador de sueldo con bonus y retenciones
Pedile al usuario:

Su sueldo base (prompt)
Si tiene bonus (sí o no)
Si tiene hijos (sí o no)
Lógica:

Si tiene bonus, sumá un 10% al sueldo.
Si tiene hijos, restá un 5% por aporte familiar.
Luego, aplicá un 15% de retención final al total.
Mostrá el sueldo neto con un mensaje como: Tu sueldo final es $38.250

const sueldo = prompt("Sueldo base: ");
const bonus = prompt("Tiene bonus sino:").toLowerCase();
const hijos = prompt("Tiene hijos sino: ").toLowerCase();
let sueldoFinal=sueldo
if(bonus === "si"){
    sueldoFinal = sueldoFinal * 1.10;
}
if(hijos==="si"){
        let resta = sueldo * 0.5
        sueldoFinal = sueldoFinal - resta;
    }
    resta = sueldo * 1.15
sueldoFinal = sueldoFinal - resta;