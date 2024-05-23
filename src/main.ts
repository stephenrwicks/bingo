import { buildBoard } from './board'


function getRandomizedSubArray(array: Array<string>, length: number): Array<string> {
    function shuffleArray(array: Array<string>) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }
      return shuffleArray(array).slice(0, length);
}


function startScreen() {
    const main = document.createElement('main');
    const startButton = document.createElement('button');
    startButton.textContent = 'Start';
    document.body.append(main);

}

 