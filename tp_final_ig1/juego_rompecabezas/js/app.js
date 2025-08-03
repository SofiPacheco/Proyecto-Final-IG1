new Vue({
    el: '#app',
    data: {
        gameStarted: false,
        puzzles: [
            {
                imageSrc: 'https://tn.com.ar/resizer/mIORczMF7G5IibZN17l3G8DS-08=/arc-anglerfish-arc2-prod-artear/public/G2OTGSIVBRF7JGVDGK7K6T5CZM.jpg',
                correctMapping: {
                    0: 0, 8: 4, 4: 8, 1: 3, 3: 1, 5: 11, 11: 5, 6: 10, 10: 6, 7: 9, 9: 7, 2: 2
                },
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
        currentPuzzleIndex: 0,
        cols: 4,
        rows: 3,
        pieces: [],
        slots: [],
        winMessage: null,
        draggingPiece: null,
        offsetX: 0,
        offsetY: 0,
        puzzleContainerRect: null,
        showFullImage: true,
    },
    computed: {
        currentPuzzle() {
            return this.puzzles[this.currentPuzzleIndex];
        },
        unplacedPiecesLeft() {
            const unplaced = this.pieces.filter(p => !p.isPlaced && !p.isDroppedOnBoard);
            const half = Math.ceil(unplaced.length / 2);
            return unplaced.slice(0, half);
        },
        unplacedPiecesRight() {
            const unplaced = this.pieces.filter(p => !p.isPlaced && !p.isDroppedOnBoard);
            const half = Math.ceil(unplaced.length / 2);
            return unplaced.slice(half);
        },
        placedPieces() {
            return this.pieces.filter(piece => piece.isPlaced || piece.isDroppedOnBoard);
        }
    },
    methods: {
        startGame() {
            this.gameStarted = true;
            this.showFullImage = true;
            this.$nextTick(() => {
                this.initializePuzzle();
            });
        },
        hideFullImageAndStartPuzzle() {
            this.showFullImage = false;
        },
        initializePuzzle() {
            this.pieces = [];
            this.slots = [];
            this.winMessage = null;
            this.showFullImage = true;
            this.createPieces();
            this.createSlots();
            document.removeEventListener('mousemove', this.dragMove);
            document.removeEventListener('mouseup', this.dragEnd);
        },
        createPieces() {
            const totalPieces = this.cols * this.rows;
            this.pieces = [];
            for (let i = 0; i < totalPieces; i++) {
                const originalIndex = i;
                const c = originalIndex % this.cols;
                const r = Math.floor(originalIndex / this.cols);

                const piece = {
                    id: i,
                    originalIndex: originalIndex,
                    x: c,
                    y: r,
                    isDragging: false,
                    isPlaced: false,
                    isDroppedOnBoard: false,
                    isIncorrect: false,
                    currentPosition: null,
                    style: {
                        width: `calc(100% / ${this.cols})`,
                        height: `calc(100% / ${this.rows})`,
                        'background-image': `url(${this.currentPuzzle.imageSrc})`,
                        'background-size': `${this.cols * 100}% ${this.rows * 100}%`,
                        'background-position': `${c * 100}% ${r * 100}%`
                    }
                };
                this.pieces.push(piece);
            }
            this.pieces.sort(() => Math.random() - 0.5);
        },
        createSlots() {
            for (let i = 0; i < this.cols * this.rows; i++) {
                this.slots.push({ occupied: false, correctPieceIndex: i });
            }
        },
        getPoolPieceStyle(piece) {
            const baseSize = 350;
            const pieceWidth = baseSize / this.rows;
            const pieceHeight = baseSize / this.rows;
            const baseStyle = {
                'background-image': piece.style['background-image'],
                'background-size': piece.style['background-size'],
                'background-position': piece.style['background-position'],
                'width': `${pieceWidth}px`,
                'height': `${pieceHeight}px`,
                'box-shadow': '0 4px 8px rgba(0,0,0,0.4)',
                'border-radius': '6px',
            };
            if (piece.isDragging) {
                return {
                    ...baseStyle,
                    'position': 'fixed',
                    'left': `${piece.currentPosition.x}px`,
                    'top': `${piece.currentPosition.y}px`,
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
        getPlacedPieceStyle(piece) {
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
        dragStart(event, piece) {
            if (piece.isPlaced || piece.isDroppedOnBoard) {
                piece.isPlaced = false;
                piece.isDroppedOnBoard = false;
                piece.isIncorrect = false;
                piece.currentPosition = null;
            }
            this.draggingPiece = piece;
            this.draggingPiece.isDragging = true;
            const rect = event.target.getBoundingClientRect();
            this.offsetX = event.clientX - rect.left;
            this.offsetY = event.clientY - rect.top;

            this.draggingPiece.currentPosition = { x: event.clientX - this.offsetX, y: event.clientY - this.offsetY };

            document.addEventListener('mousemove', this.dragMove);
            document.addEventListener('mouseup', this.dragEnd);
        },
        dragMove(event) {
            if (this.draggingPiece) {
                const newX = event.clientX - this.offsetX;
                const newY = event.clientY - this.offsetY;
                this.draggingPiece.currentPosition = { x: newX, y: newY };
                this.$forceUpdate();
            }
        },
        dragEnd(event) {
            document.removeEventListener('mousemove', this.dragMove);
            document.removeEventListener('mouseup', this.dragEnd);

            if (!this.draggingPiece) {
                return;
            }
            const puzzleContainer = this.$refs.puzzleContainer;
            if (!puzzleContainer) {
                this.resetDraggingState();
                return;
            }
            const containerRect = puzzleContainer.getBoundingClientRect();
            const dropX = event.clientX;
            const dropY = event.clientY;

            if (dropX >= containerRect.left && dropX <= containerRect.right &&
                dropY >= containerRect.top && dropY <= containerRect.bottom) {

                const relX = dropX - containerRect.left;
                const relY = dropY - containerRect.top;
                const pieceWidth = containerRect.width / this.cols;
                const pieceHeight = containerRect.height / this.rows;
                const dropCol = Math.floor(relX / pieceWidth);
                const dropRow = Math.floor(relY / pieceHeight);
                const dropIndex = dropRow * this.cols + dropCol;

                const correct = (this.currentPuzzle.correctMapping[this.draggingPiece.originalIndex] === dropIndex);

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