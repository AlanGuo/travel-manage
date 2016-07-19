/**
 * @module binder
 * 绑定模块，提供双向绑定功能
 */
var selectors = '[bind-content],[bind-value],[bind-checked],[bind-file],[bind-attr]';

var binders = {
	value:function(node, onchange) {
		if(onchange){
			if(/input/i.test(node.tagName)){
		        node.addEventListener('keyup', function() {
		            onchange(node.value);
		        });
		    }
		    else if(/select/i.test(node.tagName)){
		    	node.addEventListener('change',function(){
		    		onchange(node.value);
		    	});
		    }
	    }
        return {
            updateProperty: function(value) {
                if (value !== node.value) {
                    node.value = value;
                }
            }
        };
    },
    checked:function(node, onchange){
    	if(onchange){
			if(/input/i.test(node.tagName)){
		        node.addEventListener('change', function() {
		            onchange(node.checked);
		        });
		    }
	    }
        return {
            updateProperty: function(value) {
                if (value !== node.value) {
                    node.checked = value;
                }
            }
        };
    },
    file:function(node, onchange){
    	if(onchange){
	        node.addEventListener('change', function() {
	            onchange(node.files);
	        });
	    }
        return {
            updateProperty: function(value) {
                if (value !== node.files) {
                    node.files = value;
                }
            }
        };
    },
    content: function(node) {
        return {
            updateProperty: function(value) {
                node.innerText = value;
            }
        };
    },
    click: function(node, onchange, object) {
        var previous;
        return {
            updateProperty: function(fn) {
                var listener = function(e) {
                    fn.apply(object, arguments);
                    e.preventDefault();
                };
                if (previous) {
                    node.removeEventListener(previous);
                    previous = listener;
                }
                node.addEventListener('click', listener);
            }
        };
    },
    attribute: function(node, onchange, object, attrname){
    	return {
            updateProperty: function(expr, attrname){
            	node.setAttribute(attrname,expr);
            }
        };
    }
};

