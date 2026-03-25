1. Calculadora de daño
Creá una función calcularDanio(ataque, defensa, critico) que reciba:

ataque: poder del atacante
defensa: defensa del rival (se resta al ataque para calcular el resultado)
critico: booleano que duplica el daño si es true
Si el resultado es menor a 0, debe devolver 0.
const calcularDanio = (ataque,defensa,critico)=>{
    if (critico === true) {
       ataque = ataque*2

    }
    if (ataque > defensa) {
        let danio = ataque - defensa

        return danio
    }else{
        return 0
    }
}

calcularDanio(50, 30, true) // → 70
2. Evolución de Pokémon
Creá una función puedeEvolucionar(nombre, nivel) que reciba el nombre del Pokémon y su nivel.

Reglas de evolución:

Si es "Charmander" y nivel ≥ 16 → "Charmander evolucionó a Charmeleon"
Si es "Bulbasaur" y nivel ≥ 15 → "Bulbasaur evolucionó a Ivysaur"
Si es "Squirtle" y nivel ≥ 18 → "Squirtle evolucionó a Wartortle"
En otro caso → "Todavía no puede evolucionar"

puedeEvolucionar = (nombre,nivel) => {

            if (nombre === "Squirtle" && nivel >= 18) {
                console.log("Squirtle evolucionó a Wartortle")
            }else if(nombre === "Charmander" && nivel >= 16)
            {
               console.log("Charmander evolucionó a Charmeleon")
            }else if(nombre === "Bulbasur" && nivel >= 15)
                console.log ( "Bulbasaur evolucionó a Ivysaur")
                else{
                    console.log("Todavía no puede evolucionar")
                }

}
puedeEvolucionar("Charmander",25)
3. Batalla Pokémon
Creá una función batalla(atacante, defensor, ataque, poder, defensa, critico) que use las función calcularDanio del ejercicio 1.

La función debe mostrar:

El mensaje del ataque. Ver formato en el ejemplo
Si el enemigo quedó derrotado (si el daño fue ≥ 50) o sigue en pie.


// Resultado esperado:
// ¡Pikachu usó Impactrueno contra Meowth! Causó 50 de daño.
// ¡Meowth ha sido derrotado!

const batalla = (atacante, defensor, ataque, poder, defensa, critico) =>{
    let resultadoDanio = calcularDanio(poder,defensa,critico)

    if (resultadoDanio != 0) {
        console.log(`${atacante} uso ${ataque} contra ${defensor} causo ${resultadoDanio} de daño`)
    }
    else{
        console.log (`El ataque fue bloqueado`)
    }
    if(resultadoDanio >= 50){
        console.log(`${defensor} ha sido derrotado`)
    }
}
batalla("Pikachu", "Meowth", "Impactrueno", 70, 20, false);