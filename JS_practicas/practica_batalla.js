const calcularDanio = (ataque, defensa, critico) => {
  if (critico === true) {
    ataque = ataque * 2;
    console.log("¡GOLPE CRÍTICO!");
  }
  if (ataque > defensa) {
    let danio = ataque - defensa;

    return danio;
  } else {
    return 0;
  }
};

const opciones = ["A", "D"];
let vidaJugador = 100;
let vidaMaquina = 100;
const generarNumero = () => {
  let numero1al100 = Math.floor(Math.random() * 100) + 1;
  return numero1al100;
};
const generarValoresBatalla = () => {
  let generarValorAtq = generarNumero();
  let generarValorDef = generarNumero();
  let generarValorCritico = !!Math.floor(Math.random() * 2);
  let arregloBatalla = [generarValorAtq, generarValorDef, generarValorCritico];
  return arregloBatalla;
};

for (let index = 1; index < 6; index++) {
  let accionJugador = prompt("Vas a atacar o defender A/D: ").toUpperCase();
  let indiceAleatorio = Math.floor(Math.random() * opciones.length);
  let accionMaquina = opciones[indiceAleatorio];
  let valoresJugador = generarValoresBatalla();
  let valoresMaquina = generarValoresBatalla();
  let resultadoBatalla = calcularDanio(
    valoresJugador[0],
    valoresJugador[1],
    valoresJugador[2],
  );
  if (vidaJugador <= 0 || vidaMaquina <= 0) {
    console.log("La batalla termina...");
    break;
  } else if (
    accionJugador == "A" &&
    accionMaquina != "D" &&
    resultadoBatalla > 100
  ) {
    console.log(
      `Turno ${index}: Atacaste con ${valoresJugador[0]}. El enemigo fue derrotado. Hiciste ${resultadoBatalla} de daño`,
    );
    break;
  } else if (accionJugador === "A" && accionMaquina === "A") {
    console.log(
      `Turno ${index}: Atacaste con ${valoresJugador[0]}. El enemigo ataco con ${valoresMaquina[0]}. Hiciste ${resultadoBatalla} de daño`,
    );
    vidaJugador -= valoresMaquina[0];
    vidaMaquina -= valoresJugador[0];
  } else if (accionJugador === "A" && accionMaquina === "D") {
    let danioBase = calcularDanio(
      valoresJugador[0],
      valoresMaquina[1],
      valoresJugador[2],
    );
    let danioReducido = danioBase / 2;
    console.log(
      `Turno ${index}: Atacaste con ${valoresJugador[0]}. El enemigo se defendio con ${valoresMaquina[1]}. Hiciste ${danioReducido} de daño`,
    );
    vidaMaquina -= danioReducido;
  } else if (accionJugador === "D" && accionMaquina === "A") {
    let danioBase = calcularDanio(
      valoresMaquina[0],
      valoresJugador[1],
      valoresMaquina[2],
    );
    let danioReducido = danioBase / 2;
    console.log(
      `Turno ${index}: Defendiste con ${valoresJugador[1]}. El enemigo ataco con ${valoresMaquina[0]}. Te Hicieron ${danioReducido} de daño`,
    );
    vidaJugador -= danioReducido;
  } else if (accionJugador === "D" && accionMaquina === "D") {
    console.log("Ambos se defendieron");
  }
}
console.log(`-------------------------------------------`);
console.log(
  `Vida del jugador: ${vidaJugador}, Vida del enemigo: ${vidaMaquina}`,
);
if (vidaJugador > vidaMaquina) {
  console.log("Ganaste la batalla!");
} else if (vidaJugador < vidaMaquina) {
  console.log("Perdiste la batalla!");
} else {
  console.log("Empate");
}
