const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var mistakes = 0;

const c = canvas.getContext('2d');

//gallows
c.beginPath();
c.lineWidth = 10;
c.moveTo(150, 600);
c.lineTo(350, 600);
c.moveTo(250, 600);
c.lineTo(250, 100);
c.lineTo(500, 100);
c.lineTo(500, 150);
c.moveTo(300, 100);
c.lineTo(250, 155);
c.stroke();
//head
c.beginPath();
c.arc(500, 190, 40, 0, 2 * Math.PI, true);
c.strokeStyle =
  mistakes === 1 ? '#ff0000' : mistakes > 1 ? '#000' : 'transparent';
c.stroke();
//torso
c.beginPath();
c.moveTo(500, 235);
c.lineTo(500, 320);
c.strokeStyle =
  mistakes === 2 ? '#ff0000' : mistakes > 2 ? '#000' : 'transparent';
c.stroke();
//right leg
c.beginPath();
c.moveTo(500, 318);
c.lineTo(550, 385);
c.strokeStyle =
  mistakes === 3 ? '#ff0000' : mistakes > 3 ? '#000' : 'transparent';
c.stroke();
//left leg
c.beginPath();
c.moveTo(500, 318);
c.lineTo(450, 385);
c.strokeStyle =
  mistakes === 4 ? '#ff0000' : mistakes > 4 ? '#000' : 'transparent';
c.stroke();
//right arm
c.beginPath();
c.moveTo(504, 270);
c.lineTo(555, 260);
c.strokeStyle =
  mistakes === 5 ? '#ff0000' : mistakes > 5 ? '#000' : 'transparent';
c.stroke();
//left arm
c.beginPath();
c.moveTo(496, 270);
c.lineTo(445, 260);
if (mistakes === 6) {
  c.strokeStyle = '#ff0000';
  c.stroke();
  setTimeout(function() {
    c.moveTo(500, 270);
    c.lineTo(450, 260);
    c.strokeStyle = '#000';
    c.stroke();
  }, 2000);
}
