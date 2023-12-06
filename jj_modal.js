


const modalType_NONE     = 0;
const modalType_MESSAGE  = 1;
const modalType_YESNO    = 2;
const modalType_INPUT    = 3;
const modalType_EDITOR   = 4;
const modalType_VIEWER   = 5;
const modalType_SELECTOR = 6;
const modalType_USERDEF  = 20;

class modalController {

    // コンストラクタ
    constructor () {
        this.modalEnabled = false;
        this.initialize();

        // イベントハンドラの this を固定
        this.btn1Handler = this.btn1Handler.bind(this);
        this.btn2Handler = this.btn2Handler.bind(this);
        this.btn3Handler = this.btn3Handler.bind(this);
        this.modalBgHandler = this.modalBgHandler.bind(this);
        this.modalCloseHandler = this.modalCloseHandler.bind(this);        
    }
    // 初期化処理
    initialize()
    {
        // modalが有効化されていたら閉じる
        if (this.modalEnabled === true) {
	    this.hideModal();
        }
        // 変数初期化
        this.id = {
            btn1: '', btn2: '', btn3: '',
            message1: '', message2: '', message3: '',
            inputText: '', editText: '',
            modalBg: '', modalWindow: '', modalClose: '',
        }
        this.dispString = {
            btn1: '', btn2: '', btn3: '',
            message1: '', message2: '', message3: '',
            inputText: '', editText: '',
        }
        this.setting = {
            "min-width": 400,
            width: 'auto', height: 'auto',
            width_pct: 0, height_pct: 0,
            modalType: modalType_NONE,
            enableCloseByBGClick:   true,
            enableCloseByCloseIcon: true,
        }
        // 個別ハンドラ処理の初期化
        this.set_btn1Function(() => {
            return true;
        });
        this.set_btn2Function(() => {
            return true;
        });
        this.set_btn3Function(() => {
            return true;
        });
        this.set_modalBgFunction(() => {
            return false;
        });
        this.set_modalCloseFunction(() => {
            return true;
        });
    }

    get_inputText() {
        const element = document.getElementById(this.id.inputText);
        if (element != null) {
            return element.value;
        }
        return '';
    }
    get_editText() {
        const element = document.getElementById(this.id.editText);
        if (element != null) {
            return element.value;
        }
        return '';
    }

