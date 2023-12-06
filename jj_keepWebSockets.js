
const WSSTT_STOPED        = 'STOP';
const WSSTT_CONNECTING    = 'TRY CONNECTING';
const WSSTT_CONNECTED     = 'CONNECTED';
const WSSTT_DISCONNECTING = 'DISCONNECTING';
const WSSTT_DISCONNECTED  = 'DISCONNECTED';

class WsAction {
    constructor(parameter = {}) {
        this.parameter = {};
        this.setParameter(parameter);
    }

    // パラメーターをセットする
    setParameter(parameter) {
        for (const key in parameter) {
            this.parameter[key] = parameter[key];
        }
    }

    // パラメーターを削除する
    removeParameter(parameterName) {
        delete this.parameter[parameterName];
    }

    // パラメーターをセットし、送信する（パラメーターは省略可能）
    send(parameter = {}) {
	if (keepws_controller.get_status() != WSSTT_CONNECTED) return; // 接続チェック
        this.setParameter(parameter);
        const jsonStr = JSON.stringify(this.parameter);
        keepws_controller.send(jsonStr); // dict型をJSONに変換して送信
        if (this.parameter.hasOwnProperty('action')
            && this.parameter.action != 'keepalive') {
            console.log("Send: " + this.parameter.action);
        }
    }
}

class keepWsController {

    // コンストラクタ
    constructor () {
        // イベントハンドラの this を固定
        this.opened    = this.opened.bind(this);
        this.closed    = this.closed.bind(this);
        this.receive   = this.receive.bind(this);
        this.error     = this.error.bind(this);
        
        // 個別ハンドラ処理の初期化
        this.set_opened_function(() => {
            console.log("WebSocket connected:");
        });
        this.set_closed_function((event) => {
            console.log("WebSocket closed:");
        });
        this.set_receive_function(null);
        this.set_error_function((error) => {
            console.error("WebSocket error:", error);
        });

        this.updateWebSocketIntervalId = -1;
        this.reconnectTimeoutId        = -1;
        
        this.ws_status = WSSTT_DISCONNECTED;
        this.ws_dispstatus = WSSTT_STOPED;
        this.ws = null;
    }

    start_connection (url) {

        // 切断せずに再呼び出し対策
        this.stop_connection ();
        
        this.url = url;

        this.ws_dispstatus = WSSTT_CONNECTING;
        this.connectWebSocket();             // 最初の接続はここから、これ以降 ws.readyState が参照可能となる

        // アップデート処理の周期起動を設定
        this.updateWebSocketIntervalId = setInterval(() => {
            this.updateWebSocket(); // ここでthisは外側のthisと同じ
        }, 3000);                               // 周期を短くすると "try connecting" が見えないので3秒にする
    }

    stop_connection () {
        // 切断して、自動再接続処理も停止する
        if (this.updateWebSocketIntervalId != -1) {
            clearInterval(this.updateWebSocketIntervalId);
            this.updateWebSocketIntervalId = -1;
        }
        if (this.reconnectTimeoutId != -1) {
            clearTimeout(this.reconnectTimeoutId);
            this.reconnectTimeoutId = -1;
        }
        if (this.ws) {
            this.detachEventListeners();
            this.ws.close();  // WebSocket接続を閉じる
        }
        this.ws_status = WSSTT_STOPED;        
    }

    send (send_string) {
        // send_string を送信する
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(send_string);  // 文字列を送信
        }
    }

    get_status () {
        return this.ws_status;
    }
    get_dispstatus () {
        return this.ws_dispstatus;
    }
    
    // カスタムハンドラ処理の設定関数
    set_opened_function(fn) {
        this.opened_function = fn;
    };
    set_closed_function(fn) {
        this.closed_function = fn;
    };
    set_receive_function(fn) {
        this.receive_function = fn;
    };
    set_error_function(fn) {
        this.error_function = fn;
    };

    // 以下　内部関数
    // イベントリスナーの追加
    attachEventListeners() {
        this.ws.addEventListener("open", this.opened);
        this.ws.addEventListener("close", this.closed);
        this.ws.addEventListener("message", this.receive);
        this.ws.addEventListener("error", this.error);
    }
    
    // イベントリスナーの削除
    detachEventListeners() {
        this.ws.removeEventListener("open", this.opened);
        this.ws.removeEventListener("close", this.closed);
        this.ws.removeEventListener("message", this.receive);
        this.ws.removeEventListener("error", this.error);
    }
    
    // WSからのコールをカスタムハンドラにつなぐ処理
    opened() {
        this.ws_status = WSSTT_CONNECTED;
        if (this.opened_function !== null) {
            this.opened_function();
        }
    }
    closed(event) {
        this.ws_status = WSSTT_DISCONNECTED;
        if (this.closed_function !== null) {
            this.closed_function(event);
        }
    }
    receive(event) {
        if (this.receive_function !== null) {
            this.receive_function(event);
        }
    }
    error(error) {
        if (this.error_function !== null) {
            this.error_function(error);
        }
    }
    
    /**
     * WebSockets 接続処理
     */
    connectWebSocket() {
        this.ws = new WebSocket(this.url);
        this.attachEventListeners();
    }

    /**
     * WebSockets 自動再接続ループ
     */
    updateWebSocket() {
        switch (this.ws.readyState) {
        case WebSocket.CONNECTING:          // 接続が確立中です。
            this.ws_dispstatus = WSSTT_CONNECTING;
            break;
        case WebSocket.OPEN:                // 接続が確立されています。
            this.ws_dispstatus = WSSTT_CONNECTED;
            break;
        case WebSocket.CLOSING:             // 接続を閉じるプロセス中です。
            this.ws_dispstatus = WSSTT_DISCONNECTING;
            break;
        case WebSocket.CLOSED:              // 接続が閉じられています。
            if (this.ws_dispstatus !== WSSTT_DISCONNECTED) {
                // 状態変化検出 !disconnected -> disconnected
                this.ws_dispstatus = WSSTT_DISCONNECTED;
                this.reconnectTimeoutId = setTimeout(() => {
                    this.reconnectTimeoutId = -1;
                    this.reconnect();
                }, 10000);
            }
            break;
        }
    }
    reconnect() {
        if (this.ws_dispstatus === WSSTT_DISCONNECTED) {
            this.ws_dispstatus = WSSTT_CONNECTING;
            this.connectWebSocket();     // 再接続
            // この時点で　ws.readyState = WebSocket.CONNECTING になってるはず
            // その後 WebSocket.CLOSED におちたら再度Timeoutの設定をして・・・というループ
        }
    }
}

const keepws_controller = new keepWsController();

// 呼び側実装例
/*

function my_receive(event) {
    console.log(event.data);
}

function my_setupws() {

    keepws_controller.set_receive_function (my_receive);
    
    const host = window.location.hostname;
    keepws_controller.start_connection (`ws://${host}/ws/`);
}

*/
