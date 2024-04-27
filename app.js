const Constants = {
  div: "div",
  valid: "valid",
  square: "square",
  bomb: "bomb",
  checked: "checked",
  flag: "flag",
  one: "one",
  two: "two",
  three: "three",
  seven: "seven",

  four: "four",
};

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const flagsLeft = document.querySelector("#flags");
  const result = document.querySelector("#result");
  const boardWidth = 10;
  let bombs = 20;
  let flags = 0;
  let squares = [];
  let isGameOver = false;

  const createBoard = () => {
    flagsLeft.innerHTML = bombs;

    // Shuffled bombs array
    const bombsArray = Array(bombs).fill(Constants.bomb);
    const emptyArray = Array(boardWidth * boardWidth - bombs).fill(
      Constants.valid
    );
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < boardWidth * boardWidth; i++) {
      const square = document.createElement(Constants.div);
      square.classList.add(Constants.square);
      square.classList.add(shuffledArray[i]);
      square.id = i;
      grid.appendChild(square);
      squares.push(square);

      // normal click
      square.addEventListener("click", () => {
        click(square);
      });

      // control and add flag
      square.addEventListener("contextmenu", () => {
        addFlag(square);
      });
    }

    // add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % boardWidth === 0;
      const isRightEdge = i % boardWidth === boardWidth - 1;
      if (squares[i].classList.contains(Constants.valid)) {
        if (
          i > 0 &&
          !isLeftEdge &&
          squares[i - 1].classList.contains(Constants.bomb)
        )
          total++;
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - boardWidth].classList.contains(Constants.bomb)
        )
          total++;
        if (
          i > 10 &&
          squares[i - boardWidth].classList.contains(Constants.bomb)
        )
          total++;
        if (
          i > 11 &&
          !isLeftEdge &&
          squares[i - boardWidth - 1].classList.contains(Constants.bomb)
        )
          total++;
        if (
          i < 99 &&
          !isRightEdge &&
          squares[i + 1].classList.contains(Constants.bomb)
        )
          total++;
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i - 1 + boardWidth].classList.contains(Constants.bomb)
        )
          total++;
        if (
          i < 88 &&
          !isRightEdge &&
          squares[i + 1 + boardWidth].classList.contains(Constants.bomb)
        )
          total++;
        if (
          i < 89 &&
          squares[i + boardWidth].classList.contains(Constants.bomb)
        )
          total++;

        squares[i].setAttribute("data", total);
      }
    }
  };
  createBoard();

  const addFlag = (square) => {
    if (isGameOver) return;
    if (!square.classList.contains(Constants.checked) && flags < bombs)
      if (!square.classList.contains(Constants.flag)) {
        square.classList.add(Constants.flag);
        flags++;
        square.innerHTML = "🚩";
        flagsLeft.innerHTML = bombs - flags;
        checkWin();
      } else {
        square.classList.remove(Constants.flag);
        flags--;
        square.innerHTML = "";
        flagsLeft.innerHTML = bombs - flags;
      }
  };

  const click = (square) => {
    if (
      isGameOver ||
      square.classList.contains(Constants.checked) ||
      square.classList.contains(Constants.flag)
    )
      return;

    if (square.classList.contains(Constants.bomb)) gameOver();
    else {
      let total = square.getAttribute("data");
      if (total != 0) {
        if (total == 1) square.classList.add(Constants.one);
        if (total == 2) square.classList.add(Constants.two);
        if (total == 3) square.classList.add(Constants.three);
        if (total == 4) square.classList.add(Constants.four);
        square.innerHTML = total;
        return;
      }
      checkSquare(square);
    }
    square.classList.add(Constants.checked);
  };

  const checkSquare = (square) => {
    const currentId = parseInt(square.id);
    const isLeftEdge = currentId % boardWidth === 0;
    const isRightEdge = currentId % boardWidth === boardWidth - 1;

    let timer = setTimeout(() => {
      clearTimeout(timer);
      let newId;
      if (currentId > 0 && !isLeftEdge) newId = squares[currentId - 1].id;
      if (currentId > 9 && !isRightEdge)
        newId = squares[currentId + 1 - boardWidth].id;
      if (currentId > 10) newId = squares[currentId - boardWidth].id;
      if (currentId > 11 && !isLeftEdge) newId = squares[currentId - 1].id;
      if (currentId < 98 && !isRightEdge) newId = squares[currentId + 1].id;
      if (currentId < 90 && !isLeftEdge)
        newId = squares[currentId - 1 + boardWidth].id;
      if (currentId < 88 && !isRightEdge)
        newId = squares[currentId + 1 + boardWidth].id;
      if (currentId < 89) newId = squares[currentId + boardWidth].id;
      const newSquare = document.getElementById(newId);
      click(newSquare);
    }, 10);
  };

  const checkWin = () => {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains(Constants.flag) &&
        squares[i].classList.contains(Constants.bomb)
      )
        matches++;
      if (matches === bombs) {
        result.innerHTML = "You Win!!!";
        isGameOver = true;
      }
    }
  };

  const gameOver = () => {
    result.innerHTML = "Boom!!! Game Over";
    isGameOver = true;

    squares.forEach((square) => {
      if (square.classList.contains(Constants.bomb)) {
        square.innerHTML = "💣";
        square.classList.remove(Constants.bomb);
        square.classList.add(Constants.checked);
      }
    });
  };
});
