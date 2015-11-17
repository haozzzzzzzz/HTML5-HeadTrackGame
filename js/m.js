/*
* 基本变量设置
*/
//头部追踪变量
var htracker;
//视频绘图变量
var canvasFacePosContext;
//游戏状态控制变量
var gamestatus="";

//种子数组
var randseed;
//单个种子点
var gseed;
//音乐资源

var gameCanvas;
var gameCanvasCtx;

//音乐控制器
var gameMusicChanel1;
var gameMusicChanel2;

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
    "welcome":"img/welcome.jpg",
    "background":"img/bg.jpg",
    "uphead":"img/d5.jpg"
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
    var interval= setInterval(function(){
        if(gamestatus=="nostart")
        {
            drawSrcImg(picFrameSrc[order],0,0);
            order++;
            order = order%6;
        }
        else
        {
            clearInterval(interval);
            //drawIdImg("background",0,0);
           gameCanvasCtx.clearRect(0,0,gameCanvas.width,gameCanvas.height);
        }
    },1000);
}

$(document).ready(function(){
    //初始化游戏画布的宽度大小 罗浩
    gameMusicChanel1=document.getElementById('music_gaming');
    gameMusicChanel2=document.getElementById('music'); 
    gameCanvas=document.getElementById('gameCanvas');
    gameCanvasCtx=gameCanvas.getContext('2d');

    gameCanvas.width=document.body.clientWidth;
    gameCanvas.height=document.body.clientHeight;

    drawSrcImg(picFrameSrc[0],0,0);

    var videoInput = $('#inputVideo').get(0);
    var canvasInput = $('#inputCanvas').get(0);
    canvasFacePosContext=$('#inputCanvas').get(0).getContext('2d');
    //初始化
    htracker = new headtrackr.Tracker({ui:false,calcAngles:false,detectionInterval : 11});
    htracker.init(videoInput, canvasInput);

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
            GameTimer();
            gamestatus="start";
        }
        else if(gamestatus=="start")
        {

            gaming(event.x,event.y,event.z);
        }
        else if(gamestatus=="end")
        {
            htracker.stop();
            window.location.href='./rel.html';
        }
    }
});


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
 canvasFacePosContext.arc(x,y,20,0,Math.PI*2,true);
 canvasFacePosContext.closePath();
 canvasFacePosContext.fill();
 }

/*
* 产生随机数函数
 */

function makerandom()
{
    var alltime=Math.floor(gameMusicChanel1.duration);//获取总时间
    var seednum=Math.floor(alltime*2);  //获取种子数
    randseed = new Array(seednum);
    for(var i = 0; i< seednum ; i++){
        randseed[i] = Math.random() * 4;
    }
    SetCookie("seednum",seednum);
    SetCookie("usrnum",0);
    gameMusicChanel1.play();
    gseed=randseed.pop();
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
*  游戏进行
*/
function gaming(x,y,z)
{
    var bottom = parseInt((y * 18) - 50);
    var left = parseInt((x * 12) + 100);
    $('#headinfo').html("\<h2\>head info\<\/h2\>\<br\/\>left : "+left+"\<br\/\>bottom : "+bottom+"\<br\/\>z : "+Math.ceil(event.z));
    if(getCookie("usrnum")!=getCookie("seednum")&&gameMusicChanel1.ended==false)
    {
        //绘制提示
        //drawNote();
        if(gseed>=0&&gseed<=1)
        {
            //left
            if(left <= 20)
            {
                gseed=randseed.pop();
                recUsrNum();
            }
        }
        else if(gseed>1&&gseed<=2)
        {
            //right
            if(left >= 125)
            {
                gseed=randseed.pop();
                recUsrNum();
            }
        }
        else if(gseed>2&&gseed<=3)
        {
            //top
            if(bottom >= 150)
            {
                gseed=randseed.pop();
                recUsrNum();
            }
        }
        else if(gseed>3&&gseed<=4)
        {
            //bottom
            if(bottom <= 30)
            {
                gseed=randseed.pop();
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
    MessageShow()
    var tem=parseInt(getCookie("usrnum"));
    tem=tem+1;
    SetCookie("usrnum",tem);
}
/*
*  绘制提示
*/
function drawNote()
{
    if(gseed>=0&&gseed<=1)
    {
        //left

        document.getElementById("gaming").innerText="左 : "+getCookie("usrnum");
    }
    else if(gseed>1&&gseed<=2)
    {
        //right
        document.getElementById("gaming").innerText="右 : "+getCookie("usrnum");
    }
    else if(gseed>2&&gseed<=3)
    {
        //top
        drawIdImg("uphead",100,0);
        document.getElementById("gaming").innerText="上 : "+getCookie("usrnum");
    }
    else if(gseed>3&&gseed<=4)
    {
        //bottom
        document.getElementById("gaming").innerText="下 : "+getCookie("usrnum");
    }
}


function GameTimer()
{
    drawNote();
    setTimeout("GameTimer()",3000);
}

