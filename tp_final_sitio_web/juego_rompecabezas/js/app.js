new Vue({
    el: '#app',
    data: {
        gameStarted: false,
        imageSrc: '../img/galería/arte_impresionista2.jpeg', // Asegúrate de que esta ruta sea correcta
        cols: 4,
        rows: 3,
        pieces: [],
        slots: [],
        winMessage: null,
        draggingPiece: null,
        offsetX: 0,
        offsetY: 0,
        puzzleContainerRect: null,
        showFullImage: true, // Nueva propiedad para controlar la visibilidad de la imagen completa
        correctMapping: {
            0: 0, 8: 4, 4: 8, 1: 3, 3: 1, 5: 11, 11: 5, 6: 10, 10: 6, 7: 9, 9: 7, 2: 2
        },
        artworkInfo: {
            title: 'La Noche Estrellada',
            artist: 'Vincent van Gogh',
            year: '1889',
            era: 'Postimpresionismo',
            funFact: 'Van Gogh pintó "La Noche Estrellada" desde la ventana de su habitación en el sanatorio de Saint-Rémy-de-Provence.'
        }
    },
    computed: {
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
            this.showFullImage = true; // Aseguramos que la imagen completa se muestre al entrar en el juego
            this.$nextTick(() => {
                this.initializePuzzle(); // Inicializamos las piezas pero no las mostramos todavía
            });
        },
        hideFullImageAndStartPuzzle() {
            this.showFullImage = false;
        },
        initializePuzzle() {
            this.pieces = [];
            this.slots = [];
            this.winMessage = null;
            this.showFullImage = true; // Reseteamos la visibilidad de la imagen completa
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
                        'background-image': `url(${this.imageSrc})`,
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
                
                const correct = (this.correctMapping[this.draggingPiece.originalIndex] === dropIndex);

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
        }
    }
});