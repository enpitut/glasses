var _this = this;

function L2dTasuko(){
    this.platform = window.navigator.platform.toLowerCase();
    this.L2dMgr = new L2dManager();
    this.isDrawStart = false;
    
    this.gl=null;
    this.cvs=null;
    
    this.dragMgr = null; /*new L2DTargetPoint();*/ // ドラッグによるアニメーション管理
    this.viewMatrix = null; /*new L2DViewMatrix();*/
    this.projMatrix = null; /*new L2DMatrix44()*/
    this.deviceToScreen = null; /*new L2DMatrix44();*/
    
    this.drag = false; // ドラッグ中かどうか
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    
    this.isModelShown = false;
        
    // モデル描画用Canvasの初期化
    initL2dCanvas("mycanvas");
    // モデル用マトリクスの初期化と描画の開始
    init();
}

function initL2dCanvas(cvsId){
    // Canvasオブジェクトを取得
    this.cvs = document.getElementById(cvsId);
    
    // イベントの登録
    if(this.cvs.addEventListener){
        this.cvs.addEventListener("mousewheel", mouseEvent, false);
        this.cvs.addEventListener("click", mouseEvent, false);
        
        this.cvs.addEventListener("mousedown", mouseEvent, false);
        this.cvs.addEventListener("mousemove", mouseEvent, false);
        this.cvs.addEventListener("mouseup", mouseEvent, false);
        this.cvs.addEventListener("mouseout", mouseEvent, false);
        this.cvs.addEventListener("contextmenu", mouseEvent, false);
        
        this.cvs.addEventListener("touchstart", touchEvent, false);
        this.cvs.addEventListener("touchend", touchEvent, false);
        this.cvs.addEventListener("touchmove", touchEvent, false);
        
    }
}

function init(){
    // 3Dバッファの初期化
    var width = this.cvs.width;
    var height = this.cvs.height;
    
    this.dragMgr = new L2DTargetPoint();
    
    // ビュー行列
    var ratio = height / width;
    var left = L2dDefine.VIEW_LOGICAL_LEFT;
    var right = L2dDefine.VIEW_LOGICAL_RIGHT;
    var bottom = -ratio;
    var top = ratio;

    this.viewMatrix = new L2DViewMatrix();

    // デバイスに対応する画面の範囲。 Xの左端, Xの右端, Yの下端, Yの上端
    this.viewMatrix.setScreenRect(left, right, bottom, top);
    
    // デバイスに対応する画面の範囲。 Xの左端, Xの右端, Yの下端, Yの上端
    this.viewMatrix.setMaxScreenRect(L2dDefine.VIEW_LOGICAL_MAX_LEFT,
                                     L2dDefine.VIEW_LOGICAL_MAX_RIGHT,
                                     L2dDefine.VIEW_LOGICAL_MAX_BOTTOM,
                                     L2dDefine.VIEW_LOGICAL_MAX_TOP); 

    this.viewMatrix.setMaxScale(L2dDefine.VIEW_MAX_SCALE);
    this.viewMatrix.setMinScale(L2dDefine.VIEW_MIN_SCALE);

    this.projMatrix = new L2DMatrix44();
    this.projMatrix.multScale(1, (width / height));

    // マウス用スクリーン変換行列
    this.deviceToScreen = new L2DMatrix44();
    this.deviceToScreen.multTranslate(-width / 2.0, -height / 2.0);
    this.deviceToScreen.multScale(2 / width, -2 / width);
    
    
    // WebGLのコンテキストを取得する
	this.gl = getWebGLContext();
	if (!this.gl) {
        console.error("Failed to create WebGL context.");
        return;
    }

	// 描画エリアを白でクリア
	this.gl.clearColor(0.0, 0.0, 0.0, 0.0);

    setModel();
    startDraw();
}

function setModel(){
    this.isModelShown = false;
    this.L2dMgr.setModel(this.gl);
}

function startDraw(){
    if(!this.isDrawStart){
        this.isDrawStart = true;
        
        (function tick(){
            draw(); // 一度描画
            
            var requestAnimationFrame = 
                window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame;
            
            // 一定時間後に自身を呼び出す
            requestAnimationFrame(tick, this.cvs);
        })();
    }
}

