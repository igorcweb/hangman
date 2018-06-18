(function() {
  const hangman = document.querySelector('div.hangman');
  const canvas = document.querySelector('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const message = document.querySelector('.message');
  const button = document.querySelector('button');
  const c = canvas.getContext('2d');
  let blank = 'transparent';
  let mistakes = 0;
  let streak = 0;
  const streakDisplay = document.querySelector('#streak');
  const guessedLetters = [];
  const span = document.createElement('span');
  const guessedHeading = document.getElementById('guessed');
  const questionText = document.querySelector('#questionText');
  const answerText = document.querySelector('#answerText');
  const next = document.querySelector('#next');
  const category = document.querySelector('.category');
  const categoryTitle = document.querySelector('span#category');
  const ul = document.querySelector('ul');
  const lis = document.querySelectorAll('li');
  let answer;

  const game = {
    categories: {
      Books: 'https://opentdb.com/api.php?amount=1&category=10&type=multiple',
      'Computer Science':
        'https://opentdb.com/api.php?amount=1&category=18&type=multiple',
      'General Knowledge':
        'https://opentdb.com/api.php?amount=1&category=9&type=multiple',
      Geography:
        'https://opentdb.com/api.php?amount=1&category=22&type=multiple',
      Film: 'https://opentdb.com/api.php?amount=1&category=11&type=multiple',
      History: 'https://opentdb.com/api.php?amount=1&category=23&type=multiple',
      Music: 'https://opentdb.com/api.php?amount=1&category=12&type=multiple',
      Politics:
        'https://opentdb.com/api.php?amount=1&category=24&type=multiple',
      Sports: 'https://opentdb.com/api.php?amount=1&category=21&type=multiple',
      Television:
        'https://opentdb.com/api.php?amount=1&category=14&type=multiple'
    },

    selectedCategory: 'General Knowledge',

    drawGallows: () => {
      //gallows
      c.beginPath();
      c.lineWidth = 4;
      c.moveTo(0, 320);
      c.lineTo(200, 320);
      c.moveTo(45, 320);
      c.lineTo(45, 50);
      c.lineTo(170, 50);
      c.lineTo(170, 90);
      c.moveTo(70, 50);
      c.lineTo(45, 80);
      c.stroke();
    },

    drawMan: () => {
      //head
      c.beginPath();
      c.arc(170, 112, 20, 0, 2 * Math.PI, true);
      c.strokeStyle =
        mistakes === 1 ? '#ff0000' : mistakes > 1 ? '#000' : blank;
      c.stroke();
      //torso
      c.beginPath();
      c.moveTo(170, 134);
      c.lineTo(170, 185);
      c.strokeStyle =
        mistakes === 2 ? '#ff0000' : mistakes > 2 ? '#000' : blank;
      c.stroke();
      //right leg
      c.beginPath();
      c.moveTo(170, 185);
      c.lineTo(194, 224);
      c.strokeStyle =
        mistakes === 3 ? '#ff0000' : mistakes > 3 ? '#000' : blank;
      c.stroke();
      //left leg
      c.beginPath();
      c.moveTo(170, 185);
      c.lineTo(146, 224);
      c.strokeStyle =
        mistakes === 4 ? '#ff0000' : mistakes > 4 ? '#000' : blank;
      c.stroke();
      //right arm
      c.beginPath();
      c.moveTo(172, 160);
      c.lineTo(199, 155);
      c.strokeStyle =
        mistakes === 5 ? '#ff0000' : mistakes > 5 ? '#000' : blank;
      c.stroke();
      //left arm
      c.beginPath();
      c.moveTo(168, 160);
      c.lineTo(141, 155);
      if (mistakes === 6) {
        c.strokeStyle = '#ff0000';
        c.stroke();
        setTimeout(() => {
          c.moveTo(170, 160);
          c.lineTo(143, 155);
          c.strokeStyle = '#000';
          c.stroke();
          streak = 0;
          streakDisplay.innerHTML = streak;
          answerText.innerHTML = answer;
          message.classList.add('lose');
          button.classList.add('show');
          document.onkeyup = () => {
            game.reset();
          };
        }, 1000);
      } else {
        c.strokeStyle = '#fff';
        c.stroke();
      }
    },

    //I had to make the arms and legs longer in order to erase them completely.
    armsLegsErase: () => {
      //right leg
      c.beginPath();
      c.moveTo(170, 185);
      c.lineTo(197, 227);
      c.strokeStyle = blank;
      c.stroke();
      //left leg
      c.beginPath();
      c.moveTo(170, 185);
      c.lineTo(143, 227);
      c.strokeStyle = blank;
      c.stroke();
      //right arm
      c.beginPath();
      c.moveTo(172, 160);
      c.lineTo(202, 153);
      c.strokeStyle = blank;
      c.stroke();
      //left arm
      c.beginPath();
      c.moveTo(168, 160);
      c.lineTo(138, 153);
      c.strokeStyle = blank;
      c.stroke();
    },

    reset: function() {
      button.classList.remove('show');
      answerText.innerHTML = '';
      mistakes = 0;
      span.innerHTML = '';
      guessedHeading.innerHTML = '';
      guessedLetters.length = 0;
      blank = '#fff';
      message.classList.remove('lose');
      message.classList.remove('win');
      message.classList.remove('survived');
      c.lineWidth = 7;
      this.drawMan();
      this.armsLegsErase();
      c.lineWidth = 4;
      this.getData();
    },

    getData: function() {
      let url = this.categories[this.selectedCategory];
      axios
        .get(url)
        .then(res => {
          const lettersSpaces = /^[a-zA-Z ]+$/;
          answer = res.data.results[0].correct_answer.trim();
          let question = res.data.results[0].question;
          if (
            //Exclude multiple choice questions
            question.includes('of these') ||
            question.includes('the following') ||
            question.includes(' not ') ||
            question.includes(' NOT ') ||
            //Exclude answers that contain non-letter characters
            !answer.match(lettersSpaces) ||
            //Exclude answers that are shorter than 6 letters
            answer.length < 6
          ) {
            this.getData();
          } else {
            console.log('answer: ', answer);
          }

          //Replace answer letters with underscores
          questionText.innerHTML = question;
          let placeholder = answer
            .split('')
            .map(letter => {
              return letter.replace(letter, '_');
            })
            .join('');
          let answerArr = answer.toLowerCase().split('');

          //Add spaces if needed
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

          //Press Enter to skip question
          //This is a game hack.  I don't want the user to know about this unless they figure it out themselves.
          document.onkeyup = event => {
            if (event.keyCode === 13) {
              game.reset();
            }

            let guess = event.key.toLowerCase();
            if (
              //only listen for keys that haven't been guessed
              !guessedLetters.includes(guess) &&
              //only listen for letter keys
              (event.keyCode >= 65 && event.keyCode <= 90)
            ) {
              //Add guessed letters to the array and append them to the page
              guessedLetters.push(guess);
              guessedHeading.innerHTML = 'Guessed Letters: ';

              let guessedLetter = document.createElement('span');
              guessedLetter.textContent = `${guess.toUpperCase()} `;

              // Check if the guess matches one of the letters
              if (answer.toLowerCase().indexOf(guess) !== -1) {
                guessedLetter.setAttribute('class', 'correct');
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

                //Win
                if (placeholder.indexOf('_') === -1) {
                  streak++;
                  streakDisplay.textContent = streak;
                  mistakes === 5
                    ? message.classList.add('survived')
                    : message.classList.add('win');
                  button.classList.add('show');
                  document.onkeyup = function() {
                    game.reset();
                  };
                }
              } else {
                //Lose
                guessedLetter.setAttribute('class', 'wrong');
                mistakes++;
                game.drawMan();
              }
              span.appendChild(guessedLetter);
              guessedHeading.appendChild(span);
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
    hangman.classList.toggle('slide');
  });
  category.addEventListener('mouseover', () => {
    ul.classList.remove('collapsed');
    hangman.classList.add('slide');
  });
  lis.forEach(li => {
    li.addEventListener('click', function() {
      ul.classList.add('collapsed');
      hangman.classList.remove('slide');
      game.selectedCategory = this.dataset.category;
      categoryTitle.innerHTML = game.selectedCategory;
      game.reset();
    });
  });
  document.addEventListener('click', () => {
    ul.classList.add('collapsed');
    hangman.classList.remove('slide');
  });
  const year = document.querySelector('#year');
  year.innerHTML = new Date().getFullYear();
})();
