(function() {
  const body = document.querySelector('body');
  const canvas = document.querySelector('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const message = document.querySelector('.message');
  const button = document.querySelector('button');
  const c = canvas.getContext('2d');
  let blank = 'transparent';
  let mistakes = 0;
  const usedLetters = [];
  const span = document.createElement('span');
  const h3 = document.getElementById('used');
  const questionText = document.querySelector('#questionText');
  const answerText = document.querySelector('#answerText');
  const next = document.querySelector('#next');
  const category = document.querySelector('.category');
  const categoryTitle = document.querySelector('span#category');
  const ul = document.querySelector('ul');
  const lis = document.querySelectorAll('li');
  let correctAnswer;

  const categories = {
    Books: 'https://opentdb.com/api.php?amount=1&category=10&type=multiple',
    'Computer Science':
      'https://opentdb.com/api.php?amount=1&category=18&type=multiple',
    'General Knowledge':
      'https://opentdb.com/api.php?amount=1&category=9&type=multiple',
    Geography: 'https://opentdb.com/api.php?amount=1&category=22&type=multiple',
    Film: 'https://opentdb.com/api.php?amount=1&category=11&type=multiple',
    History: 'https://opentdb.com/api.php?amount=1&category=23&type=multiple',
    Music: 'https://opentdb.com/api.php?amount=1&category=12&type=multiple',
    Politics: 'https://opentdb.com/api.php?amount=1&category=24&type=multiple',
    Sports: 'https://opentdb.com/api.php?amount=1&category=21&type=multiple',
    Television: 'https://opentdb.com/api.php?amount=1&category=14&type=multiple'
  };

  const game = {
    selectedCategory: 'General Knowledge',
    drawGallows: function() {
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
    },
    drawMan: function() {
      //head
      c.beginPath();
      c.arc(350, 220, 40, 0, 2 * Math.PI, true);
      c.strokeStyle =
        mistakes === 1 ? '#ff0000' : mistakes > 1 ? '#000' : blank;
      c.stroke();
      //torso
      c.beginPath();
      c.moveTo(350, 265);
      c.lineTo(350, 350);
      c.strokeStyle =
        mistakes === 2 ? '#ff0000' : mistakes > 2 ? '#000' : blank;
      c.stroke();
      //right leg
      c.beginPath();
      c.moveTo(350, 348);
      c.lineTo(400, 415);
      c.strokeStyle =
        mistakes === 3 ? '#ff0000' : mistakes > 3 ? '#000' : blank;
      c.stroke();
      //left leg
      c.beginPath();
      c.moveTo(348, 348);
      c.lineTo(300, 415);
      c.strokeStyle =
        mistakes === 4 ? '#ff0000' : mistakes > 4 ? '#000' : blank;
      c.stroke();
      //right arm
      c.beginPath();
      c.moveTo(354, 300);
      c.lineTo(405, 290);
      c.strokeStyle =
        mistakes === 5 ? '#ff0000' : mistakes > 5 ? '#000' : blank;
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
          c.lineTo(295, 290);
          c.strokeStyle = '#000';
          c.stroke();
          answerText.innerHTML = correctAnswer;
          message.classList.add('lose');
          button.classList.add('show');
          document.onkeyup = function() {
            game.reset();
          };
        }, 1000);
      } else {
        c.strokeStyle = '#fff';
        c.stroke();
      }
    },
    reset: function() {
      button.classList.remove('show');
      answerText.innerHTML = '';
      mistakes = 0;
      span.innerText = '';
      h3.innerText = '';
      usedLetters.length = 0;
      blank = '#fff';
      message.classList.remove('lose');
      message.classList.remove('win');
      message.classList.remove('survived');
      c.lineWidth = 13;
      this.drawMan();
      c.lineWidth = 10;
      this.getData();
    },
    getData: function() {
      let url = categories[this.selectedCategory];
      console.log('url:', url);
      axios
        .get(url)
        .then(res => {
          //Exclude answers that contain non-letter characters
          const lettersSpaces = /^[a-zA-Z ]+$/;
          let answer = res.data.results[0].correct_answer.trim();
          console.log('answer: ', answer);
          if (!answer.match(lettersSpaces)) {
            this.getData();
          }

          //Only use answers that are at least 6-letters-long
          if (answer.length >= 6) {
            correctAnswer = res.data.results[0].correct_answer;
          } else {
            this.getData();
          }
          let question = res.data.results[0].question;

          // Exclude multiple choice questions
          if (
            question.includes('Which of these') ||
            question.includes('the following') ||
            question.includes(' not ')
          ) {
            this.getData();
          }

          //Replace letters with underscores
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

          //Add spaces if needed
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

          //Press Enter to skip question
          document.onkeyup = function(event) {
            if (event.keyCode === 13) {
              game.reset();
              return;
            }

            let guess = event.key;
            if (
              //only listen for keys that haven't been used
              !usedLetters.includes(guess) &&
              //only listen for letter keys
              (event.keyCode >= 65 && event.keyCode <= 90)
            ) {
              //Append used letters to the page and add them to the array
              usedLetters.push(guess);
              h3.innerText = 'Used Letters: ';
              let usedLetter = document.createTextNode(
                `${guess.toUpperCase()} `
              );
              span.appendChild(usedLetter);
              h3.appendChild(span);

              // Check if the guess matches one of the letters
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

                //Capitalize the first letter of the answer
                placeholderArr.splice(0, 1, placeholderArr[0].toUpperCase());

                placeholder = placeholderArr.join('');
                answerText.innerHTML = placeholder;
                if (placeholder.indexOf('_') === -1) {
                  mistakes === 5
                    ? message.classList.add('survived')
                    : message.classList.add('win');
                  button.classList.add('show');
                  document.onkeyup = function() {
                    game.reset();
                  };
                }
              } else {
                mistakes++;
                game.drawMan();
              }
            }
          };
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  game.drawGallows();
  game.getData();
  next.addEventListener('click', () => {
    game.reset();
  });
  //Select Category
  category.addEventListener('click', e => {
    e.stopPropagation();
    ul.classList.toggle('collapsed');
  });
  category.addEventListener('mouseover', () => {
    ul.classList.toggle('collapsed');
  });
  lis.forEach(li => {
    li.addEventListener('click', function() {
      ul.classList.add('collapsed');
      console.log('game: ', game);
      game.selectedCategory = this.dataset.category;
      console.log('selectedCategory: ', game.selectedCategory);
      categoryTitle.innerText = game.selectedCategory;
      console.log('categoryTitle: ', categoryTitle);
      game.reset();
    });
  });
  body.addEventListener('click', () => {
    ul.classList.add('collapsed');
  });
})();
