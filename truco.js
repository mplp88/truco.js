//(function () {
class Juego {
    constructor(cantidadJugadores) {
        this.cantidadJugadores = cantidadJugadores;
        this.turno = 0;
        this.jugadores = [];
        this.mesa = {};
        this.mazo = {};
    }

    sorteo(jugadores) {
        var turno;

        this.cantidadJugadores = jugadores.length;

        turno = Math.floor(Math.random() * this.cantidadJugadores + 1);

        return turno;
    }

    iniciar(cantidadJugadores) {
        cantidadJugadores = 2; //TODO: A futuro agregar más jugadores

        // debugger;
        this.mesa = new Mesa();
        this.mazo = new Mazo();
        this.mazo.init();

        let jugador1 = new Jugador(1, false); //A futuro agregar más jugadores
        let jugador2 = new Jugador(2, false); //A futuro agregar más jugadores

        this.jugadores.push(jugador1);
        this.jugadores.push(jugador2);


        // Determinar quién empieza.
        this.turno = this.sorteo(this.jugadores);

        this.preparar();

        this.jugadores[0].mano.cartas.forEach((carta, index) => {
            let oCarta = document.querySelector(`#jugador--1 .carta--${index}`)
            oCarta.querySelector('.carta--numero').innerHTML = carta.numero;
            oCarta.querySelector('.carta--palo').innerHTML = carta.palo;
        })

        this.jugadores[1].mano.cartas.forEach((carta, index) => {
            let oCarta = document.querySelector(`#jugador--2 .carta--${index}`)
            oCarta.querySelector('.carta--numero').innerHTML = carta.numero;
            oCarta.querySelector('.carta--palo').innerHTML = carta.palo;
        })

        console.log(this);
        /*
        console.log(jugador1);
        console.log(jugador2);
        console.log(turno);
        */
    }

    preparar() {
        this.jugadores.forEach(jugador => {
            jugador.mano.limpiar();
        })
        this.mazo.mezclar();
        this.mazo.repartir(this.jugadores);
    }

    jugarCarta(cartaIndex, jugadorNumero) {
        let jugador = this.jugadores.find(j => j.numero == jugadorNumero);
        let cartaJugada = jugador.jugar(cartaIndex);
        this.mesa.poner(cartaJugada.carta, cartaJugada.numeroJugador);
        console.log(this);
    }

    volverARepartir() {
        this.preparar();
    }
}

class Carta {
    constructor(numero, palo, valor) {
        this.index = -1
        this.numero = numero;
        this.palo = palo;
        this.valor = valor;
    }

    setIndex(index) {
        this.index = index;
    }
}

class Mazo {
    constructor() {
        this.cartas = [];
    }

    init() {
        var numeros = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12, ]
        var palos = ["Espada", "Basto", "Oro", "Copa"]
        var valor;

        for (var palo = 0; palo < palos.length; palo++) {
            for (var numero = 0; numero < numeros.length; numero++) {
                valor = this.asignarValorCarta(numeros[numero], palos[palo]);
                var carta = new Carta(numeros[numero], palos[palo], valor);
                this.cartas.push(carta);
            }
        }
    }

    asignarValorCarta(numero, palo) {
        var valor;

        switch (palo) {
            case "Espada":
                switch (numero) {
                    case 1:
                        valor = 100;
                        break;
                    case 2:
                        valor = 20;
                        break;
                    case 3:
                        valor = 30;
                        break;
                    case 7:
                        valor = 80;
                        break;
                    default:
                        valor = numero;
                        break;
                }
                break;
            case "Basto":
                switch (numero) {
                    case 1:
                        valor = 90;
                        break;
                    case 2:
                        valor = 20;
                        break;
                    case 3:
                        valor = 30;
                        break;
                    default:
                        valor = numero;
                        break;
                }
                break;
            case "Oro":
                switch (numero) {
                    case 1:
                        valor = 15;
                        break;
                    case 2:
                        valor = 20;
                        break;
                    case 3:
                        valor = 30;
                        break;
                    case 7:
                        valor = 70;
                        break;
                    default:
                        valor = numero;
                        break;
                }
                break;
            case "Copa":
                switch (numero) {
                    case 1:
                        valor = 15;
                        break;
                    case 2:
                        valor = 20;
                        break;
                    case 3:
                        valor = 30;
                        break;
                    default:
                        valor = numero;
                        break;
                }
        }

        return valor;
    }

    mezclar() {
        var temporaryValue = new Carta();
        var randomIndex;
        var currentIndex = this.cartas.length;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = this.cartas[currentIndex];
            this.cartas[currentIndex] = this.cartas[randomIndex];
            this.cartas[randomIndex] = temporaryValue;
        }
    }

    repartir(jugadores) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < jugadores.length; j++) {
                jugadores[j].mano.agarrar(this.cartas.shift());
            }
        }
    }
}

