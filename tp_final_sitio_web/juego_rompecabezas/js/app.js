new Vue({ // Crea una nueva instancia de Vue.js que se conectará al HTML y controlará el juego

    el: '#app', // Permite que Vue que maneje todo lo que esté dentro del elemento con id="app".

    data: { // se declaran las variables del juego y la interfaz.
        gameStarted: false,    // Indica si el juego comenzó o no (true/false).
        puzzles: [
            {
                imageSrc: 'https://tn.com.ar/resizer/mIORczMF7G5IibZN17l3G8DS-08=/arc-anglerfish-arc2-prod-artear/public/G2OTGSIVBRF7JGVDGK7K6T5CZM.jpg',
                correctMapping: {
                    0: 0, 8: 4, 4: 8, 1: 3, 3: 1, 5: 11, 11: 5, 6: 10, 10: 6, 7: 9, 9: 7, 2: 2
                    // Mapa que dice qué pieza va en qué lugar del tablero. Por ejemplo: la pieza 8 debe ir al lugar 4
                },
                // Información sobre la obra para mostrar cuando se arma correctamente.
                artworkInfo: {
                    title: 'La Noche Estrellada',
                    artist: 'Vincent van Gogh',
                    year: '1889',
                    era: 'Postimpresionismo',
                    funFact: 'La pintura fue realizada desde la ventana del hospital psiquiátrico en donde se encontraba recluido el artista, en Saint-Rémy, Francia, utilizando su imaginación como modelo ya que no tenía acceso real a dicha vista.'
                }
            },
            {
                imageSrc: 'https://e00-expansion.uecdn.es/assets/multimedia/imagenes/2022/03/16/16474287975340.jpg',
                correctMapping: {
                    0: 0, 8: 4, 4: 8, 1: 3, 3: 1, 5: 11, 11: 5, 6: 10, 10: 6, 7: 9, 9: 7, 2: 2
                },
                artworkInfo: {
                    title: 'Guernica',
                    artist: 'Pablo Picasso',
                    year: '1937',
                    era: 'Cubismo',
                    funFact: 'Fue un encargo del Gobierno de la Segunda República Española para el pabellón español en la Exposición Internacional de 1937 en París. Picasso se negó a que la obra fuera expuesta en España mientras no se restaurara la democracia.'
                }
            },
            { 
                imageSrc: 'https://blog.coolmaison.com/wp-content/uploads/2021/10/gustav-klimt-cabecera.jpeg',
                correctMapping: {
                    0: 0, 8: 4, 4: 8, 1: 3, 3: 1, 5: 11, 11: 5, 6: 10, 10: 6, 7: 9, 9: 7, 2: 2
                },
                artworkInfo: {
                    title: 'El Beso',
                    artist: 'Gustav Klimt',
                    year: '1907-1908',
                    era: 'Modernismo',
                    funFact: 'A pesar de ser una de las obras más populares de Klimt, cuando fue exhibida por primera vez fue criticada por algunos como pornográfica.'
                }
            },
            {
                imageSrc: 'https://i0.wp.com/www.freim.tv/wp-content/uploads/2017/03/Creation_of_Adam.jpg?resize=720%2C325&ssl=1',
                correctMapping: {
                    0: 0, 8: 4, 4: 8, 1: 3, 3: 1, 5: 11, 11: 5, 6: 10, 10: 6, 7: 9, 9: 7, 2: 2
                },
                artworkInfo: {
                    title: 'La Creación de Adán',
                    artist: 'Miguel Ángel',
                    year: '1508-1512',
                    era: 'Renacimiento',
                    funFact: 'Esta famosa escena forma parte del fresco de la bóveda de la Capilla Sixtina en el Vaticano, un trabajo que Miguel Ángel realizó con renuencia y que le llevó más de cuatro años completar.'
                }
            }
        ],
        currentPuzzleIndex: 0,         // Índice que indica cuál de los puzzles se está jugando actualmente.
        cols: 4, // Cantidad de columnas del rompecabezas (ancho del tablero).
        rows: 3,  // Cantidad de filas del rompecabezas (alto del tablero).
        pieces: [],// Lista de piezas del puzzle actual. Se crea dinámicamente al iniciar el juego.
        slots: [], // Espacios vacíos en el tablero donde las piezas se deben colocar
        winMessage: null,
        draggingPiece: null, // Guarda qué pieza se está arrastrando actualmente.
        offsetX: 0, // Guardan la diferencia entre el punto del clic del mouse y el borde de la pieza (para moverla bien).
        offsetY: 0,
        puzzleContainerRect: null,// Guarda la posición y tamaño del tablero para verificar si una pieza fue soltada dentro.
        showFullImage: true,// Indica si se debe mostrar la imagen completa antes de comenzar a mover las piezas.
    },
    computed: {
        // Propiedades que se calculan automáticamente a partir de otras variables.
        currentPuzzle() {
            return this.puzzles[this.currentPuzzleIndex]; // Devuelve el puzzle actual (basado en el índice). Se usa para mostrar la imagen y la solución.
        },
        unplacedPiecesLeft() {
            const unplaced = this.pieces.filter(p => !p.isPlaced && !p.isDroppedOnBoard);// Filtra las piezas que aún no fueron colocadas.
            const half = Math.ceil(unplaced.length / 2);  // Calcula la mitad del total de piezas no colocadas (redondeando hacia arriba)
            return unplaced.slice(0, half);  // Devuelve la primera mitad (para mostrarlas en la columna izquierda del juego).
        },
        unplacedPiecesRight() { 
            const unplaced = this.pieces.filter(p => !p.isPlaced && !p.isDroppedOnBoard);
            const half = Math.ceil(unplaced.length / 2);
            return unplaced.slice(half); 
            // Devuelve la segunda mitad de las piezas no colocadas (para la columna derecha del juego).
        },
        placedPieces() {
            return this.pieces.filter(piece => piece.isPlaced || piece.isDroppedOnBoard);
             // Devuelve todas las piezas que ya fueron colocadas en el tablero (correctas o incorrectas).
        }
    },
    // Aquí comienzan las funciones (acciones) que se pueden ejecutar en el juego.
    methods: {
        startGame() { // Esta función se llama cuando el jugador hace clic en el botón para comenzar el juego.
            this.gameStarted = true; // Marca que el juego comenzó.
            this.showFullImage = true; // Muestra la imagen completa al principio.
            this.$nextTick(() => {// Espera a que el DOM (estructura visual del HTML) se actualice, y luego ejecuta lo que hay dentro.
                this.initializePuzzle();  // Llama a la función que prepara el rompecabezas (piezas, slots, etc.).
            });
        },
        hideFullImageAndStartPuzzle() { // Esta función se usa cuando el jugador hace clic para ocultar la imagen completa y empezar a mover piezas.
            this.showFullImage = false;
        },
        initializePuzzle() { // Prepara el rompecabezas para jugar: borra todo lo anterior y genera nuevas piezas.
            this.pieces = [];
            this.slots = [];
            this.winMessage = null;
            this.showFullImage = true;
            this.createPieces(); // Genera las piezas con sus imágenes y posiciones.
            this.createSlots(); // Crea los espacios del tablero donde deben ir las piezas.
            document.removeEventListener('mousemove', this.dragMove);  // Se aseguran de que no queden eventos anteriores activos que puedan causar errores.
            document.removeEventListener('mouseup', this.dragEnd);
        },
        createPieces() { // Crea cada pieza del rompecabezas, le asigna una imagen de fondo y una posición.
            const totalPieces = this.cols * this.rows;   // Calcula cuántas piezas tendrá el puzzle (4x3 = 12).
            this.pieces = [];
            for (let i = 0; i < totalPieces; i++) { // Bucle que se repite por cada pieza.
                const originalIndex = i;  // Guarda el número de pieza original.
                const c = originalIndex % this.cols;  // Calcula la posición original en columnas (c) y filas (r).
                const r = Math.floor(originalIndex / this.cols);  // Calcula la posición original en columnas (c) y filas (r).

                const piece = {  // Define las propiedades de la pieza:
                    id: i,
                    originalIndex: originalIndex,
                    x: c,
                    y: r,
                    isDragging: false,
                    isPlaced: false,
                    isDroppedOnBoard: false,
                    isIncorrect: false,
                    currentPosition: null,
                    style: { // Estilo visual de la pieza (fondo, tamaño, posición)
                        width: `calc(100% / ${this.cols})`,
                        height: `calc(100% / ${this.rows})`,
                        'background-image': `url(${this.currentPuzzle.imageSrc})`,// Usa la imagen del puzzle actual como fondo de la pieza.
                        'background-size': `${this.cols * 100}% ${this.rows * 100}%`,
                        'background-position': `${c * 100}% ${r * 100}%`
                    }
                };
                this.pieces.push(piece); // Agrega la pieza creada al array de piezas.el .push agrega un elemento al final del array.
            }
            this.pieces.sort(() => Math.random() - 0.5);
        },
        createSlots() { // Crea los espacios vacíos en el tablero donde las piezas deben encajar.
            for (let i = 0; i < this.cols * this.rows; i++) { // Bucle que recorre cada espacio del tablero.
                this.slots.push({ occupied: false, correctPieceIndex: i });  
            }
        },
        getPoolPieceStyle(piece) { //
            const baseSize = 350; // Tamaño base para calcular el tamaño de cada pieza en px.
            const pieceWidth = baseSize / this.rows; // Calcula el ancho y alto de cada pieza.
            const pieceHeight = baseSize / this.rows; // Calcula el ancho y alto de cada pieza.
            const baseStyle = { // Estilos comunes para todas las piezas fuera del tablero.
                'background-image': piece.style['background-image'],
                'background-size': piece.style['background-size'],
                'background-position': piece.style['background-position'], 
                'width': `${pieceWidth}px`, // Ancho de la pieza
                'height': `${pieceHeight}px`, // Alto de la pieza
                'box-shadow': '0 4px 8px rgba(0,0,0,0.4)',
                'border-radius': '6px',
            };
            if (piece.isDragging) { // Si la pieza está siendo arrastrada:
                return {
                    ...baseStyle,
                    'position': 'fixed',
                    'left': `${piece.currentPosition.x}px`, // Posición horizontal de la pieza arrastrada
                    'top': `${piece.currentPosition.y}px`, // Posición vertical de la pieza arrastrada
                    'z-index': 1000,
                    'opacity': 1,
                    'filter': 'none'
                };
            }
            return {
                ...baseStyle,
                'position': 'relative',
                'width': `calc(350px / ${this.rows})`,
                'height': `calc(350px / ${this.rows})`,
                'opacity': 1,
                'filter': 'none'
            };
        },
        getPlacedPieceStyle(piece) { // Devuelve el estilo de las piezas que ya fueron colocadas en el tablero.
            return {
                ...piece.style,
                position: 'absolute',
                top: `${(100 / this.rows) * piece.y}%`,
                left: `${(100 / this.cols) * piece.x}%`,
                width: `calc(100% / ${this.cols})`,
                height: `calc(100% / ${this.rows})`,
                'z-index': 5
            };
        },
        dragStart(event, piece) {       // Esta función se llama cuando el jugador comienza a arrastrar una pieza.  
            if (piece.isPlaced || piece.isDroppedOnBoard) { // Si la pieza ya está colocada o fue soltada en el tablero, no se puede arrastrar.
                piece.isPlaced = false;
                piece.isDroppedOnBoard = false;
                piece.isIncorrect = false;
                piece.currentPosition = null;
            }
            this.draggingPiece = piece; // Guarda la pieza que se está arrastrando actualmente.
            this.draggingPiece.isDragging = true; // Marca la pieza como "siendo arrastrada".
            const rect = event.target.getBoundingClientRect();// Obtiene las coordenadas y tamaño del elemento HTML de la pieza arrastrada.
            this.offsetX = event.clientX - rect.left;
            this.offsetY = event.clientY - rect.top;

            this.draggingPiece.currentPosition = { x: event.clientX - this.offsetX, y: event.clientY - this.offsetY };

            document.addEventListener('mousemove', this.dragMove);
            document.addEventListener('mouseup', this.dragEnd);
        },
        dragMove(event) { // Esta función se llama mientras el jugador arrastra la pieza.
            if (this.draggingPiece) { // Si hay una pieza siendo arrastrada, actualiza su posición.
                const newX = event.clientX - this.offsetX;
                const newY = event.clientY - this.offsetY;
                this.draggingPiece.currentPosition = { x: newX, y: newY }; // Actualizamos la posición de la pieza que se está arrastrando.
                this.$forceUpdate();// Fuerza a Vue a actualizar la vista para reflejar el nuevo movimiento de la pieza.
            }
        },
        dragEnd(event) { // Se ejecuta cada vez que el usuario mueve el mouse mientras arrastra una pieza.
            document.removeEventListener('mousemove', this.dragMove); // Se ejecuta cada vez que el usuario mueve el mouse mientras arrastra una pieza.
            document.removeEventListener('mouseup', this.dragEnd);

            if (!this.draggingPiece) { // Si no hay una pieza siendo arrastrada, no hace nada.
                return;
            }
            const puzzleContainer = this.$refs.puzzleContainer; // Obtiene el contenedor del rompecabezas desde el HTML (donde se deben soltar las piezas).
            if (!puzzleContainer) {
                this.resetDraggingState();
                return;
            }
            const containerRect = puzzleContainer.getBoundingClientRect(); // Obtiene las coordenadas y tamaño del contenedor del rompecabezas para verificar si la pieza fue soltada dentro de él.
            const dropX = event.clientX;
            const dropY = event.clientY;

            // Verificamos si el mouse estaba dentro del área del tablero

            if (dropX >= containerRect.left && dropX <= containerRect.right &&
                dropY >= containerRect.top && dropY <= containerRect.bottom) {      // Si la pieza fue soltada dentro del contenedor del rompecabezas:

                const relX = dropX - containerRect.left;      //
                const relY = dropY - containerRect.top;
                const pieceWidth = containerRect.width / this.cols;
                const pieceHeight = containerRect.height / this.rows;
                const dropCol = Math.floor(relX / pieceWidth);  // Calculamos en qué celda se soltó la pieza.
                const dropRow = Math.floor(relY / pieceHeight);  // Calculamos en qué celda se soltó la pieza.
                const dropIndex = dropRow * this.cols + dropCol;

                const correct = (this.currentPuzzle.correctMapping[this.draggingPiece.originalIndex] === dropIndex);
                 // Verificamos si la pieza fue colocada en el lugar correcto.


                this.draggingPiece.isDroppedOnBoard = true;
                this.draggingPiece.x = dropCol;
                this.draggingPiece.y = dropRow;
                this.draggingPiece.currentPosition = null;

                if (correct) {
                    this.draggingPiece.isPlaced = true;
                    this.draggingPiece.isIncorrect = false;
                    this.checkWinCondition();
                } else {
                    this.draggingPiece.isPlaced = false;
                    this.draggingPiece.isIncorrect = true;
                }
            } else {
                this.draggingPiece.isPlaced = false;
                this.draggingPiece.isDroppedOnBoard = false;
                this.draggingPiece.isIncorrect = false;
                this.draggingPiece.currentPosition = null;
            }
            this.resetDraggingState();
        },
        resetDraggingState() { 
            // Resetea el estado de arrastre después de soltar una pieza.
            if (this.draggingPiece) {
                this.draggingPiece.isDragging = false;
                this.draggingPiece = null;
            }
        },
        checkWinCondition() {
            const allCorrect = this.pieces.every(piece => piece.isPlaced);
            if (allCorrect) {
                this.winMessage = '¡Felicidades, has completado el rompecabezas!';
            }
        },
        nextPuzzle() {
            if (this.currentPuzzleIndex < this.puzzles.length - 1) {
                this.currentPuzzleIndex++;
                this.initializePuzzle();
            } else {
                this.gameStarted = false;
                this.currentPuzzleIndex = 0;
            }
        }
    }
});