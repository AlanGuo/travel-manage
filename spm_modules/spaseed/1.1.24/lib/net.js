'use strict';

var mp = require('mp'),
    $ = require('$');

var console = window.console;

/**
 * 网络请求
 * @class net
 * @static
 */
var Net = mp.Class.extend({
    $app:null,
    ctor:function(app){
        this.$app = app;
    },
    
    _progressBar:[],

    /**
     * GET请求
     * @method get
     * @param  {String}   url    URL
     * @param  {Object}   data   参数
     * @param  {Function} cb     回调函数
     */
    get: function (url, data, type, cb, uploadProgress) {
        return this._ajax(url, data, 'GET', type, cb, uploadProgress);
    },
    
    /**
     * POST请求
     * @method post
     * @param  {String}   url    URL
     * @param  {Object}   data   参数
     * @param  {Function} cb     回调函数
     */
    post: function (url, data, type, cb, uploadProgress) {
        return this._ajax(url, data, 'POST', type, cb, uploadProgress);
    },

    request:function(options){
        var self = this;
        var request = options.request || {},
            data = options.data,
            success = options.success,
            error = options.error,
            uploadProgress = options.uploadProgress,
            button = options.button,
            type = options.contentType || request.contentType,
            eventName = null;
            //恢复按钮
            if(button){
                var $button =  $(button);
                eventName = $button.addClass('disabled').data('click-event');
                $button[0].removeAttribute('data-click-event');
            }

        var cb = function(ret,info){
            if($button){
                $button.removeClass('disabled')[0].setAttribute('data-click-event', eventName);
            }
            var _code = ret.code;

            var breakdefault = false;
            
            ret.caller = self.caller;
            if (_code === 0) {
                if(success){
                    breakdefault = success(ret.data,info);
                }
            } else {
                if(error){
                    breakdefault = error(ret.msg,_code,ret.data,info);
                }
            }

            if(self.$app.config.netback && !breakdefault){
                self.$app.config.netback.call(self.$app,options,ret,info);
            }
        }
        if(request.fakecallback){
            request.fakecallback(data, cb);
        }
        else{
            this[(request.method || 'get').toLowerCase()](request.url, data, type, cb, uploadProgress);
        }
    },

    _ajax: function (url, data, method, type, cb, uploadProgress) {
        var self =this;
        var returnVal = null;
        var progressBar = null;

        if(this.$app.config.xhrProgress){
            progressBar = self._showProgress();
        }

        var starttime = +new Date();
        this.isBusy = true;
        (function(pbar){
            returnVal = $.ajax({
                contentType:type,
                method: method,
                type: method,
                url: url,
                data: data,
                success: function (ret) {
                    self.isBusy = false;
                    self._hideProgress(pbar);
                    cb(ret, {starttime:starttime});
                },
                uploadProgress:function(evt){
                    uploadProgress && uploadProgress(evt);
                },
                error: function (jqXHR) {
                    self.isBusy = false;
                    self._hideProgress(pbar);
                    var ret = {};
                    try{
                        ret = JSON.parse(jqXHR.responseText);
                    }
                    catch(e){
                        console.error('jqXHR.responseText parse error');
                        ret.code = jqXHR.status;
                        ret.msg = jqXHR.statusText;
                        ret.data = {};
                    }
                    cb(ret, {starttime:starttime});
                }
            });
            if(pbar){
                returnVal.onprogress = function(evt){
                    var progressWidth = ((evt.loaded / (evt.total || (evt.loaded>1000?evt.loaded:1000))) * pbar.clientWidth*0.99) | 0;
                };
            }
        })(progressBar);

        return returnVal;
    },

    _showProgress: function(){
        var progressBar = document.createElement('div');
        progressBar.setAttribute('style', 'position:fixed;height:3px;top:0;background:green;'+
            'transition:all .6s ease;width:0;z-index:100');

        document.body.appendChild(progressBar);
        progressBar.style.width = document.body.clientWidth+'px';

        return progressBar;
    },

    _hideProgress: function(elem){
        if(elem){
            document.body.removeChild(elem);
        }
    },

    _addParam: function (url, p) {
        var s = /\?/.test(url) ? '&' : '?';
        url += s + objectToParams(p);
        return url;
    }
});

Net.create = function(mpNode){
    return new Net(mpNode);
};

module.exports = Net;