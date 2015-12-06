function L2dManager(){
    // モデルデータ
    this.model=null;
    
    Live2D.init();
    Live2DFramework.setPlatformManager(new PlatformManager);
}

L2dManager.prototype.setModel = function(gl){
    this.model = new L2dModel();
    this.model.load(gl, L2dDefine.MODEL);
}

L2dManager.prototype.getModel = function(){
    return this.model;
}

// ドラッグした時，その方向を向くよう設定する
L2dManager.prototype.setDrag = function(x, y){
    this.model.setDrag(x, y);
}

// タップしたときのイベント
L2dManager.prototype.tapEvent = function(x, y){
    // 顔
    if(this.model.hitTest(L2dDefine.HIT_AREA_HEAD, x, y)){
        console.log("顔("+x+","+y+")");
    }
    // 体
    else if(this.model.hitTest(L2dDefine.HIT_AREA_BODY, x, y)){
        console.log("体("+x+","+y+")");
    }
    
    return true;
}