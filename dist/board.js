export { buildBoard };
function buildBoard(textArray = [], size = 25, hasFreeSpace = true, freeSpaceText = '') {
    // Throw error if size not a square
    if (hasFreeSpace)
        size = size - 1;
    if (!textArray || textArray.length < size)
        throw new Error('Not enough text items');
    function buildBox(text = '', isFree = false) {
        const element = document.createElement('button');
        element.type = 'button';
        element.textContent = text.trim();
        element.title = text.trim();
        element.classList.add('box');
        if (isFree)
            element.classList.add('selected');
        element.addEventListener('click', () => {
            if (isFree)
                return;
            element.classList.toggle('selected');
            _isSelected = !_isSelected;
        });
        let _isSelected = false;
        return {
            element,
            isFree,
            get isSelected() {
                return isFree || _isSelected;
            },
            set isSelected(v) {
                _isSelected = !!v;
                this.element.classList[_isSelected ? 'add' : 'remove']('selected');
                console.log(BOARD.isVictory);
            },
            get text() {
                return this.element.textContent?.trim() ?? '';
            },
            set text(v) {
                // Could create a shuffling effect by running the randomizer a handful of times using this
                this.element.textContent = v ? v.trim() : '';
            }
        };
    }
    const element = document.createElement('div');
    const boxes = textArray.slice(0, size).map(text => buildBox(text)); // Slice shouldn't be necessary if controlled
    if (hasFreeSpace) {
        let freeSpaceIndex = size / 2;
        if (freeSpaceIndex % 2 !== 0)
            freeSpaceIndex = freeSpaceIndex - 2;
        boxes.splice(freeSpaceIndex, 0, buildBox(freeSpaceText ? freeSpaceText : 'Free', true));
    }
    element.style.gridTemplateColumns = `repeat(${Math.sqrt(boxes.length)}, 1fr)`; // Set the number of columns based on sqrt
    element.classList.add('board');
    element.append(...boxes.map(b => b.element));
    const winConditions = winConditionArrays(boxes.length);
    const BOARD = {
        element,
        boxes,
        playerName: 'Stephen',
        get isVictory() {
            // Is victory if any array in the 2D array contains all selected
            return winConditions.some(arr => arr.every(i => boxes[i].isSelected));
        }
    };
    return BOARD;
}
function winConditionArrays(boardSize) {
    // Returns 2D array containing each possible bingo - Pass in board size (total number of squares)
    // Win length will always be sqrt of board total
    const length = Math.sqrt(boardSize);
    let start = 0;
    // Array of possible row wins
    const rows = Array.from({ length }, () => {
        const subArray = Array.from({ length }, (_, i) => i + start);
        start = subArray[subArray.length - 1] + 1;
        return subArray;
    });
    start = 0;
    // Array of possible column wins
    const columns = Array.from({ length }, () => {
        const subArray = Array.from({ length }, (_, i) => i * length + start);
        start += 1;
        return subArray;
    });
    // Plus two possible diagonal wins
    const diagonal1 = Array.from({ length }, (_, i) => ((length * i) + i));
    const diagonal2 = Array.from({ length }, (_, i) => ((length * (i + 1)) - (i + 1)));
    // Merge into 2D array and return
    const conditionArray = [...rows, ...columns, diagonal1, diagonal2];
    return conditionArray;
}
