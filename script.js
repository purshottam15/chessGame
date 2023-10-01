const gameBoard = document.querySelector('.gameBoard');
const playerMove = document.querySelector('.changePLayer');
const width = 8;
let playerGo = 'white'
playerMove.textContent = playerGo;


let startPosition = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
]

const createBoard = () => {


    startPosition.forEach((piece, idx) => {
        const square = document.createElement('div');
        square.classList.add('square')
        square.innerHTML = piece;
        square.setAttribute('square-id', idx)
        square.firstChild && square.firstChild.setAttribute('draggable', 'true')

        let row = Math.floor((63 - idx) / 8) + 1;
        if (row % 2 == 0) {
            square.classList.add(idx % 2 == 0 ? 'green' : 'whitesquare')
        }
        else {
            square.classList.add(idx % 2 == 0 ? 'whitesquare' : 'green')
        }

        if (idx < 16) {
            square.firstChild.classList.add('white')
        }
        if (idx > 48) {
            square.firstChild.classList.add('black')
        }


        // square.classList.add('white')



        gameBoard.append(square)

    })
}
createBoard();


let startPositionId;
let dragEle;

let allSquare = document.querySelectorAll('.gameBoard .square');
function dragStart(e) {
    startPositionId = e.target.parentNode.getAttribute('square-id');
    dragEle = e.target;

}
function dragOver(e) {
    e.preventDefault();
}

const changePLayer = () => {
    if (playerGo == 'white') {
        changeId()
        playerGo = "black"
        playerMove.textContent = "black";
    }
    else {
        revertId()
        playerGo = "white"
        playerMove.textContent = "white";

    }

}
const changeId = () => {
    const AllSquares = document.querySelectorAll('.square');
    AllSquares.forEach((ele, id) => {
        ele.setAttribute('square-id', (width * width - 1) - id);
    })
}
const revertId = () => {
    const AllSquares = document.querySelectorAll('.square');
    AllSquares.forEach((ele, id) => {
        ele.setAttribute('square-id', id);
    })
}
const Isvalid = (target) => {
    // console.log(target)
    let starterId = Number(startPositionId);
    let endId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'));
    let piece = dragEle.id;

    console.log(starterId, piece, endId);




    const rowDiff = Math.abs(Math.floor(endId / width) - Math.floor(starterId / width));
    const colDiff = Math.abs((endId % width) - (starterId % width));
    let startRow = Math.floor(starterId / width);
    let endRow = Math.floor(endId / width);






    switch (piece) {
        case 'pawn':
            const starterRow = [8, 9, 10, 11, 12, 13, 14, 15];


            // const isPathBlockedPawn = startPosition.slice(Math.min(starterId, endId) + 1, Math.max(starterId, endId)).some((piece) => piece !== '');

            // if (isPathBlockedPawn) {
            //     return false;
            // }

            if (starterRow.includes(starterId) && starterId + width * 2 === endId || starterId + width === endId || starterId + width - 1 === endId && document.querySelector(`[square-id="${starterId + width - 1}"]`).firstChild || starterId + width + 1 === endId && document.querySelector(`[square-id="${starterId + width + 1}"]`).firstChild) {
                return true;
            }
            break;

        case 'knight':
            if (starterId + width * 2 - 1 == endId ||
                starterId + width * 2 + 1 == endId ||
                starterId + width + 2 == endId ||
                starterId + width - 2 == endId ||
                starterId - width - 2 == endId ||
                starterId - width + 2 == endId ||
                starterId - width * 2 + 1 == endId ||
                starterId - width * 2 - 1 == endId

            ) {
                return true;
            }
            break

        case 'bishop':

            return rowDiff === colDiff;

            
            break;
        case 'rook':

            if ((endId - starterId) % width == 0 || startRow == endRow) {
                return true
            }

        case 'queen':
            if (rowDiff === colDiff || (endId - starterId) % width == 0 || startRow == endRow) {
                return true
            }

        case 'king':
            if (starterId + width == endId || starterId - width == endId || starterId + 1 == endId || starterId - 1 == endId || starterId + width + 1 == endId || starterId + width - 1 == endId || starterId - width + 1 == endId || starterId - width - 1 == endId) {
                return true;
            }



    }
    return false
}
function drop(e) {
    e.stopPropagation();
    // console.log(dragEle);
    const correctGo = dragEle.classList.contains(playerGo);

    const taken = e.target.classList.contains('pieces');
    const apponentGo = playerGo === 'white' ? "black" : 'white';
    // console.log(apponentGo);
    const takenByApponent = e.target.classList.contains(apponentGo);
    let valid = Isvalid(e.target);
    // console.log(valid);


    if (correctGo) {
        if (takenByApponent && valid) {

            e.target.parentNode.append(dragEle);
            e.target.remove();
            changePLayer();
            return;
        }


        if (valid) {

            if (!e.target.firstChild) {
                e.target.append(dragEle);
                changePLayer();
            }








        }
    }



}


allSquare.forEach((piece) => {

    piece.addEventListener('dragstart', dragStart)
    piece.addEventListener('dragover', dragOver)
    piece.addEventListener('drop', drop)
})