function draw(){
    MatrixStack.reset();
    MatrixStack.loadIdentity();
    
    this.dragMgr.update(); // ドラッグ用パラメータの更新
    this.L2dMgr.setDrag(this.dragMgr.getX(), this.dragMgr.getY());

    // Canvasをクリアする
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
    MatrixStack.multMatrix(projMatrix.getArray());
    MatrixStack.multMatrix(viewMatrix.getArray());
    MatrixStack.push();
    
    var model = this.L2dMgr.getModel();
    if(model == null){return;}
    if(model.initialized && !model.updating){
        model.update();
        model.draw(this.gl);
    }
    
    MatrixStack.pop();
}

function mouseEvent(e){
    e.preventDefault();
    
    if(e.type == "mousewheel"){
    }else if(e.type == "mousedown"){
        // 左クリック以外なら処理を抜ける
        if("button" in e && e.button != 0) return;
        modelTurnHead(e);
    }else if(e.type == "mousemove"){
        followPointer(e);      
    }else if(e.type == "mouseup"){
    // 右クリック以外なら処理を抜ける
        if("button" in e && e.button != 0) return;
        lookFront();        
    }else if(e.type == "mouseout"){    
        lookFront();        
    }else if(e.type == "contextmenu"){
    }
}

function touchEvent(e){
    e.preventDefault();
    var touch = e.touches[0];
    
    if (e.type == "touchstart") {
        if (e.touches.length == 1) {
            modelTurnHead(touch);
        }
    } else if (e.type == "touchmove") {
        followPointer(touch);
    } else if (e.type == "touchend") {
        lookFront();
    }
}

// クリックした方を向く
function modelTurnHead(ev){
    _this.drag = true;
    
    var rect = ev.target.getBoundingClientRect();   
    var sx = transformScreenX(ev.clientX - rect.left);
    var sy = transformScreenX(ev.clientY - rect.top);
    var vx = transformViewX(ev.clientX - rect.left);
    var vy = transformViewY(ev.clientY - rect.top);
    
    _this.lastMouseX = sx;
    _this.lastMouseY = sy;
    
    // クリックした方を向く
    _this.dragMgr.setPoint(vx, vy);    
    // タップした場所に応じてモーション再生
    _this.L2dMgr.tapEvent(vx, vy);
}

// ポインタを目線で追いかける
function followPointer(ev){
    var rect = ev.target.getBoundingClientRect();   
    var sx = transformScreenX(ev.clientX - rect.left);
    var sy = transformScreenX(ev.clientY - rect.top);
    var vx = transformViewX(ev.clientX - rect.left);
    var vy = transformViewY(ev.clientY - rect.top);
    
    if(_this.drag){
        _this.lastMouseX = sx;
        _this.lastMouseY = sy;
        
        _this.dragMgr.setPoint(vx, vy);
    }
}

function lookFront(){
    if(_this.drag){
        _this.drag = false;
    }
    _this.dragMgr.setPoint(0,0);
}

/* ********** マトリックス操作 ********** */
function transformViewX(deviceX){
    var screenX = this.deviceToScreen.transformX(deviceX); // 論理座標変換した座標を取得
    return viewMatrix.invertTransformX(screenX); // 拡大、縮小、移動後の値
}

function transformViewY(deviceY){
    var screenY = this.deviceToScreen.transformY(deviceY); // 論理座標変換した座標を取得
    return viewMatrix.invertTransformY(screenY); // 拡大、縮小、移動後の値
}

function transformScreenX(deviceX){
    return this.deviceToScreen.transformX(deviceX);
}

function transformScreenY(deviceY){
    return this.deviceToScreen.transformY(deviceY);
}


// WebGLのコンテキスト取得
function getWebGLContext(){
	var NAMES = ["webgl" , "experimental-webgl" , "webkit-3d" , "moz-webgl"];
	
	for( var i = 0; i < NAMES.length; i++ ){
		try{
			var ctx = this.cvs.getContext(NAMES[i], {premultipliedAlpha : true});
			if(ctx) return ctx;
		} 
		catch(e){console.error(e);}
	}
	return null;
};
