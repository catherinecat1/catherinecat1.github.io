// CharNode Class
function CharNode (x, y, char, size, font, clr) {
  this.initPos = new Point(x, y);
  this.currPos = new Point(x, y);
  this.char = char || randomChar();
  this.baseSize = size || 10;
  this.size = this.baseSize;
  this.distFromInitPos = 0;
  this.lensMag = 0;
  this.isBold = false;
  this.fontName = font || 'Arial';
  this.clr = clr || '#000';
  this.lensRadius = 160; //80
  this.isDrawEmptyChar = false;
}

CharNode.prototype.calcNewPos = function(lensDisposition) {
  var distX = mouseX - this.initPos.x;
  var distY = mouseY - this.initPos.y;

  // distance to mouse
  this.distFromInitPos = Math.sqrt(distX * distX + distY * distY);
  this.lensMag = 0;

  if (this.distFromInitPos >= this.lensRadius) {
    // char outside of 'sphere'
    this.currPos.x = this.initPos.x;
    this.currPos.y = this.initPos.y;
  } else {
    // char inside of 'sphere'
    var lensDisp = 1 + Math.cos(Math.PI * Math.abs(this.distFromInitPos / this.lensRadius));
    this.currPos.x = this.initPos.x - lensParams.magAmount * distX * lensDisp / 2;
    this.currPos.y = this.initPos.y - lensParams.magAmount * distY * lensDisp / 2;
    // this.currPos.x = this.initPos.x - distX * lensDisp; this.currPos.y = this.initPos.y - distY * lensDisp;

    this.lensMag = lensParams.magAmount * (1 - Math.sin(Math.PI * Math.abs(this.distFromInitPos / this.lensRadius) / 2));
  }

  this.size = this.baseSize * (this.lensMag + 1);

  return this;
};

CharNode.prototype.setPos = function(x, y) {
  this.initPos.reset(x, y);

  return this;
};

CharNode.prototype.drawLine = function() {
  if (!(this.char == ' ' && !this.isDrawEmptyChar)) {
    if (this.distFromInitPos <= this.lensRadius) {
      var lineOpacity = map(this.distFromInitPos, 0, this.lensRadius, 200, 0);

      push();
      stroke(180, lineOpacity);
      line(this.initPos.x, this.initPos.y, this.currPos.x, this.currPos.y);
      pop();
    }
  }

  return this;
};

CharNode.prototype.drawChar = function () {
  if (!(this.char == ' ' && !this.isDrawEmptyChar)) {
    push();
    textAlign(CENTER, CENTER);
    fill(this.clr);
    textFont(this.fontName, this.size);
    text(this.char, this.currPos.x, this.currPos.y);
    pop();
  }

  return this;
};

// GridCorners Class
/**
 *
 * @param startPoint - left top point
 * @param endPoint - right bottom point
 * @param rowCount - count of grid point on row
 * @param colCount - count of grid point on column
 * @returns {{startPoint: Point, endPoint: Point, charsByRow: number, charsByCol: number, xStep: number, yStep: number}}
 */
function GridCorners(startPoint, endPoint, colCount, rowCount){
  this.startPoint = startPoint;
  this.endPoint = endPoint;
  this.rowCount = parseInt(rowCount);
  this.colCount = parseInt(colCount);
  this.width = Math.abs(this.endPoint.x - this.startPoint.x);
  this.height = Math.abs(this.endPoint.y - this.startPoint.y);
  this.colStep = (this.width  / (this.colCount - 1)) || .00001;
  this.rowStep = (this.height / (this.rowCount - 1)) || .00001;
}

GridCorners.prototype.reset = function(startPoint, endPoint, rowCount, colCount) {
  this.constructor(startPoint, endPoint, rowCount, colCount);

  return this;
};

GridCorners.prototype.traverse = function (inFuncToExec) {
  for (var rowPos = 0; rowPos < this.rowCount; ++rowPos) {
    for (var colPos = 0; colPos < this.colCount; ++colPos) {
      var index = rowPos * this.colCount + colPos;
      inFuncToExec(colPos * this.colStep + this.startPoint.x, rowPos * this.rowStep + this.startPoint.y, index);
    }
  }

  return this;
};

GridCorners.prototype.drawBorder = function(color) {
  push();
  stroke(color || 0);
  noFill();
  rect(gridSurf.startPoint.x, gridSurf.startPoint.y, gridSurf.width, gridSurf.height);
  pop();

  return this;
};

var isRandShiftPos = false;
var isRandLensAmount = false;
var lensParams = {
  radius: 40,
  magAmount: 1,
  magAddition: 1
};
var baseTextSize = 5;
var border = 25;