    // modalのタイプを指定してコントローラーを初期化する
    set_modalType(modalType)
    {
        this.initialize();

        this.setting.modalType = modalType;
        
        if (modalType == modalType_MESSAGE) {
            this.id = {
                ...this.id, // もとの値は残して、以下を書き換える
                modalBg:    'MODAL_messageDialog',
                modalWindow:'MODAL_messageDialog_window',
                btn1:       'MODAL_messageDialog_btn1',
                btn2:       'MODAL_messageDialog_btn2',
                message1:   'MODAL_messageDialog_message1',
                modalClose: 'MODAL_messageDialog_close',
            };
            this.dispString = {
                ...this.dispString,
                message1:   'message line 1',
                btn1: 'CLOSE',
            };
            this.setting = {
                ...this.setting,
                enableCloseByBGClick: true,
                enableCloseByCloseIcon: true,
            };
        }
        else if (modalType == modalType_YESNO) {
            this.id = {
                ...this.id, // もとの値は残して、以下を書き換える
                modalBg:    'MODAL_yesNoDialog',
                modalWindow:'MODAL_yesNoDialog_window',
                btn1:       'MODAL_yesNoDialog_btn1',
                btn2:       'MODAL_yesNoDialog_btn2',
                message1:   'MODAL_yesNoDialog_message1',
                modalClose: 'MODAL_yesNoDialog_close',
            };
            this.dispString = {
                ...this.dispString,
                message1:   'message line 1',
                btn1: 'YES',
                btn2: 'NO'
            };
            this.setting = {
                ...this.setting,
                enableCloseByBGClick: true,
                enableCloseByCloseIcon: true,
            };
        }
        else if (modalType == modalType_INPUT) {
            this.id = {
                ...this.id, // もとの値は残して、以下を書き換える
                modalBg:    'MODAL_inputDialog',
                modalWindow:'MODAL_inputDialog_window',
                btn1:       'MODAL_inputDialog_btn1',
                btn2:       'MODAL_inputDialog_btn2',
                message1:   'MODAL_inputDialog_message1',
                message2:   'MODAL_inputDialog_message2',
                inputText:  'MODAL_inputDialog_inputtext',
                modalClose: 'MODAL_inputDialog_close',
            };
            this.dispString = {
                ...this.dispString,
                message1:   'message line 1',
                message2:   'message line 2',
                btn1: 'CONFIRME',
                btn2: 'CANCEL',
            };
            this.setting = {
                ...this.setting,
                enableCloseByBGClick: true,
                enableCloseByCloseIcon: true,
            };
        }
        else if (modalType == modalType_EDITOR) {
            this.id = {
                ...this.id, // もとの値は残して、以下を書き換える
                modalBg:    'MODAL_editor',
                modalWindow:'MODAL_editor_window',
                btn1:       'MODAL_editor_btn1',
                btn2:       'MODAL_editor_btn2',
                message1:   'MODAL_editor_message1',
                editText:   'MODAL_editor_edittext',
                modalClose: 'MODAL_editor_close',
            };
            this.dispString = {
                ...this.dispString,
                btn1: 'SAVE',
                btn2: 'CANCEL'
            };
            this.setting = {
                ...this.setting,
                width_pct: 80,
                height_pct: 80,
                enableCloseByBGClick: true,
                enableCloseByCloseIcon: true,
            };
            
        }
        else if (modalType == modalType_VIEWER) {
            this.id = {
                ...this.id, // もとの値は残して、以下を書き換える
                modalBg:    'MODAL_viewer',
                modalWindow:'MODAL_viewer_window',
                btn1:       'MODAL_viewer_btn1',
                message1:   'MODAL_viewer_message1',
                editText:   'MODAL_viewer_edittext',
                modalClose: 'MODAL_viewer_close',
            };
            this.dispString = {
                ...this.dispString,
                btn1: 'CLOSE',
            };
            this.setting = {
                ...this.setting,
                width_pct: 80,
                height_pct: 80,
                enableCloseByBGClick: true,
                enableCloseByCloseIcon: true,
            };
            
        }
        else if (modalType == modalType_SELECTOR) {
            this.id = {
                ...this.id, // もとの値は残して、以下を書き換える
                modalBg:    'MODAL_fileSelector',
                modalWindow:'MODAL_fileSelector_window',
                btn1:       'MODAL_fileSelector_btn1',
                btn2:       'MODAL_fileSelector_btn2',
                //message1:   'MODAL_fileSelector_message1',
                //editText:   'MODAL_fileSelector_edittext',
                modalClose: 'MODAL_fileSelector_close',
            };
            this.dispString = {
                ...this.dispString,
                btn1: 'CONFIRME',
                btn2: 'CANCEL'
            };
            this.setting = {
                ...this.setting,
                height_pct: 80,
                enableCloseByBGClick: true,
                enableCloseByCloseIcon: true,
            };
        }
    }

    // 個別ハンドラ処理を設定する関数
    set_btn1Function(fn) {
        this.btn1Function = fn;
    };
    set_btn2Function(fn) {
        this.btn2Function = fn;
    };
    set_btn3Function(fn) {
        this.btn3Function = fn;
    };
    set_modalBgFunction(fn) {
        this.modalBgFunction = fn;
    };
    set_modalCloseFunction(fn) {
        this.modalCloseFunction = fn;
    };

    // 画面部品イベントハンドラ処理
    btn1Handler() {
        if (this.btn1Function() == true) {
	    this.hideModal();
        }
    }
    btn2Handler() {
        if (this.btn2Function() == true) {
	    this.hideModal();
        }
    }
    btn3Handler() {
        if (this.btn3Function() == true) {
	    this.hideModal();
        }
    }
    modalBgHandler(event) {
        if (event.target.id === this.id.modalBg) {
            if (this.setting.enableCloseByBGClick) {
                if (this.modalBgFunction() == true) {
	            this.hideModal();
                }
            }
        }
    }
    modalCloseHandler(event) {
        if (this.setting.enableCloseByCloseIcon) {
            if (this.modalCloseFunction() == true) {
	        this.hideModal();
            }
        }
    }

