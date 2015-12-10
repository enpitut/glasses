var L2dDefine = {
    // デバッグ。trueのときにログを表示する。
    DEBUG_LOG : false,
    DEBUG_MOUSE_LOG : false, // マウス関連の冗長なログ

    // モデル定義
    MODEL : "res/tasuko/model.json",
    
    // 画面
    VIEW_MAX_SCALE : 2,
    VIEW_MIN_SCALE : 0.8,

    VIEW_LOGICAL_LEFT : -1,
    VIEW_LOGICAL_RIGHT : 1,

    VIEW_LOGICAL_MAX_LEFT : -2,
    VIEW_LOGICAL_MAX_RIGHT : 2,
    VIEW_LOGICAL_MAX_BOTTOM : -2,
    VIEW_LOGICAL_MAX_TOP : 2,
    
    // モーションの優先度定数
    PRIORITY_NONE : 0,
    PRIORITY_IDLE : 1,
    PRIORITY_NORMAL : 2,
    PRIORITY_FORCE : 3,
    
    // 外部定義ファイル(json)と合わせる
    MOTION_GROUP_IDLE : "idle", // アイドリング
    MOTION_GROUP_TAP_BODY : "tap_body", // 体をタップしたとき
    MOTION_GROUP_FLICK_HEAD : "flick_head", // 頭を撫でた時
    MOTION_GROUP_PINCH_IN : "pinch_in", // 拡大した時
    MOTION_GROUP_PINCH_OUT : "pinch_out", // 縮小した時
    MOTION_GROUP_SHAKE : "shake", // シェイク
    MOTION_GROUP_NOTIFICATE : "notification",

    // 外部定義ファイル(json)と合わせる
    HIT_AREA_HEAD : "head",
    HIT_AREA_BODY : "body"  
};
