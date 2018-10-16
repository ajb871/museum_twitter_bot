  PImage img0;
  PImage img1;
  PImage frame;
  JSONObject json;
  JSONArray words;
  //String[] words = {};

void setup(){
  print("starting sketch...");
  print();
  size(700,700);
    
  //pull text from json object
  json = loadJSONObject("../tweet_content.json");
  words = json.getJSONArray("text_content");
  //Pull image from folder
  frame = loadImage("../images/frame.png");
  img0 = loadImage("../images/input0.png");
  img1 = loadImage("../images/input1.png");
  
  //Draw random circles
  for(int i=0;i<300;i ++){
    float y = random(100,height-100);
    float x = random(100,width-100);
    float r = random(90, 190);
    float g = random(150, 255);
    float b = random(50, 180);
    fill(r,g,b);
    noStroke();
    ellipse(x,y,60,60);
  }

  //Draw Image
  imageMode(CENTER);
  tint(random(150, 255),0,random(50, 180),random(90,180));
  image(img0,random(200, width-200),random(200,height-200),random(400,width),random(400,height));
  image(img1,random(200, width-200),random(200,height-200),random(400,width),random(400,height));
  
  //Draw random words
  for(int w=0;w < words.size();w++){
    String word = words.getString(w);
    if (random(10)>6){
      textSize(random(12,120));
      fill(random(20,190),random(0,255),random(100, 255));
      text(word,random(100,width-100),random(100,height-100));
    }
  }
  
  //Add a frame!
  imageMode(CORNER);
  tint(255);
  image(frame,0, 0, width,height);
  
  save("output.png"); //save image to images folder
  print("...sketch done");
  //exit(); //stop running
}