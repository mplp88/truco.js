//(function () {
class Juego {
    constructor(cantidadJugadores, idElemento) {
        this.cantidadJugadores = cantidadJugadores;
        this.turno = 0;
        this.proximoTurno = -1;
        this.jugadores = [];
        this.mesa = {};
        this.mazo = {};
        this.idElemento = idElemento || 'juego';
        this.cargando = true;
    }

    sorteo(jugadores) {
        let turno;

        this.cantidadJugadores = jugadores.length;

        turno = Math.floor(Math.random() * this.cantidadJugadores + 1);

        return turno;
    }

    imprimirCartas() {
        this.jugadores.forEach( jugador => { 
            jugador.mano.cartas.forEach((carta, index) => {
                let oCarta = document.querySelector(`#jugador--${jugador.numero} .carta--${index}`)
                oCarta.querySelector('.carta--numero').innerHTML = carta.numero;
                oCarta.querySelector('.carta--palo').innerHTML = carta.palo;
            });
        });
    }

    imprimirJugadores() {
        this.jugadores.forEach(jugador => {
            let oJugador = jugador.crearElementoHTML()
            document.querySelector('#jugadores').appendChild(oJugador);
        })
    }

    iniciar(cantidadJugadores) {
        this.cantidadJugadores = 2; //TODO: A futuro agregar más jugadores

        // debugger;
        this.mesa = new Mesa();
        this.mazo = new Mazo();
        
        this.generarJugadores();
        this.preparar();
        this.imprimirJugadores();
        this.imprimirCartas();
        
        this.turno = this.sorteo(this.jugadores);
        this.cambiarBotones();
        
        console.log(this);
    }
    
    reiniciar() {
        this.limpiarJugadores();
        this.iniciar(this.cantidadJugadores);
    }

    cambiarTurno() {
        if(this.proximoTurno > 0) {
            this.turno = this.proximoTurno;
        } else {
            this.turno += 1;
            if(this.turno > this.jugadores.length) {
                this.turno = 1;
            }
        }
    }

    cambiarBotones() {
        let botonesJugador;
        juego.jugadores.forEach(jugador => {
            botonesJugador = document.querySelectorAll(`#jugador--${jugador.numero} button`);
            botonesJugador.forEach(el => {
                el.disabled = 'disabled';
            });
        })
        
        botonesJugador = document.querySelectorAll(`#jugador--${this.turno} button`);
        botonesJugador.forEach(el => {
            el.disabled = '';
        });
    }

    generarJugadores() {
        this.jugadores = [];
        for(let i = 1; i <= this.cantidadJugadores; i++) {
            let jugador = new Jugador(i, false);
            this.jugadores.push(jugador);
        }
    }

    limpiarJugadores() {
        this.jugadores.forEach(jugador => {
            jugador.mano.cartas.forEach(carta => {
                carta.index = -1;
            })
            this.mazo.cartas = [ ...this.mazo.cartas, ...jugador.mano.cartas]
            jugador.mano.limpiar();
        })
        document.querySelector('#jugadores').innerHTML = '';
    }

    preparar() {
        this.mazo.mezclar();
        this.mazo.repartir(this.jugadores);
    }

    jugarCarta(cartaIndex, jugadorNumero) {
        let jugador = this.jugadores.find(j => j.numero == jugadorNumero);
        let cartaJugada = jugador.jugar(cartaIndex);
        this.mesa.poner(cartaJugada.carta, cartaJugada.numeroJugador);
        this.cambiarTurno();
        this.cambiarBotones();
    }

    volverARepartir() {
        this.limpiarJugadores();
        this.preparar();
        this.imprimirJugadores();
        this.imprimirCartas();
        this.cambiarBotones();
    }

    montar() {
        let oJuego = document.querySelector('#'+this.idElemento);
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
        this.init();
    }

    init() {
        let numeros = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12, ]
        let palos = ["Espada", "Basto", "Oro", "Copa"]
        let valor;