var fontForChar = 'Arial';
var fontForSpecialChar = 'Arial Black';
var centersText = ['Data Visualization Designer & Web Developer', 'Liu Yngchen', 'Data Science','Data Visualization', 'Front-end & Full-stack', 'Web designer' ];
var textForRandomChars = [
   'My name is Liu Yingchen. I am a second-year graduate student at Southeast University. I am also a data visualization designer and web developer with extensive project experience. I have a solid foundation in signal processing, information theory, and computer science, as well as abundent design and programming skills. I admire the wisdom of thinking and enjoy the joy of practice. I believe that data mining and data visualization are guiding and changing human perceptions of themselves and the world. In the team work, I am very willing to communicate with other engineers, and I am very happy to listen to the needs and suggestions of domain experts and other users. I am looking forward to joining your team!My name is Liu Yingchen. I am a second-year graduate student at Southeast University. I am also a data visualization designer and web developer with extensive project experience. I have a solid foundation in signal processing, information theory, and computer science, as well as abundent design and programming skills. I admire the wisdom of thinking and enjoy the joy of practice. I believe that data mining and data visualization are guiding and changing human perceptions of themselves and the world. In the team work, I am very willing to communicate with other engineers, and I am very happy to listen to the needs and suggestions of domain experts and other users. I am looking forward to joining your team!'
  //'()$',
  //'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ'
];

var charsArr = [];
var gridSurf;

function setup() {
  createCanvas(windowWidth - 20, 250);
  translate((windowWidth - width) / 2, (windowHeight - height) / 2);
  initSetupsForCharsGrid(20, 60, centersText[0], textForRandomChars[0]);
}

function draw() {
  //background(238);
  background(color(255,255,255))
  lensParams.magAmount = (lensParams.magAmount + lensParams.magAddition) / 2;

  charsArr.forEach(function(charNodeItem){ charNodeItem.calcNewPos().drawLine(); });
  charsArr.forEach(function(charNodeItem){ charNodeItem.drawChar(); });
}

function mousePressed () {
  lensParams.magAddition = 4;
}

function mouseReleased () {
  lensParams.magAddition = 2;
}

function keyPressed () {
  switch (key.toLowerCase()) {
    case 'a': {
      initSetupsForCharsGrid(random(5, 35), random(5, 35), centersText[~~random(centersText.length)], textForRandomChars[~~random(textForRandomChars.length)]);
      break;
    }
    case 'x': {
      isRandShiftPos = true;
      gridSurf.traverse(function (x, y, index) {
        charsArr[index].setPos(x + random(-5, 5), y + random(-5, 5));
      });
      break;
    }
    case 'z': {
      isRandLensAmount = true;
      gridSurf.traverse(function (x, y, index) {
        charsArr[index].lensRadius = random(30, 120);
      });
      break;
    }
    case 'c': {
      isRandLensAmount = false;
      isRandShiftPos = false;
      gridSurf.traverse(function (x, y, index) {
        charsArr[index].setPos(x, y);
        charsArr[index].lensRadius = lensParams.radius;
      });
      break;
    }
  }
}

function initSetupsForCharsGrid(rowCount, colCount, centerText, strForRandomChars) {
  rowCount = ~~rowCount;
  colCount = ~~colCount;
  charsArr.length = 0;
  centerText = centerText.split('');

  // for properly colCount size for centering text in horizontal position
  if (colCount != centerText.length && (colCount - centerText.length) % 2 != 0) {
    ++colCount;
  }
  if (colCount < centerText.length) {
    colCount = centerText.length;
  }

  // for properly rowCount size for centering text in vertical position
  if (rowCount % 2 == 0) {
    ++rowCount;
  }

  if (!gridSurf) {
    gridSurf = new GridCorners(new Point(border, border), new Point(width - border, height - border), colCount, rowCount);
  } else {
    gridSurf.reset(new Point(border, border), new Point(width - border, height - border), colCount, rowCount);
  }

  // for visually centering text in chars rect
  var posForCenterText = ~~((gridSurf.rowCount - 1) / 2) * gridSurf.colCount - 1 + ~~((gridSurf.colCount -centerText.length) / 2);

  gridSurf.traverse(function(x, y, index){
    if (index > posForCenterText && centerText.length) {
      console.log(baseTextSize);
      charsArr.push(new CharNode(x, y, centerText.shift(), baseTextSize + 3, fontForSpecialChar));
      console.log("excuted!");
      //charsArr.push(new CharNode( x + (isRandShiftPos ? random(-5, 5) : 0), y + (isRandShiftPos ? random(-5, 5) : 0), centerText.shift(), baseTextSize + 3, fontForSpecialChar));
      charsArr[index].clr = '#210';
      charsArr[index].lensRadius = isRandLensAmount ? random(30, 120) : lensParams.radius;
    } else {
      charsArr.push(new CharNode(x, y, strForRandomChars[index], baseTextSize, fontForChar));
      //charsArr.push(new CharNode(x + (isRandShiftPos ? random(-5, 5) : 0), y + (isRandShiftPos ? random(-5, 5) : 0), randomChar(strForRandomChars), baseTextSize, fontForChar)); //randomChar(strForRandomChars)
      charsArr[index].lensRadius = isRandLensAmount ? random(20, 80) : lensParams.radius;
      console.log("excuted!last");
    }
  });
}


// Point Class
function Point(x, y) {
  this.x = x;
  this.y = y;
}
Point.prototype.reset = function (x, y) {
  this.constructor(x, y);
};


function randomChar(str) {
  var chars = str || "ABCDEFGHIJKLMNOPQRSTUVWXT";
  var rnum = Math.floor(Math.random() * chars.length);
  return chars.substring(rnum,rnum+1);
}
