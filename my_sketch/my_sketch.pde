void setup(){
  PImage img;
  print("starting sketch...");
  print();
  size(600,600);
  //Pull image from folder
  img = loadImage("../images/input.png");
  
  //Draw random circles
  for(int i=0;i<300;i ++){
    float y = random(height);
    float x = random(width);
    float g = random(150, 255);
    float b = random(50, 180);
    fill(0,g,b);
    noStroke();
    ellipse(x,y,60,60);
  }
  //Draw Image
  image(img,300,300);


  save("output.png"); //save image to images folder
  print("...sketch done");
  exit(); //stop running
}