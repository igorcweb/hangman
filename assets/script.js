const canvas = document.querySelector('canvas');
const message = document.querySelector('.message');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mistakes = 0;

let blank = 'transparent';

const c = canvas.getContext('2d');

//gallows
c.beginPath();
c.lineWidth = 10;
c.moveTo(750, 600);
c.lineTo(1160, 600);
c.moveTo(850, 600);
c.lineTo(850, 100);
c.lineTo(1100, 100);
c.lineTo(1100, 180);
c.moveTo(905, 100);
c.lineTo(850, 160);
c.stroke();
function drawMan() {
  //head
  c.beginPath();
  c.arc(1100, 220, 40, 0, 2 * Math.PI, true);
  c.strokeStyle = mistakes === 1 ? '#ff0000' : mistakes > 1 ? '#000' : blank;
  c.stroke();
  //torso
  c.beginPath();
  c.moveTo(1100, 265);
  c.lineTo(1100, 350);
  c.strokeStyle = mistakes === 2 ? '#ff0000' : mistakes > 2 ? '#000' : blank;
  c.stroke();
  //right leg
  c.beginPath();
  c.moveTo(1100, 348);
  c.lineTo(1150, 415);
  c.strokeStyle = mistakes === 3 ? '#ff0000' : mistakes > 3 ? '#000' : blank;
  c.stroke();
  //left leg
  c.beginPath();
  c.moveTo(1100, 348);
  c.lineTo(1050, 415);
  c.strokeStyle = mistakes === 4 ? '#ff0000' : mistakes > 4 ? '#000' : blank;
  c.stroke();
  //right arm
  c.beginPath();
  c.moveTo(1104, 300);
  c.lineTo(1155, 290);
  c.strokeStyle = mistakes === 5 ? '#ff0000' : mistakes > 5 ? '#000' : blank;
  c.stroke();
  //left arm
  c.beginPath();
  c.moveTo(1096, 300);
  c.lineTo(1045, 290);
  if (mistakes === 6) {
    c.strokeStyle = '#ff0000';
    c.stroke();
    setTimeout(function () {
      c.moveTo(1100, 300);
      c.lineTo(1050, 290);
      c.strokeStyle = '#000';
      c.stroke();
      answerText.innerHTML = correctAnswer;
      message.classList.add('lose');
    }, 1000);
  } else {
    c.strokeStyle = '#fff';
    c.stroke();
  }
}

drawMan();

const url = 'https://opentdb.com/api.php?amount=1&category=12&type=multiple';
const question = document.querySelector('#question');
const answer = document.querySelector('#answer');
const answerText = document.querySelector('#answerText');
const next = document.querySelector('#next');
let correctAnswer;
function getData() {
  axios
    .get(url)
    .then(res => {
      const letters = /^[A-Za-z]+$/;
      let answer = res.data.results[0].correct_answer;
      if (!(answer.match(letters))) {
        getData();
      }
      let answerArr = answer.toLowerCase().split('');
      if (answer.length >= 6) {
        correctAnswer = res.data.results[0].correct_answer;
      } else {
        getData();
      }
      question.innerHTML = res.data.results[0].question;
      let placeholder = answer
        .split('')
        .map(letter => {
          return letter.replace(letter, '_');
        })
        .join('');
      answerText.innerHTML = placeholder;
      let placeholderArr = placeholder.split('');
      document.onkeyup = function (event) {
        if (event.keyCode === 13) {
          reset();
          return;
        }
        let guess = event.key;
        if (answer.toLowerCase().indexOf(guess) !== -1) {
          indexArr = [];
          for (let i = 0; i < answerArr.length; i++) {
            if (answerArr[i] === guess) {
              indexArr.push(i);
            }
          }
          console.log('indexArr: ', indexArr);
          console.log('guess: ', guess);
          console.log('p1 array: ', placeholder.split(''));

          indexArr.forEach(number => {
            placeholderArr.splice(number, 1, guess);
          });

          console.log(
            'p2: ',
            placeholderArr.splice(0, 1, placeholderArr[0].toUpperCase())
          );
          placeholder = placeholderArr.join('');
          console.log('the real placeholder: ', placeholder);
          answerText.innerHTML = placeholder;
          if (placeholder.indexOf('_') === -1) {
            message.classList.add('win');
          }
        } else {
          mistakes++;
          drawMan();
        }
        console.log('answer: ', answer);
      };
    })
    .catch(error => {
      console.log(error);
    });
}
getData();
next.addEventListener('click', () => {
  reset();
});

function reset() {
  answerText.innerHTML = '';
  mistakes = 0;
  blank = '#fff';
  message.classList.remove('lose');
  message.classList.remove('win');
  c.lineWidth = 13;
  drawMan();
  c.lineWidth = 10;
  getData();
}

// const arr = [1, 2, 3, 4, 2, 3, 4, 7, 5, 8, 9];

// arr.reduce((indexArr, num, index) => {
//   if (num === 2) indexArr.push(index);
//   return indexArr;
// }, []);
