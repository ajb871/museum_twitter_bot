  PImage img0;
  PImage img1;
  PImage frame1;
  PImage frame2;
  PImage frame3;
  
  String name;

  JSONObject json;
  JSONArray words;
  PImage[] frames = new PImage[3];

void setup(){
  print("starting sketch...");
  print();
  size(700,700);
    
  //Pull text from json object
  json = loadJSONObject("../tweet_content.json");
  words = json.getJSONArray("text_content");
  name = json.getString("name");
  //Pull images from folder
  frames[0] = loadImage("../images/frame1.png");
  frames[1] = loadImage("../images/frame2.png");
  frames[2] = loadImage("../images/frame3.png");
  img0 = loadImage("../images/input0.png");
  img1 = loadImage("../images/input1.png");
  
  //Draw random circles
  for(int i=0;i<1000;i ++){
    float y = random(100, height-100);
    float x = random(100,width-100);
    float r = random(20, 100);
    float g = 0;
    float b = random(90, 180);
    float a = random(100,255);
    fill(r,g,b);
    noStroke();
    triangle(x,y,random(100,width-100),random(100,height-100),random(100,width-100),random(100,height-100));
  }

  //Draw Image
  imageMode(CENTER);
  tint(255,random(100,250));
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
  fill(255);
  image(frames[int((random(frames.length)))],0, 0, width,height);
  
  fill(0);
  textSize(20);
  textAlign(CENTER);
  text(name,width-40, height-60);
  
  save("output.png"); //save image to images folder
  print("...sketch done");
  exit(); //stop running
}