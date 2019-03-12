// You can change with these values:

float sides = 4;
float delay = 40; // this will automatically reduce over time

color bg = background(color(255,255,255));
color fg = color(0);

float targetFps = 30;


void setup() {

	size(1100, 200);
  strokeWeight(4);
  frameRate(targetFps);
}

int[] primes = {2, 3, 5, 7, 11, 13};

float nowSide = 0;
float remain = 0;
float[] xs = new float[200];
float[] ys = new float[200];

float x = 0, y = 0;
float ptx = x, pty = y, tx = x, ty = y;
float number = 0;
float rot = 0;
float zoom = 0;
void draw() {
	if(mousePressed)  {
		zoom+=(0.6-zoom)/16;
	} else  {
		zoom+=(1-zoom)/16;
	}
  ptx+=(x-ptx)/64;
  pty+=(y-pty)/64;
  tx+=(ptx-tx)/64;
  ty+=(pty-ty)/64;
  background(bg);
  rot+=0.0005;

  translate(width/2, height/2);
  rotate(rot);
	scale(zoom);

  translate(-tx, -ty);
  number += ((float)xs.length - number)/16;
  stroke(lerpColor(bg, fg, 0.8));
  for (int i = 0; i<xs.length-1; i++) {
    line(xs[i], ys[i], xs[i+1], ys[i+1]);
  }

  stroke(fg);
  int last = xs.length-1;
  if (last>=0) {
    float v = 1-remain/delay;//(cos(remain/delay*PI)+1)/2; // smooth motion
    line(xs[last], ys[last],
      lerp(xs[last], x, v),
      lerp(ys[last], y, v));
  }

  remain--;
  if (remain<=0) {
    delay += (5-delay)/32; // faster every time!

    for(int i = 0; i<xs.length-1; i++)  {
      xs[i] = xs[i+1];
      ys[i] = ys[i+1];
    }

    xs[xs.length-1] = x;
    ys[ys.length-1] = y;
    int magnitude = primes[(int)random(primes.length)] * 30;
    nowSide = (nowSide+1)%sides;
		if(nowSide<0.1)  {
			magnitude+=60;
		}
    x+=cos(TWO_PI*(float)nowSide/sides)*magnitude;
    y+=sin(TWO_PI*(float)nowSide/sides)*magnitude;
    remain = delay;
  }
}
