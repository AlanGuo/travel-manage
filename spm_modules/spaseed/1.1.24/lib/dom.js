'use strict';

var $ = function(selector,doc){
	var elemarray;
	if(/element/i.test(Object.prototype.toString.call(selector))){
		elemarray = [selector];
	}
	else if(/array|nodelist/i.test(Object.prototype.toString.call(selector))){
		elemarray = selector;
	}
	else{
		elemarray = Array.prototype.slice.call((doc||document).querySelectorAll(selector));
	}

	//模拟jquery方法
	elemarray.append = function(elem){
		if(/array/i.test(Object.prototype.toString.call(elem))){
			for(var i=0;i<elem.length;i++){
				elemarray[0].appendChild(elem[i]);
			}
		}
		else{
			elemarray[0].appendChild(elem);
		}

		return elemarray;
	};
	elemarray.remove = function(){
		for(var i=0;i<elemarray.length;i++){
			if(elemarray[i].parentNode){
				elemarray[i].parentNode.removeChild(elemarray[i]);
			}
		}
		return elemarray;
	};
	elemarray.children = function(){
		return Array.prototype.slice.call(elemarray[0].children);
	};
	elemarray.html = function(content){
		if(content!=null){
			for(var i=0;i<elemarray.length;i++){
				elemarray[i].innerHTML = content;
			}
		}
		else{
			return elemarray[0].innerHTML;
		}
	};
	elemarray.val = function(content){
		if(content!=null){
			for(var i=0;i<elemarray.length;i++){
				elemarray[i].value = content;
			}
		}
		else{
			return elemarray[0].value;
		}
	};
	elemarray.text = function(content){
		if(content!=null){
			for(var i=0;i<elemarray.length;i++){
				elemarray[i].innerText = content;
			}
		}
		else{
			return elemarray[0].innerText;
		}
	};
	elemarray.addClass = function(className){
		if(className){
			className = className.trim();
			for(var i=0;i<elemarray.length;i++){
				if(!new RegExp('(^|\\s)'+className+'(\\s|$)').test(elemarray[i].className)){
					elemarray[i].className += ' '+className;
				}
			}
		}
		return elemarray;
	};
	elemarray.removeClass = function(className){
		if(className){
			className = className.trim();
			for(var i=0;i<elemarray.length;i++){
				if(new RegExp('(^|\\s)'+className+'(\\s|$)').test(elemarray[i].className)){
					elemarray[i].className = elemarray[i].className.replace(new RegExp('(^|\\s)'+className+'(\\s|$)'),' ');
				}
			}
		}
		return elemarray;
	};
	elemarray.hasClass = function(className){
		return new RegExp('(^|\\s)'+className+'(\\s|$)').test(elemarray[0].className);
	};
	elemarray.attr = function(name,val){
		if(val!=null){
			for(var i=0;i<elemarray.length;i++){
				elemarray[i].setAttribute(name,val);
			}
			return elemarray;
		}
		else{
			return elemarray[0].getAttribute(name);
		}
	};
	elemarray.prop = function(name,val){
		if(val){
			for(var i=0;i<elemarray.length;i++){
				elemarray[i][name] = val;
			}
			return elemarray;
		}
		else{
			return elemarray[0][name];
		}
	};
	elemarray.removeAttr = function(name){
		for(var i=0;i<elemarray.length;i++){
				elemarray[i].removeAttribute(name);
			}
		return elemarray;
	};
	elemarray.data = function(name, val){
		if(val!=null){
			for(var i=0;i<elemarray.length;i++){
				elemarray[i].setAttribute('data-'+name,val);
			}
			return elemarray;
		}
		else{
			return elemarray[0].getAttribute('data-'+name);
		}
	};
	elemarray.show = function(){
		for(var i=0;i<elemarray.length;i++){
			elemarray[i].style.display = '';
		}
		return elemarray;
	};
	elemarray.hide = function(){
		for(var i=0;i<elemarray.length;i++){
			elemarray[i].style.display = 'none';
		}
		return elemarray;
	};
	elemarray.find = function(selector){
		return $(elemarray[0].querySelectorAll(selector));
	};
	elemarray.css = function(obj,val){
		if(val==null){
			if(/string/i.test(typeof obj)){
				return window.getComputedStyle(elemarray[0])[obj];
			}else{
				for(var i=0;i<elemarray.length;i++){
					for(var p in obj){
						elemarray[i].style[p] = obj[p];
					}
				}
			}
		}else{
			for(var i=0;i<elemarray.length;i++){
				elemarray[i].style[obj] = val;
			}
		}
		return elemarray;
	};
	elemarray.width = function(){
		return elemarray[0].clientWidth;
	};
	elemarray.height = function(){
		return elemarray[0].clientHeight;
	};
	elemarray.click = function(){
		return elemarray[0].click();
	};
	elemarray.each = function(func){
		for(var i=0;i<elemarray.length;i++){
			func(elemarray[i],i);
		}
	};

	return elemarray;
};

//extend方法
$.extend=function(){
	var args = Array.prototype.slice.call(arguments);
	for(var i = args.length-1;i>0;i--){
		for(var p in args[i]){
			args[i-1][p] = args[i][p];
		}
	}
	return args[0];
};

//ajax方法
$.ajax = function(options){
	options = options || {};
	options.method = options.method || 'GET';
	options.url = options.url || '';
	options.async = options.async || true;
	options.data = options.data || '';
	options.header = options.header || {};
	options.contentType = options.contentType===undefined?'application/x-www-form-urlencoded':options.contentType;
	if(/get/i.test(options.method)){
		options.contentType = 'application/x-www-form-urlencoded';
	}

	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		var ret = JSON.parse(xhr.responseText);
		if(options.success){
			options.success(ret);
		}
	}
	xhr.onerror = function(){
		if(options.error){
			options.error(xhr);
		}
	};
	xhr.upload.onprogress = function(evt){
		if(options.uploadProgress){
			options.uploadProgress(evt, xhr);
		}
	};

	var str = options.data;
	if(options.contentType === 'application/x-www-form-urlencoded'){
		str = '';
	    for(var p in options.data){
	    	str+=encodeURIComponent(p)+'='+encodeURIComponent(options.data[p])+'&';
	    }
	    str = str.substring(0,str.length-1);

	    if(/get/i.test(options.method)){
	    	options.url += '?'+str;
	    	str = '';
	    }
	}

    xhr.open(options.method,options.url,options.async);
    if(options.contentType!==false && options.contentType!==null){
    	xhr.setRequestHeader('Content-Type', options.contentType);
    }
    for(var p in options.header){
    	xhr.setRequestHeader(p, options.header[p]);
    }
    xhr.send(str);

    return xhr;
};

module.exports = $;
