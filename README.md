# words_the_word
A JavaScript word game that's REALLY similar to another popular word game you may have seen.

## Description
This is an effort to re-create the amazing Wordle app that's been sweeping the universe since 2021. It plays exactly the same, as the game player has six tries to guess a target five-letter word randomly chosen by the app. Each unsuccessful guess will reveal whether each letter in the guessed word is present in the target word, and if so, if the letter is in the same location as in the target word. A successful guess of the target word ends the game immediately as a victory, and a failure to guess the target word after six guesses ends in a loss.

## Features

- Game is playable with both the player's physical keyboard and the keyboard interface in the game
- A target word .js file that the game randomly pulls a word from with each game
- A dictionary .js file that's used to test if the player's guess is a real word 
- Temporary timed error pop-ups that alert the player if the guess word is either not in the dictionary or is shorter than five letters
- End-of-game modal that tells the user that they've won or lost, displays the target word, and adds a 'Play again' button

## Screenshot

![screenshot](https://user-images.githubusercontent.com/58447266/194783479-865c131e-d626-4ea4-b6e3-362a7ca81c90.png)

## Setup
To run this project, download all files to a new folder and install it locally using npm:

```
$ cd ../[new folder]
$ npm install
$ npm start
```

## To Do
- Add flip/pulse tile animations that are used on the Wordle site
- Tighten the responsiveness of the app so the game looks better on smaller screens
- Add an intro page (or modal) that explains the game and the rules
- Add game result tracking data in the modal that allows the player to view game performance history
