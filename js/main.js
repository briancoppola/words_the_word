const guessBoard = document.querySelector('.guess-board');
const guessBoardTiles = guessBoard.querySelectorAll('.guess-board__tile');
const keyRows = document.querySelectorAll('.keyboard__row');
const keys = document.querySelectorAll('.keyboard__key');
const alertContainer = document.querySelector('.alert-container');
const backdrop = document.querySelector('.backdrop');
const modal = document.querySelector('.modal');
const modalButton = modal.querySelector('.modal__button');

const ALERT_DURATION = 1000;
const WORD_LENGTH = 5;
const NUMBER_OF_GUESSES = 6;

const gameState = {
  mode: 'play',
  guesses: 0,
  targetWord: '',
  guessedWord: '',
};

/* Alert */

const displayAlert = (message, duration) => {
  const alert = document.createElement('div');
  alert.textContent = message;
  alert.classList.add('alert');
  alertContainer.prepend(alert);

  setTimeout(() => {
    alert.classList.add('hide');
    alert.addEventListener('transitionend', () => {
      alert.remove();
    });
  }, duration);
};

/* Modal */

const displayModal = (message) => {
  backdrop.classList.remove('hidden');
  modal.classList.remove('hidden');
  let modalMessage = modal.querySelector('.modal__message');
  modalMessage.textContent = message;

  let modalWord = modal.querySelector('.modal__word');
  modalWord.textContent = gameState.targetWord;
};

/* User input handlers */

const handleMouseClick = (e) => {
  if (e.target.matches('[data-key]')) {
    inputLetter(e.target.dataset.key);
    return;
  }

  if (e.target.matches('[data-enter]')) {
    submitGuess();
    return;
  }

  if (e.target.matches('[data-delete]')) {
    deleteLetter();
    return;
  }
};

const handleKeyPress = (e) => {
  if (e.key.match(/^[a-zA-Z]$/)) {
    inputLetter(e.key);
    return;
  }

  if (e.key === 'Enter') {
    submitGuess();
    return;
  }

  if (e.key === 'Delete' || e.key === 'Backspace') {
    deleteLetter();
    return;
  }
};

const handleModalKeyPress = (e) => {
  if (e.key === 'Enter') {
    startGame();
  }
};

const getActiveTiles = () => {
  return guessBoard.querySelectorAll('[data-state="active"');
};

/* Input/delete letter tiles */

const inputLetter = (key) => {
  const activeTiles = getActiveTiles();

  if (activeTiles.length < WORD_LENGTH) {
    const nextTile = guessBoard.querySelector(':not([data-letter])');
    nextTile.dataset.letter = key.toLowerCase();
    nextTile.textContent = key;
    nextTile.dataset.state = 'active';
  }
};

const deleteLetter = () => {
  const activeTiles = getActiveTiles();
  const lastTile = activeTiles[activeTiles.length - 1];

  if (lastTile) {
    lastTile.textContent = '';
    delete lastTile.dataset.state;
    delete lastTile.dataset.letter;
  }
};

/* Submit guess */

const submitGuess = () => {
  const activeTiles = [...getActiveTiles()];
  if (activeTiles.length !== WORD_LENGTH) {
    displayAlert('Not enough letters!', ALERT_DURATION);
    return;
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter;
  }, '');

  if (!dictionary.includes(guess)) {
    displayAlert('Word not in dictionary', ALERT_DURATION);
    return;
  }

  updateTiles(activeTiles);

  gameState.guesses++;
  gameState.guessedWord = guess;

  checkForSuccess();

  console.log(gameState.targetWord);
};

/* Update letter tiles */

const updateTiles = (tiles) => {
  let letterCount = {};
  gameState.targetWord.split('').forEach((letter) => {
    letterCount[letter] ? letterCount[letter]++ : (letterCount[letter] = 1);
  });

  tiles.forEach((tile, index) => {
    const letter = tile.dataset.letter;
    const key = document.querySelector(`[data-key='${letter}'i]`); /* i = case insensitive */

    if (letter === gameState.targetWord[index]) {
      tile.dataset.state = 'correct';
      key.classList.add('correct');
      letterCount[letter] -= 1;
    }
  });

  tiles.forEach((tile) => {
    const letter = tile.dataset.letter;
    const key = document.querySelector(`[data-key='${letter}'i]`); /* i = case insensitive */

    if (gameState.targetWord.includes(letter) && tile.dataset.state !== 'correct') {
      if (letterCount[letter] > 0) {
        tile.dataset.state = 'present';
        key.classList.add('present');
        letterCount[letter] -= 1;
      } else {
        tile.dataset.state = 'absent';
        key.classList.add('absent');
      }
    } else if (!gameState.targetWord.includes(letter)) {
      tile.dataset.state = 'absent';
      key.classList.add('absent');
    }
  });
};

/* Game state */

const startGame = () => {
  gameState.mode = 'play';

  cleanUp();
  setNewWord();
  checkGameState();
};

const setNewWord = () => {
  const wordNumber = Math.floor(Math.random() * targetWords.length);

  gameState.targetWord = targetWords[wordNumber];
};

const checkGameState = () => {
  if (gameState.mode === 'play') {
    keyRows.forEach((row) => {
      row.addEventListener('click', handleMouseClick);
    });
    document.addEventListener('keydown', handleKeyPress);
    document.removeEventListener('keydown', handleModalKeyPress);
  }
  if (gameState.mode === 'end') {
    keyRows.forEach((row) => {
      row.removeEventListener('click', handleMouseClick);
    });
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleModalKeyPress);
  }
};

const checkForSuccess = () => {
  if (gameState.guessedWord === gameState.targetWord) {
    endGame('You got it!!!');
    return;
  }

  const emptyTiles = guessBoard.querySelectorAll(':not([data-letter])');

  if (emptyTiles.length === 0) {
    endGame(`Oh no! You missed it!`);
  }
};

const endGame = (message) => {
  gameState.mode = 'end';

  displayModal(message);
  checkGameState();
};

const cleanUp = () => {
  backdrop.classList.add('hidden');
  modal.classList.add('hidden');

  gameState.guesses = 0;
  gameState.targetWord = '';
  gameState.guessedWord = '';

  guessBoardTiles.forEach((tile) => {
    tile.textContent = '';
    tile.dataset.state = '';
    tile.removeAttribute('data-letter');
  });

  keys.forEach((key) => {
    key.classList.remove('correct');
    key.classList.remove('present');
    key.classList.remove('absent');
  });
};

/* Start game */

startGame();
