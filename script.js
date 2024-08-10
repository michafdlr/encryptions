const decryptedText = document.getElementById('decrypted-text');
const encryptedText = document.getElementById('encrypted-text');
const encryptBtn = document.getElementById('encrypt-btn');
const decryptBtn = document.getElementById('decrypt-btn');
const keyInput = document.getElementById('key');
const scheibe = document.getElementById('scheibe');

const ctx = scheibe.getContext('2d');
ctx.strokeStyle = 'rgb(0,0,0)';
ctx.lineWidth = "3";
ctx.lineCap='round';

CanvasRenderingContext2D.prototype.fillTextCircle = function(text,x,y,radius,startRotation){
  const numRadsPerLetter = 2*Math.PI / text.length;
  this.save();
  this.translate(x,y);
  this.rotate(startRotation);

  for(let i=0;i<text.length;i++){
     this.save();
     this.rotate(i*numRadsPerLetter);

     this.fillText(text[i],0,-radius);
     this.restore();
  }
  this.restore();
}

const drawScheibe = () => {
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.font = 'bold 25px Montserrat';
  ctx.fillText("außen: Klartext", 0,10);
  ctx.textAlign = 'center';
  ctx.beginPath();
  ctx.fillStyle = 'rgb(255,255,255)';
  ctx.arc(375,250, 240, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.fillStyle = 'rgb(125,125,125)';
  ctx.arc(375,250,180, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(375,250,5,0,2*Math.PI);
  ctx.fillStyle = 'rgb(0,0,0)';
  ctx.fillText("Geheimtext", 375,255);
  ctx.fill();
  ctx.font = 'bold 30px Montserrat';
  ctx.fillTextCircle("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 375, 250, 230, 0);
  ctx.fillTextCircle("ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLowerCase(), 375, 250, 170, 0 - Number(keyInput.value)*2*Math.PI/26);
}


const checkKey = () => {
  const key = Number(keyInput.value)
  if (key<0) {
    keyInput.value = 0;
  } else if (key>25) {
    keyInput.value = key % 25;
  } else {
    keyInput.value = Math.round(key);
  }
}

// Caesar cipher

class Caesar {
  constructor(key, decrypted, encrypted) {
    this.decrypted = decrypted.toLowerCase().replace('ä', 'ae').replace('ö', 'oe').replace('ü','ue');
    this.encrypted = encrypted.toLowerCase();
    this.key = key;
  }

  encrypt() {
    this.encrypted = '';
    for (let i=0; i<this.decrypted.length; i++) {
      const uniLetter = this.decrypted.charCodeAt(i);
      if (uniLetter < 'a'.charCodeAt(0) || uniLetter > 'z'.charCodeAt(0)) {
        this.encrypted = this.encrypted.concat(this.decrypted.charAt(i));
      } else if (uniLetter + this.key > 'z'.charCodeAt(0)) {
        this.encrypted = this.encrypted.concat(String.fromCharCode(uniLetter + this.key - 26));
      } else {
        this.encrypted = this.encrypted.concat(String.fromCharCode(uniLetter + this.key));
      }
    }
  }

  decrypt() {
    this.decrypted = '';
    for (let i=0; i<this.encrypted.length; i++) {
      if (this.encrypted.charCodeAt(i) < 'a'.charCodeAt(0) || this.encrypted.charCodeAt(i) > 'z'.charCodeAt(0)) {
        this.decrypted = this.decrypted.concat(this.encrypted.charAt(i));
      } else if (this.encrypted.charCodeAt(i) - this.key < 'a'.charCodeAt(0)) {
        this.decrypted = this.decrypted.concat(String.fromCharCode(this.encrypted.charCodeAt(i) - this.key + 26));
      } else {
        this.decrypted = this.decrypted.concat(String.fromCharCode(this.encrypted.charCodeAt(i) - this.key));
      }
    }
  }
}



// event listeners
window.addEventListener('load', drawScheibe)


keyInput.addEventListener('change', ()=>{
  checkKey();
  ctx.clearRect(0, 0, 500, 500);
  drawScheibe();
})


encryptBtn.addEventListener('click', () => {
  const caesar = new Caesar(Number(keyInput.value), decryptedText.value, '');
  caesar.encrypt();
  encryptedText.value = caesar.encrypted;
})

decryptBtn.addEventListener('click', () => {
  const caesar = new Caesar(Number(keyInput.value), '', encryptedText.value);
  caesar.decrypt();
  decryptedText.value = caesar.decrypted;
})