    // DOM要素にイベントリスナーを設定する共通関数
    addEventListenerToElement(id, event, handler) {
        const element = document.getElementById(id);
        if (element !== null) {
            element.addEventListener(event, handler);
        }
    }
    // DOM要素に表示文字列を設定する共通関数
    setDispStringToElement(id, dispString) {
        const element = document.getElementById(id);
        if (element !== null) {
            if (dispString !== '') {
                //element.TextContent = dispString;
                element.innerText = dispString;
            }
        }
    }
    setDispStringToElementValue(id, dispString) {
        const element = document.getElementById(id);
        if (element !== null) {
            element.value = dispString;
        }
    }
    // DOM要素からイベントリスナーを削除する共通関数
    removeEventListenerFromElement(id, event, handler) {
        const element = document.getElementById(id);
        if (element !== null) {
            element.removeEventListener(event, handler);
        }
    }
    // ダイアログを指定サイズで画面中央に配置
    setCenterDiv() {
        if (this.setting.width != 0) {
            const elementId = this.id.modalWindow;
            var width  = this.setting.width;
            var height = this.setting.height;
            if (this.setting.width_pct != 0){
                width = window.innerWidth * this.setting.width_pct / 100;
            }
            if (this.setting.height_pct != 0){
                height = window.innerHeight * this.setting.height_pct / 100;
            }
            const element = document.getElementById(elementId);
            if (element) {
                if (window != 0) {
                    element.style.width = `${width}px`;
                }
                if (height != 0) {
                    element.style.height = `${height}px`;
                }
                element.style.position = 'absolute';
                element.style.left = '50%';
                element.style.top = '50%';
                element.style.transform = 'translate(-50%, -50%)';
            }
        }
    }
    
    // モーダル状態有効化処理
    showModal()
    {
        if (this.modalEnabled === false)
        {
            this.modalEnabled = true;

	    // ハンドラの登録
            this.addEventListenerToElement(this.id.btn1, 'click', this.btn1Handler);
            this.addEventListenerToElement(this.id.btn2, 'click', this.btn2Handler);
            this.addEventListenerToElement(this.id.btn3, 'click', this.btn3Handler);
            this.addEventListenerToElement(this.id.modalBg, 'click', this.modalBgHandler);
            this.addEventListenerToElement(this.id.modalClose, 'click', this.modalCloseHandler);
            this.addEventListenerToElement(this.id.modalClose, 'click', this.modalCloseHandler);

	    // 表示の設定
            this.setDispStringToElement(this.id.btn1, this.dispString.btn1);
            this.setDispStringToElement(this.id.btn2, this.dispString.btn2);
            this.setDispStringToElement(this.id.btn3, this.dispString.btn3);
            this.setDispStringToElement(this.id.message1, this.dispString.message1);
            this.setDispStringToElement(this.id.message2, this.dispString.message2);
            this.setDispStringToElementValue(this.id.inputText, this.dispString.inputText);
            this.setDispStringToElementValue(this.id.editText, this.dispString.editText);
            // 表示を指定サイズにして画面センタリング
            this.setCenterDiv();
            this.setCenterDiv = this.setCenterDiv.bind(this);
            window.addEventListener('resize', this.setCenterDiv);            // ウィンドウサイズが変更されたときにスタイルを再適用
            
	    // モーダル有効化
	    document.getElementById(this.id.modalBg).style.display = 'block';
        }
    }

    // モーダル状態無効化処理
    hideModal()
    {
        if (this.modalEnabled === true)
        {
            this.modalEnabled = false;

	    // ハンドラの登録解除
            this.removeEventListenerFromElement(this.id.btn1, 'click', this.btn1Handler);
            this.removeEventListenerFromElement(this.id.btn2, 'click', this.btn2Handler);
            this.removeEventListenerFromElement(this.id.btn3, 'click', this.btn3Handler);
            this.removeEventListenerFromElement(this.id.modalBg, 'click', this.modalBgHandler);
            this.removeEventListenerFromElement(this.id.modalClose, 'click', this.modalCloseHandler);

	    // モーダル無効化
	    document.getElementById(this.id.modalBg).style.display = 'none';
        }
    }
}

const modal_controller = new modalController();