        for (let palo = 0; palo < palos.length; palo++) {
            for (let numero = 0; numero < numeros.length; numero++) {
                valor = this.asignarValorCarta(numeros[numero], palos[palo]);
                let carta = new Carta(numeros[numero], palos[palo], valor);
                this.cartas.push(carta);
            }
        }
    }

    asignarValorCarta(numero, palo) {
        let valor;

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
        let temporaryValue = new Carta();
        let randomIndex;
        let currentIndex = this.cartas.length;

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

    dar() {
        return this.cartas.shift();
    }
    
    repartir(jugadores) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < jugadores.length; j++) {
                jugadores[j].mano.agarrar(this.dar());
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
        this.el = ''
    }

    irseAlMazo() {
        this.mano.limpiar();
    }

    jugar(cartaIndex) {
        let carta = this.mano.tirar(cartaIndex);
        let numeroJugador = this.numero;
        let oJugador = document.querySelector(`#jugador--${numeroJugador}`);
        let oCarta = document.querySelector(`#jugador--${numeroJugador} .carta--${cartaIndex}`);
        //let oBoton = document.querySelector(`#jugador--${numeroJugador} .jugar--carta--${cartaIndex}`);
        oJugador.removeChild(oCarta.parentElement);
        //oJugador.removeChild(oBoton);
        return {
            carta,
            numeroJugador
        }
    }

    crearElementoHTML() {
        let oJugador, oCartaContainer, oCarta, oNumeroCarta, oPaloCarta, oButtonJugar;

        //Creación Elemento Jugador
        oJugador = document.createElement('div');
        oJugador.id = 'jugador--' + this.numero;
        oJugador.classList.add('jugador');

        for(let i = 0; i < 3; i++) {
            //Creación Elemento Carta
            oCarta = document.createElement('div');
            oCarta.classList.add('carta');
            oCarta.classList.add('carta--'+i);

            //Creación Elemento Numero de Carta
            oNumeroCarta = document.createElement('span');
            oNumeroCarta.classList.add('carta--numero');
            
            //Creación Elemento Palo de Carta
            oPaloCarta = document.createElement('span');
            oPaloCarta.classList.add('carta--palo');

            //Append Numero y Palo a Carta
            oCarta.appendChild(oNumeroCarta);
            oCarta.appendChild(oPaloCarta);
            //Creación Elemento Boton Jugar Carta
            oButtonJugar = document.createElement('button');
            oButtonJugar.disabled = 'disabled';
            oButtonJugar.classList.add('jugar--carta');
            oButtonJugar.classList.add('carta--'+i);
            oButtonJugar.innerHTML = "Jugar carta "+ (i+1);
            oButtonJugar.onclick = () => { 
                jugarCarta(i, this.numero);
            }

             // Creacion Elemento Contenedor de carta
            oCartaContainer = document.createElement('div');
            oCartaContainer.classList.add('carta--en--mano');

            //Append de la carta y el boton al contenedor
            oCartaContainer.appendChild(oCarta);
            oCartaContainer.appendChild(oButtonJugar);
            
            //Append de la carta y el boton al contenedor
            oJugador.appendChild(oCartaContainer);
        }

        return oJugador;
    }
}

class Mesa {
    constructor() {
        this.mano = 1;
        this.cartas = [];
        this.cartasAnteriores = []
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
        let cartaMasAlta = {};
        this.proximoTurno = -1;
        cartaMasAlta.carta = new Carta(-1, '', -1)
        if (this.cartas.length != juego.jugadores.length) return false;

        this.cartas.forEach(c => {
            if(c.carta.valor > cartaMasAlta.carta.valor) {
                cartaMasAlta = c;
            }
        });

        this.cartas.forEach(c => {
            if(c.nroJugador == cartaMasAlta.nroJugador) {
                document.querySelector(`#mesa #mano--${this.mano} .carta.jugador--${c.nroJugador}`).classList.add('ganador');
                document.querySelector(`#mesa #mano--${this.mano} .ganador .jugador`).innerHTML = c.nroJugador;
            } else {
                document.querySelector(`#mesa #mano--${this.mano} .carta.jugador--${c.nroJugador}`).classList.add('perdedor')
            }
        })
    /*
        let cartaJug1 = cartasMano.find(c => c.nroJugador == 1).carta;
        let cartaJug2 = cartasMano.find(c => c.nroJugador == 2).carta;
        if (cartaJug1.valor > cartaJug2.valor) {
            document.querySelector(`#mesa #mano--${this.mano} .carta.jugador--1`).classList.add('ganador')
            document.querySelector(`#mesa #mano--${this.mano} .carta.jugador--2`).classList.add('perdedor')
            document.querySelector(`#mesa #mano--${this.mano} .ganador .jugador`).innerHTML = '1';
        } else if (cartaJug1.valor < cartaJug2.valor) {
            document.querySelector(`#mesa #mano--${this.mano} .carta.jugador--1`).classList.add('perdedor')
            document.querySelector(`#mesa #mano--${this.mano} .carta.jugador--2`).classList.add('ganador')
            document.querySelector(`#mesa #mano--${this.mano} .ganador .jugador`).innerHTML = '2';
        } else {
            document.querySelector(`#mesa #mano--${this.mano} .carta.jugador--1`).classList.add('parda')
            document.querySelector(`#mesa #mano--${this.mano} .carta.jugador--2`).classList.add('parda')
            document.querySelector(`#mesa #mano--${this.mano} .ganador .jugador`).innerHTML = 'Parda';
        }
        */
        this.mano += 1;
        this.proximoTurno = cartaMasAlta.nroJugador;
        for (let i = 0; i <= this.cartas.length; i++) {
            this.cartasAnteriores.push(this.cartas.pop());
        }
        return true;
    }
}

let juego = new Juego(2);;

function iniciar() {
    //juego = new Juego(2);  //TODO: A futuro agregar más jugadores
    juego.iniciar()
}

function reiniciar() {
    juego.reiniciar();
}

function jugarCarta(cartaIndex, jugadorNumero) {
    juego.jugarCarta(cartaIndex, jugadorNumero);
}

function volverARepartir() {
    juego.volverARepartir();
}

window.onload = iniciar;
//})()