class Mano {
    constructor() {
        this.cartaNumero;
        this.cartas = [];
    }

    agarrar(carta) {
        carta.setIndex(this.cartas.length);
        this.cartas.push(carta);
    }

    limpiar() {
        this.cartas = [];
    }

    tirar(cartaIndex) {
        let carta = this.cartas.find(c => c.index == cartaIndex);
        this.cartas = this.cartas.filter(c => c.index != carta.index);
        return carta;
    }
}

class Jugador {
    constructor(numero, isNpc) {
        this.puntos = 0;
        this.numero = numero;
        this.isNpc = isNpc;
        this.mano = new Mano();
    }

    irseAlMazo() {
        this.mano.limpiar();
    }

    jugar(cartaIndex) {
        var carta = this.mano.tirar(cartaIndex);
        var numeroJugador = this.numero;
        let oJugador = document.querySelector(`#jugador--${numeroJugador}`);
        let oCarta = document.querySelector(`#jugador--${numeroJugador} .carta--${cartaIndex}`);
        let oBoton = document.querySelector(`#jugador--${numeroJugador} .jugar--carta--${cartaIndex}`);
        oJugador.removeChild(oCarta.parentElement);
        oJugador.removeChild(oBoton);
        return {
            carta,
            numeroJugador
        }
    }
}

class Mesa {
    constructor() {
        this.mano = 1;
        this.cartas = [];
    }

    poner(carta, nroJugador) {
        this.cartas.push({
            mano: this.mano,
            carta,
            nroJugador
        });

        let oMesa = document.querySelector('#mesa');
        oMesa.querySelector(`#mano--${this.mano} .jugador--${nroJugador}`).innerHTML += `
        <span class="carta--jugador--${nroJugador}">
          <span class="carta--numero">${carta.numero}</span>
          <span class="carta--palo">${carta.palo}</span>
        </span>
        `;

        this.verificarGanador();
    }

    verificarGanador() {
        let cartasMano = this.cartas.filter(c => c.mano == this.mano);
        if (cartasMano.length != 2) return;

        let cartaJug1 = cartasMano.find(c => c.nroJugador == 1).carta;
        let cartaJug2 = cartasMano.find(c => c.nroJugador == 2).carta;
        if (cartaJug1.valor > cartaJug2.valor) {
            document.querySelector(`#mesa #mano--${this.mano} .carta.jugador--1`).classList.add('ganador')
            document.querySelector(`#mesa #mano--${this.mano} .carta.jugador--2`).classList.add('perdedor')
            document.querySelector(`#mesa #mano--${this.mano} .ganador .jugador`).innerHTML = '1';
            console.log('gano jugador 1')
        } else if (cartaJug1.valor < cartaJug2.valor) {
            document.querySelector(`#mesa #mano--${this.mano} .carta.jugador--1`).classList.add('perdedor')
            document.querySelector(`#mesa #mano--${this.mano} .carta.jugador--2`).classList.add('ganador')
            document.querySelector(`#mesa #mano--${this.mano} .ganador .jugador`).innerHTML = '2';
            console.log('gano jugador 2')
        } else {
            document.querySelector(`#mesa #mano--${this.mano} .carta.jugador--1`).classList.add('parda')
            document.querySelector(`#mesa #mano--${this.mano} .carta.jugador--2`).classList.add('parda')
            document.querySelector(`#mesa #mano--${this.mano} .ganador .jugador`).innerHTML = 'Parda';
            console.log('parda');
        }

        this.mano += 1;
    }
}

let juego;

function iniciar() {
    juego = new Juego(2); //TODO: A futuro agregar más jugadores
    juego.iniciar()
}

function jugarCarta(cartaIndex, jugadorNumero) {
    juego.jugarCarta(cartaIndex, jugadorNumero);
}

function preparar() {
    juego.preparar();
}

window.onload = iniciar;
//})()