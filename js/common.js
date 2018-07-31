(function() {
    window.common = {
        init: function() {
            // common.urls = 'http://121.41.86.29:8068/sddc'
            common.urls = 'http://test-live.seedland.cc/sddc'
            common.data = JSON.parse(localStorage.getItem('userInfo'))
            console.log(common.data.info.id)
        },
        replace: function(oTarget) { //-----绉婚櫎绌烘牸-----
            var re = /^\s*(.*?)\s*$/;
            return oTarget.replace(re, '$1');
        },

    }
    common.init() 
})()

function pop(text, sj) {
    var div = document.createElement('div');
    var shijian = sj ? sj : 2000;
    div.className = 'popDiv';
    div.innerText = text;
    document.body.appendChild(div);
    div.style.opacity = 1;
    setTimeout(function() {
        document.body.removeChild(div);
    }, 3000);
    return shijian;
}