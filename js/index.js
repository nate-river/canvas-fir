window.onload = function () {
	var
  canvas = document.querySelector('#canvas'),
  ctx = canvas.getContext('2d'),
  //棋盘大小
  ROW = 15,
  //棋盘星点位置数据
  z = [140.5,460.5],
  //所有的落子数据
  qizi = {};
  //标示该谁落子
  var huaqipan = function() {
    ctx.clearRect(0,0,600,600);
    for(var i = 0; i < ROW; i++){
      var li = ctx.createLinearGradient(0,0,560,0);
      li.addColorStop(0.5,'#999');
      li.addColorStop(1,'black');
      ctx.strokeStyle = li;
      ctx.beginPath();
      ctx.moveTo(20,i*40 + 20.5);
      ctx.lineTo(580,i*40 + 20.5);
      ctx.stroke();

      var li = ctx.createLinearGradient(0,0,0,560);
      li.addColorStop(0.5,'#333');
      li.addColorStop(1,'#444');
      ctx.strokeStyle = li;
      ctx.beginPath();
      ctx.moveTo(i*40+20.5,20);
      ctx.lineTo(i*40+20.5,580);
      ctx.stroke();
    }
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(300.5,300.5,3,0,Math.PI*2);
    ctx.fill();
    for(var i = 0; i < z.length; i++){
      for(var j = 0; j < z.length; j++){
        ctx.beginPath();
        ctx.arc(z[i],z[j],3,0,Math.PI*2);
        ctx.fill();
      }
    }
  }
  huaqipan();

  /*
  *  x    number   落子x坐标
  *  y    number   落子y坐标
  *  color boolean  true代表黑子  false代表白子
  */
  var luozi = function (x,y,color) {
    var zx = 40*x + 20.5;
    var zy = 40*y + 20.5;
    var black = ctx.createRadialGradient(zx,zy,1,zx,zy,18);
    black.addColorStop(0.1,'#555');
    black.addColorStop(1,'black');
    var white = ctx.createRadialGradient(zx,zy,1,zx,zy,18);
    white.addColorStop(0.1,'#fff');
    white.addColorStop(1,'#ddd');

    ctx.fillStyle = ( color == 'black') ?black:white;

    ctx.beginPath();
    ctx.arc(zx,zy,18,0,Math.PI*2);
    ctx.fill();
  }
  var kongbai = {};
  for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 15; j++) {
      kongbai[ i + '-' + j] = true;
    }
  }

  var ai = function () {
    var max = -1000000; var xx = {};
    for ( var i  in kongbai){
      var pos = i;
      var x = panduan(Number(pos.split('-')[0]),Number(pos.split('-')[1]),'black');
      if( x > max ){
        max = x;
        xx.x = pos.split('-')[0];
        xx.y = pos.split('-')[1];
      }
    }

    var max2 = -1000000; var yy = {};
    for ( var i  in kongbai){
      var pos = i;
      var x = panduan(Number(pos.split('-')[0]),Number(pos.split('-')[1]),'white');
      if( x > max2 ){
        max2 = x;
        yy.x = pos.split('-')[0];
        yy.y = pos.split('-')[1];
      }
    }
    if( max2 >= max){
      return yy;
    }
    return xx;
  }
  canvas.onclick = function (e) {
    var x =  Math.round( (e.offsetX-20.5)/40 );
    var y =  Math.round( (e.offsetY-20.5)/40 );
    if( qizi[x+'-'+y] ){return;}
    luozi(x,y,'black');
    qizi[ x + '-' + y ] = 'black';
    delete kongbai[ x + '-' + y ];

    if( panduan(x,y,'black') >= 5 ){
      alert('黑棋赢');
      window.location.reload();
    }

    var pos = ai();
    luozi(pos.x,pos.y,'white');
    qizi[ pos.x + '-' + pos.y ] = 'white';
    delete kongbai[ pos.x + '-' + pos.y ];
    if( panduan(Number(pos.x),Number(pos.y),'white') >= 5 ){
        alert('白棋赢');
        window.location.reload();
    };
  }

  var houziAI  = function () {
    do{
      var x = Math.floor( Math.random()*15 );
      var y = Math.floor( Math.random()*15 );
    }while( qizi[ x + '-' + y ] )
    return {x:x,y:y};
  }
  var xy2id = function(x,y) {
    return x + '-' + y;
  }

  var panduan = function(x,y,color) {
    var shuju = filter(color);
    var tx,ty,hang = 1;shu = 1; zuoxie= 1;youxie = 1;
    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty ) ]){tx--;hang++};
    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty ) ]){tx++;hang++};
    // if(hang >= 5){return true};
    tx=x;ty=y;while( shuju[ xy2id( tx,ty-1 ) ]){ty--;shu++};
    tx=x;ty=y;while( shuju[ xy2id( tx,ty+1 ) ]){ty++;shu++};
    // if(shu >= 5){return true};
    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty-1 ) ]){tx++;ty--;zuoxie++};
    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty+1 ) ]){tx--;ty++;zuoxie++};
    // if(zuoxie >= 5){return true};
    tx=x;ty=y;while( shuju[ xy2id( tx-1,ty-1 ) ]){tx--;ty--;youxie++};
    tx=x;ty=y;while( shuju[ xy2id( tx+1,ty+1 ) ]){tx++;ty++;youxie++};
    return Math.max(hang,shu,zuoxie,youxie);
  }
  var filter = function(color) {
    var r = {};
    for(var i in qizi){
      if(qizi[i]  == color){
        r[i] = qizi[i];
      }
    }
    return r;
  }


}
