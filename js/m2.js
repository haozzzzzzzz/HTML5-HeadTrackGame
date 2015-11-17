/*
* 基本变量设置
*/
//头部追踪变量
var htracker;
//视频绘图变量
var canvasFacePosContext;
//游戏状态控制变量
var gamestatus="";
//脸部方位;
var bottom , left;
//种子数组
var randseed;
//单个种子点
var gseed;
var usrNum = 0;
var seednum=0;
//当前绘制的方向
var nowMode="";

var gameCanvas;
var gameCanvasCtx;

//音乐控制器
var gameMusicChanel1;
var gameWelcomeMusic;
var gameReportMusic;
var gameChangeMusic;

var audiosrc={
    "start":"audio/start.mp3",
    "gaming":"audio/gaming.mp3"
}

function playAudio(chanel,srcId)
{
    chanel.src=audiosrc[srcId];
    chanel.onload=function()
    {
        chanel.play();
    }
}
var imgSrc=
{
    "start":"img/start.jpg",
    "uphead":"img/up.jpg",
    "bottomhead":"img/down.jpg",
    "lefthead":"img/left.jpg",
    "righthead":"img/right.jpg",
    "startTitle":"img/starttitle.png"
}
//罗浩 图片的绘制
function drawIdImg(imgId,x,y)
{
    var image=new Image();
    image.src=imgSrc[imgId];
    image.onload=function()
    {
        gameCanvasCtx.drawImage(image,x,y);
    }
}
function drawSrcImg(imgsrc,x,y)
{
    var image=new Image();
    image.src=imgsrc;
    image.onload=function()
    {
        gameCanvasCtx.drawImage(image,x,y);
    }
}
//绘制游戏canvas内容 罗浩
function drawGame()
{
    //绘制 背景
    drawIdImg('background',0,0);
    //画当前的动物的位置

}


var picFrameSrc=new Array();
picFrameSrc[0]="img/d1.jpg";
picFrameSrc[1]="img/d2.jpg";
picFrameSrc[2]="img/d3.jpg";
picFrameSrc[3]="img/d4.jpg";
picFrameSrc[4]="img/d5.jpg";
picFrameSrc[5]="img/d6.jpg";

function drawMenuPage()
{
      var order=1;
      var repeat=3;
      var interval= setInterval(function(){
        if(gamestatus=="nostart"||gamestatus=="")
        {
            drawSrcImg(picFrameSrc[order],0,0);
            if(order==5&&repeat>0)
            {
                repeat--;
                drawIdImg("startTitle",gameCanvas.width/2,0);
            }
            else
            {
                order++;
                repeat=3;
            }

            order = order%6;
        }
        else
        {
            clearInterval(interval);
           gameCanvasCtx.clearRect(0,0,gameCanvas.width,gameCanvas.height);
        }
    },1000);
}


//游戏进度条
function progress(num)
{
    $("#progress").animate({width:num},"slow");
}
$(document).ready(function(){
    //初始化游戏画布的宽度大小 罗浩
    gameMusicChanel1=document.getElementById('music_gaming');
    gameWelcomeMusic=document.getElementById('welcomeMusic');
    //gameChangeMusic=document.getElementById('changeMusic');
    gameHitMusic=document.getElementById('hitMusic');

    gameCanvas=document.getElementById('gameCanvas');
    gameCanvasCtx=gameCanvas.getContext('2d');

    gameCanvas.width=1000;
    gameCanvas.height=600;

    drawSrcImg(picFrameSrc[0],0,0);

    var videoInput = $('#inputVideo').get(0);
    var canvasInput = $('#inputCanvas').get(0);
    canvasFacePosContext=$('#inputCanvas').get(0).getContext('2d');
    //初始化
    htracker = new headtrackr.Tracker({ui:false,calcAngles:false,detectionInterval : 11});
    htracker.init(videoInput, canvasInput);

    gameWelcomeMusic.play();
    $("#small-dino").animate({right:"+=1370px"},800,function(){
        $("#big-dino").animate({left:"+=1370px"},800,function(){
            $("#talk").animate({top:"+=700px"},800,function(){
                $("#welcome-page").animate({top:"0px"},1000,function(){
                    $(this).fadeOut(800,function(){

                        document.addEventListener('headtrackrStatus',headtrackrStatusCallback);
                        //脸部检测
                        document.addEventListener('facetrackingEvent',facetrackingEventCallback);
                        //头部状态监听
                        document.addEventListener('headtrackingEvent',headtrackingEventCallback);
                        htracker.start();
                        drawMenuPage();
                    });
                });
            });
        });
    });

    //摄像头状态监听
    function headtrackrStatusCallback(event)
    {
        $('#status').html("\<h2\>status : "+event.status+"\<\/h2\>");
        if(event.status=="found"&&gamestatus=="")
        {
            gamestatus="nostart";
        }    
    }
    function facetrackingEventCallback(event)
    {
        drawFacePos(event.x,event.y,event.width,event.height);
    }
    function headtrackingEventCallback(event)
    {
        //游戏开始
        if(gamestatus==="nostart")
        {
            upstart(event.y);
        }
        else if(gamestatus=="firstStart")
        {
            gameWelcomeMusic.pause();
            drawIdImg('start',0,0);
            setTimeout("changeStatus('start')",1500);
        }
        else if(gamestatus=="start")
        {
            document.getElementById("contrain").style.display="block";
            gaming(event.x,event.y,event.z);
        }
        else if(gamestatus=="end")
        {
            htracker.stop();
            window.location.href='./rel.html';
        }
    }
});