var bindEngine = {
	bind:function(container, object){
		function getDirectObject(object, property){
			
			var getdo = function(object, propertyName){
				var val = object;
				//properties是对象
				if(/\./.test(propertyName)){
					var pnamearray = propertyName.split('.');
					for(var i=0;i<pnamearray.length-1;i++){
						if(val){
							val = val[pnamearray[i]];
						}
						else{
							break;
						}
					}
					return val;
				}
				else{
					return object;
				}
			}
			return getdo(object, property);
		}

		function parseExpr(expr, object){
			var props = expr.match(/\{.*?\}/),
				isexpr = false,
				dobjects = [],
				dproperties = [];

			if(props){
				for(var i=0;i<props.length;i++){
					props[i] = props[i].replace(/\{|\}/g,'');
					expr = expr.replace(new RegExp('\\{'+props[i].replace(/\(|\)/g,'\\$&')+'\\}','g'), props[i]);
					dobjects.push(getDirectObject(object,props[i]));
					dproperties.push(props[i].split('.').slice(-1)[0]);
				}
				isexpr = true;
			}
			if(!isexpr){
				dobjects.push(getDirectObject(object,expr));
				dproperties.push(expr.split('.').slice(-1)[0]);
			}

			return {
				dobjects:dobjects,
				dproperties:dproperties,
				isexpr:isexpr,
				getValue:function(){
					if(isexpr){
						with(object){
							return eval(expr);
						}
					}
					else{
						return dobjects[0][dproperties[0]];
					}
				}
			};
		}

		function bindObject(node, binderName, object, propertyName) {
			var objArray = [],
				unobserveArray = [];
			//绑定属性
			var bindProperty = function(bnName, propObj){
				var expr = propObj.expr,
					attr = propObj.attr;

				//从表达式中抓去属性值
				var parsedObj = parseExpr(expr, object);
				
				//控件值改变了更新对象
		        var updateValue = parsedObj.isexpr?null:function(newValue) {
		            parsedObj.dobjects[0][parsedObj.dproperties[0]] = newValue;
		        };

		        var binder = binders[bnName](node, updateValue, object, attr);
		        binder.updateProperty(parsedObj.getValue(),attr);

		        return {
		        	parsedObj:parsedObj,
		        	binder:binder,
		        	attribute:attr
		        };
			};

			for(var i=0;i<binderName.length;i++){
				objArray.push(bindProperty(binderName[i], propertyName[i]));
			}
			var observer = function(changes, dobject, dproperty, binder, val, attr) {
	            var changed = changes.some(function(change) {
            		if(dproperty == change.name  && 
            			change.object == dobject){
            			return true;
            		};
	            });
	            if (changed) {
	                binder.updateProperty(val,attr);
	            }
	        };

	        //数组observer
	        objArray.map(function(item,index){
	        	item.parsedObj.dobjects.map(function(dobjitem,dobjindex){
	        		var func = function(changes){
	        			observer(changes, dobjitem, item.parsedObj.dproperties[dobjindex], item.binder, item.parsedObj.getValue(), item.attribute);
	        		};
	        		unobserveArray.push({object:dobjitem,func:func});
	        		Object.observe(dobjitem, func);
	        	});
	        });

	        return {
	            unobserve: function() {
	            	unobserveArray.map(function(item){
	            		Object.unobserve(item.object, item.func);
	            	});
	            }
	        };
	    }

	    function bindCollection(node, array, object, parent) {
	    	array = array || [];
	    	var newNodeCollection = [];
	    	//捕捉自己并且把自己删除
	        function capture(original) {
	            var node = original.cloneNode(true);
	            if(Array.prototype.slice.call(parent.children).indexOf(original)>-1){
	            	parent.removeChild(original);
	            }
	            return {
	                insert: function() {
	                    var newNode = node.cloneNode(true);
	                    newNodeCollection.push(newNode);
	                    parent.appendChild(newNode);
	                    return newNode;
	                }
	            };
	        }

	        node.removeAttribute('bind-repeat');

	        parent = parent || node.parentNode;
	        var captured = capture(node);
	        var bindItem = function(obj) {
	        	//为每一个repeat元素设置绑定
	        	var elem = captured.insert()
	        	elem.style.display = '';
	            return bindEngine.bind(elem, obj);
	        };
	        //根据array生成bindings
	        var bindings = array.map(bindItem);


	        var arrObserver = function(changes) {
	            changes.forEach(function(change) {
	                var index = parseInt(change.name, 10), child;
	                if (isNaN(index)) return;
	                if (change.type === 'add') {
	                    bindings.push(bindItem(array[index]));
	                } else if (change.type === 'update') {
	                    bindings[index].unobserve();
	                    bindEngine.bind(parent.children[index], array[index]);
	                } else if (change.type === 'delete') {
	                    bindings.pop().unobserve();
	                    child = parent.children[index];
	                    child.parentNode.removeChild(child);
	                }
	            });
	        };

	        //observe array
	        Object.observe(array, arrObserver);

	        return {
	            unobserve: function() {
	                Object.unobserve(array, arrObserver);
	            },
	            newNodeCollection:newNodeCollection
	        };
	    }

		//是不是被repeat包裹的元素，是,返回false
		function isDirectNested(node) {
            node = node.parentElement;
            while (node) {
                if (node.getAttribute('bind-repeat')) {
                    return false;
                }
                node = node.parentElement;
            }
            return true;
        }

        //返回没有被repeat包裹的元素
        function onlyDirectNested(selector) {
        	if(container.length) {container = container[0];}
            var collection = container.querySelectorAll(selector);
            return Array.prototype.filter.call(collection, isDirectNested);
        }

        var bindings = onlyDirectNested(selectors).map(function(node) {
        	var bindType = [],
        		propertyName = [],
        		attributeName;

        	if(node.getAttribute('bind-value')){
        		bindType.push('value');
        		propertyName.push({expr:node.getAttribute('bind-value')});
        	}
        	if(node.getAttribute('bind-file')){
        		bindType.push('file');
        		propertyName.push({expr:node.getAttribute('bind-file')});
        	}
        	if(node.getAttribute('bind-checked')){
        		bindType.push('checked');
        		propertyName.push({expr:node.getAttribute('bind-checked')});
        	}
        	if(node.getAttribute('bind-content')){
        		bindType.push('content');
        		propertyName.push({expr:node.getAttribute('bind-content')});
        	}
        	if(node.getAttribute('bind-attr')){
        		var keyvalArray = node.getAttribute('bind-attr').split(',');
        		for(var i=0;i<keyvalArray.length;i++){
    				var keyval = /(.*?)=(.*)/.exec(keyvalArray[i]);
    				bindType.push('attribute');
    				propertyName.push({expr:keyval[2],attr:keyval[1]});
        		}
        	}
        	return bindObject(node, bindType, object, propertyName);

	    }).concat(onlyDirectNested('[bind-repeat]').map(function(node) {

	    	var arrayName = node.getAttribute('bind-repeat'),
	    		parent = node.parentNode,
	        	isexpr = false,
	        	collectionBinder,
	        	unobserveArray = [];

	        var parsedObj = parseExpr(arrayName,object);

	    	//绑定object
	    	var objObserver = function(changes, dproperty, dobject) {
	            var changed = changes.some(function(change) {
            		if(dproperty == change.name && change.object === dobject){
            			return true;
            		}
	            });
	            if (changed) {
	            	collectionBinder.newNodeCollection.map(function(item){
	            		parent.removeChild(item);
	            	});
	            	collectionBinder = bindCollection(node, parsedObj.getValue(), object, parent);
	            }
	        };
	        
	        collectionBinder = bindCollection(node, parsedObj.getValue(), object, parent);

	        parsedObj.dobjects.map(function(dobject,index){
	        	var func = function(changes){
	        		objObserver(changes, parsedObj.dproperties[index], dobject);
	        	};
	        	unobserveArray.push({object:dobject,func:func});
	        	Object.observe(dobject, func);
	        });	

	    	return {
	    		unobserve:function(){
	    			unobserveArray.map(function(item){
	    				Object.unobserve(item.object, item.func);
	    			});
	    			collectionBinder.unobserve();
	    		}
	    	}
	    }));
        return {
            unobserve: function() {
                bindings.forEach(function(binding) {
                    binding.unobserve();
                });
            }
        };
	}
};

module.exports = bindEngine;