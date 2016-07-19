'use strict';


var $id = (0|(Math.random()*998));

var mp = {};
/**
 *@clas mm.Class
 */
mp.Class = function(){

}
/**
 *@method mm.Class.extend
 *@param prop {Object} 原型
 *@static
 *@example
 	var app = mm.Class.extend(prop)
 */
mp.Class.extend = function(prop){

	function Class(){

		var index = 0;

		this.$id = ++$id;

		if(this.ctor){
			this.ctor.apply(this,arguments);
		}
	}

	//父类的原型链
	var $super = this.prototype;
	//用父类的原型链创建一个新对象(复制)，用于继承
	var prototype = Object.create($super);
	var $superTest = /\.\$super\b/;

	Class.prototype = prototype;

	var description = { writable: true, enumerable: false, configurable: true };

	for(var name in prop){
		var isFunc = (typeof prop[name] === "function");
		//parent也有这个方法
        var override = (typeof $super[name] === "function");
        //并且有呼叫parent的方法
        var hasSuperCall = $superTest.test(prop[name]);

        if (isFunc && override && hasSuperCall) {

            description.value = (function (name, fn) {
                return function () {
                    var tmp = this.$super;
                    //父类的方法
                    this.$super = $super[name];
                    //运行结果
                    var result = fn.apply(this, arguments);
                    this.$super = tmp;

                    return result;
                };
            })(name, prop[name]);

            Object.defineProperty(prototype, name, description);

        } else if (isFunc) {
            description.value = prop[name];
            Object.defineProperty(prototype, name, description);
        } else {
            prototype[name] = prop[name];
        }

	}

	Class.extend = mp.Class.extend;

	return Class;
}

module.exports = mp;