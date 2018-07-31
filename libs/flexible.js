/**
 * 多屏幕匹配，
 * PSD图 w:750,样式文件计算rem公式：width / 40
 * 微信禁止用户缩放字体大小
 * time 2017-12-07 23:22
 */
(function (doc, win) {
	var docEl = doc.documentElement,
	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	recalc = function() {
		var clientWidth = docEl.clientWidth;
		if (!clientWidth) return;
		docEl.style.fontSize = 40 * (clientWidth / 750) + 'px';
	};

	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
	recalc();
	
	// 安卓，禁止用户缩放字号
	if (typeof window.WeixinJSBridge === 'object' && typeof window.WeixinJSBridge.invoke === 'function') {
		handleFontSize()
	} else {
		if (document.addEventListener) {
			document.addEventListener('WeixinJSBridgeReady', handleFontSize, false)
		} else if (document.attachEvent) {
			document.attachEvent('WeixinJSBridgeReady', handleFontSize)
			document.attachEvent('onWeixinJSBridgeReady', handleFontSize)
		}
	}
	function handleFontSize () {
		// 设置网页字体为默认大小
		window.WeixinJSBridge.invoke('setFontSizeCallback', {
			'fontSize': 0
		})
		// 重写设置网页字体大小的事件
		window.WeixinJSBridge.on('menu:setfont', function () {
			window.WeixinJSBridge.invoke('setFontSizeCallback', {
				'fontSize': 0
			})
		})
	}
})(document, window)