function changeStatus(status)
{
    gamestatus=status;
}

/*
* 重新检测函数
*/
function myref()
{
    htracker.stop();htracker.start();
}
/*
 *  绘制跟踪点
*/
 function drawFacePos(x,y,w,h)
 {
 canvasFacePosContext.fillStyle="#FF0000";
 canvasFacePosContext.beginPath();
 canvasFacePosContext.arc(x,y,10,0,Math.PI*2,true);
 canvasFacePosContext.closePath();
 canvasFacePosContext.fill();
 }

/*
* 产生随机数函数
 */

function makerandom()
{
    var alltime=Math.floor(gameMusicChanel1.duration);//获取总时间
    seednum=Math.floor(alltime*2);  //获取种子数
    randseed = new Array(seednum);
    for(var i = 0; i< seednum ; i++){
        randseed[i] = Math.random() * 4;
		while( parseInt(randseed[i]) == parseInt(randseed[i-1]) ){
			randseed[i] = Math.random() * 4;}
    }
    SetCookie("seednum",seednum);
    SetCookie("usrnum",0);
    gameMusicChanel1.play();
}
/*
* 抬头开始游戏
*/
function upstart(upY)
{
    var bottom_start = parseInt((upY * 18) - 50)
    if(bottom_start >= 170)
    {

        $("#startinfo").remove();
        $("#gaming").show();
        //产生随机数
        makerandom();
        gamestatus="firstStart";
    }
}


/*
*处理
*/
var t;
var send=0;
var finished = false;
function setT(){
        gseed=randseed.pop();
        gameCanvasCtx.clearRect(0,0,gameCanvas.width,gameCanvas.height);
        nowMode="";
        t = setTimeout("setT()", 3000);
}

/*
*  游戏进行
*/
function gaming(x,y,z)
{
    var bottom = parseInt((y * 18) - 50);
    var left = parseInt((x * 12) + 100);
    if(send == 0 ){
        send =1;
        setT();
    }
    $('#headinfo').html("\<h2\>head info\<\/h2\>\<br\/\>left : "+left+"\<br\/\>bottom : "+bottom+"\<br\/\>z : "+Math.ceil(event.z));

    if(usrNum!=seednum&&gameMusicChanel1.ended==false)
    {
        //绘制提示
        drawNote();
        if(left <= 20)          //-6.7
        {
            //left
            if(getModeSeed()=="left")
            {
                clearTimeout(t);
                setT();
                recUsrNum();
            }
        }
        else if(left >= 125)        //2.08
        {
            //right
            if(getModeSeed()=="right")
            {
                clearTimeout(t);
                setT();
                recUsrNum();
            }
        }
        else if(bottom >= 150)      //11.11
        {
            //top
            if(getModeSeed()=="top")
            {
                clearTimeout(t);
                setT();
                recUsrNum();
            }
        }
        else if(bottom <= 30)       //4.44
        {
            //bottom
            if(getModeSeed()=="bottom")
            {
                clearTimeout(t);
                setT();
                recUsrNum();
            }
        }
    }
    else
    {
        gameMusicChanel1.pause();
        gamestatus="end";
    }
}
/*
 * 记录用户成绩
*/
function recUsrNum()
{
    usrNum++;
    progress((usrNum/seednum)*900);
    gameHitMusic.load();
    gameHitMusic.play();
    SetCookie("usrnum",usrNum);
}
/*
*  绘制提示
*/   
function drawNote()
{
    if(getModeSeed()=="left"&&nowMode!="left")
    {
        //left
        //drawSrcImg(picFrameSrc[2],0,0);
        drawIdImg("lefthead",0,0);
        nowMode=left;
        document.getElementById("gaming").innerText="左 : "+usrNum;
    }
    else if(getModeSeed()=="right"&&nowMode!="right")
    {
        //right
        //drawSrcImg(picFrameSrc[1],0,0);
        drawIdImg("righthead",0,0);
        nowMode="right";
        document.getElementById("gaming").innerText="右 : "+usrNum;
    }
    else if(getModeSeed()=="top"&&nowMode!="top")
    {
        //top
        //drawSrcImg(picFrameSrc[4],0,0);
        drawIdImg("uphead",0,0);
        nowMode="top";
        document.getElementById("gaming").innerText="上 : "+usrNum;
    }
    else if(getModeSeed()=="bottom"&&nowMode!="bottom")
    {
        //bottom
        //drawSrcImg(picFrameSrc[3],0,0);
        drawIdImg("bottomhead",0,0);
        nowMode="bottom";
        document.getElementById("gaming").innerText="下 : "+usrNum;
    }
}
/*
* 判断种子点的上下左右
 */
function getModeSeed()
{
    if(gseed>=0&&gseed<=1)
        return "left";
    else if(gseed>1&&gseed<=2)
        return "right";
    else if(gseed>2&&gseed<=3)
        return "top";
    else if(gseed>3&&gseed<=4)
        return "bottom";
}
