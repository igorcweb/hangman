(function() {
  const canvas = document.querySelector('canvas');
  const message = document.querySelector('.message');
  const button = document.querySelector('button');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const c = canvas.getContext('2d');
  let blank = 'transparent';
  let mistakes = 0;

  //gallows
  c.beginPath();
  c.lineWidth = 10;
  c.moveTo(0, 600);
  c.lineTo(410, 600);
  c.moveTo(100, 600);
  c.lineTo(100, 100);
  c.lineTo(350, 100);
  c.lineTo(350, 185);
  c.moveTo(155, 100);
  c.lineTo(100, 160);
  c.stroke();

  function drawMan() {
    //head
    c.beginPath();
    c.arc(350, 220, 40, 0, 2 * Math.PI, true);
    c.strokeStyle = mistakes === 1 ? '#ff0000' : mistakes > 1 ? '#000' : blank;
    c.stroke();
    //torso
    c.beginPath();
    c.moveTo(350, 265);
    c.lineTo(350, 350);
    c.strokeStyle = mistakes === 2 ? '#ff0000' : mistakes > 2 ? '#000' : blank;
    c.stroke();
    //right leg
    c.beginPath();
    c.moveTo(350, 348);
    c.lineTo(400, 415);
    c.strokeStyle = mistakes === 3 ? '#ff0000' : mistakes > 3 ? '#000' : blank;
    c.stroke();
    //left leg
    c.beginPath();
    c.moveTo(348, 348);
    c.lineTo(300, 415);
    c.strokeStyle = mistakes === 4 ? '#ff0000' : mistakes > 4 ? '#000' : blank;
    c.stroke();
    //right arm
    c.beginPath();
    c.moveTo(354, 300);
    c.lineTo(405, 290);
    c.strokeStyle = mistakes === 5 ? '#ff0000' : mistakes > 5 ? '#000' : blank;
    c.stroke();
    //left arm
    c.beginPath();
    c.moveTo(346, 300);
    c.lineTo(295, 290);
    if (mistakes === 6) {
      c.strokeStyle = '#ff0000';
      c.stroke();
      setTimeout(function() {
        c.moveTo(346, 300);
        c.lineTo(300, 290);
        c.strokeStyle = '#000';
        c.stroke();
        answerText.innerHTML = correctAnswer;
        message.classList.add('lose');
        button.classList.add('show');
        document.onkeyup = function() {
          reset();
        };
      }, 1000);
    } else {
      c.strokeStyle = '#fff';
      c.stroke();
    }
  }

  const url = 'https://opentdb.com/api.php?amount=1&category=12&type=multiple';
  const questionText = document.querySelector('#questionText');
  const answerText = document.querySelector('#answerText');
  const next = document.querySelector('#next');
  let correctAnswer;
  function getData() {
    axios
      .get(url)
      .then(res => {
        //Exclude answers that contain non-letter characters
        const letters = /^[a-zA-Z ]+$/;
        let answer = res.data.results[0].correct_answer.trim();
        console.log('answer: ', answer);
        if (!answer.match(letters)) {
          getData();
        }

        if (answer.length >= 6) {
          correctAnswer = res.data.results[0].correct_answer;
        } else {
          getData();
        }
        let question = res.data.results[0].question;

        // Exclude multiple choice questions
        if (
          question.includes('Which of these') ||
          question.includes('the following')
        ) {
          getData();
        }

        questionText.innerHTML = question;
        let placeholder = answer
          .split('')
          .map(letter => {
            return letter.replace(letter, '_');
          })
          .join('');
        let answerArr = answer.toLowerCase().split('');
        spaceIndexArr = [];
        let placeholderArr = placeholder.split('');
        if (answer.indexOf(' ') !== -1) {
          for (let i = 0; i < answerArr.length; i++) {
            if (answerArr[i] === ' ') {
              spaceIndexArr.push(i);
            }
          }
          spaceIndexArr.forEach(index => {
            placeholderArr.splice(index, 1, ' ');
          });
        }

        placeholder = placeholderArr.join('');

        answerText.innerHTML = placeholder;

        document.onkeyup = function(event) {
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

            indexArr.forEach(index => {
              placeholderArr.splice(index, 1, guess);
            });

            //Capitalize letters following a space
            if (spaceIndexArr.length > 0) {
              spaceIndexArr.forEach(index => {
                placeholderArr.splice(
                  index + 1,
                  1,
                  placeholderArr[index + 1].toUpperCase()
                );
              });
            }

            //Capitalize the first letter of the answer array
            placeholderArr.splice(0, 1, placeholderArr[0].toUpperCase());

            placeholder = placeholderArr.join('');
            answerText.innerHTML = placeholder;
            if (placeholder.indexOf('_') === -1) {
              message.classList.add('win');
              button.classList.add('show');
              document.onkeyup = function() {
                reset();
              };
            }
          } else {
            mistakes++;
            drawMan();
          }
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
    button.classList.remove('show');
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
})();
