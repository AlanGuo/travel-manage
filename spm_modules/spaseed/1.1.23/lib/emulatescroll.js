'use strict';

/**
 * 模拟滚动
 * @method emulateScroll
 * @param  {Object} scrollElem 任意对象
 */
var emulateScroll =function(scrollElem){
	var startMove = false,
        initY = 0,
        containerInitY = 0,
        containerMoveY = 0;

    scrollElem.on('touchstart',function(evt){
        startMove = true;
        initY = evt.touches[0].clientY;
    });
    scrollElem.on('touchmove',function(evt){
        if(startMove){
            var disY = evt.touches[0].clientY - initY;
            containerMoveY = containerInitY + disY;
            var max = scrollElem.prop('clientHeight')-scrollElem.prop('scrollHeight');
            var val = 0;
            if(containerMoveY < 0 && containerMoveY > max){
            	val = containerMoveY;
            }
            else if(containerMoveY>0){
            	val = 0;
                containerMoveY = 0;
            }
            else if(containerMoveY<max){
            	val = max;
                containerMoveY = max;
            }
            else{
            	val = containerMoveY;
                containerMoveY = containerInitY;
            }
            scrollElem.children(':first-child').css('-webkit-transform','translate3d(0,'+val+'px,0)');

            //把移动的值，写入属性中
            scrollElem.attr('data-scrolltop',-val);
            //scrollElem.scrollTop(-val);
            var evt = $.Event('scroll');
			scrollElem.trigger(evt);
        }
    });
    scrollElem.on('touchend',function(){
        startMove = false;
        containerInitY = containerMoveY;
        containerMoveY = 0;
    });
};

module.exports = emulateScroll;