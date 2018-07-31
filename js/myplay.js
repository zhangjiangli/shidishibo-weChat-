 $(function() {

     //导航菜单
     var mescrollArr = new Array(12); //每个菜单对应一个mescroll对象
     //当前菜单下标
     var curNavIndex = 0;
     //初始化首页
     mescrollArr[curNavIndex] = initMescroll(curNavIndex);

     /*切换列表*/
     function changePage(i) {
         if (curNavIndex != i) {
             //更改列表条件
             var curNavDom; //当前菜单项
             $("#nav li").each(function(n, dom) {

                 if (dom.getAttribute("i") == i) {
                     dom.classList.add("active");
                     curNavDom = dom;
                 } else {
                     dom.classList.remove("active");
                 }
             });
             //菜单项居中动画
             var scrollxContent = document.getElementById("scrollxContent");
             var star = scrollxContent.scrollLeft; //当前位置
             var end = curNavDom.offsetLeft + curNavDom.clientWidth / 2 - document.body.clientWidth / 2; //居中

             //隐藏当前回到顶部按钮

             //取出菜单所对应的mescroll对象,如果未初始化则初始化
             if (mescrollArr[i] == null) {
                 mescrollArr[i] = initMescroll(i);
             } else {
                 //检查是否需要显示回到到顶按钮
                 var curMescroll = mescrollArr[i];
                 var curScrollTop = curMescroll.getScrollTop();
                 if (curScrollTop >= curMescroll.optUp.toTop.offset) {
                     curMescroll.showTopBtn();
                 } else {
                     curMescroll.hideTopBtn();
                 }
             }
             //更新标记
             curNavIndex = i;
         }
     }

     /*创建MeScroll对象*/
     function initMescroll(index) {}

     /*联网加载列表数据  page = {num:1, size:10}; num:当前页 从1开始, size:每页数据条数 */
     function getListData(page) {}

     function getListDataFromNet(curNavIndex, pageNum, pageSize, successCallback, errorCallback) {}


     $('.foot_btn>div').on('click', function() {
         $(this).addClass('active').siblings().removeClass('active')
     })
     var tipiv = new Vue({
         el: '#app',
         data: {
             //上拉刷新
             upData: '',
             upText: '上拉刷新更多',
             upHtml: false,
             challenge: '',
             business: '',
             upload: '',
             swiper: '',
             page: '',
             //当前选中那个
             indexTapCheck: 0,
             //业务列表当前选中
             indexbusiCheck: -1,
             // 项目id
             projectId: '',
             //页数
             pageNum: 1,
             sieve: true
         },
         methods: {
             nick: function(tems) {
                 location.href = '../spotvideo/play.html?id=' + tems.id
             },
             bus: function(index, items) {
                 if (tipiv.indexbusiCheck == index) {
                     tipiv.indexbusiCheck = -1
                     tipiv.projectId = ''
                 } else {
                     tipiv.indexbusiCheck = index
                     tipiv.projectId = items.id
                 }
                 $(".navMian").css('top', '-20rem')
                 $(".screen-img img").css('transform', 'rotate(-180deg)')
                 $("#mask").hide()

                 //  tipiv.challenge[tipiv.indexTapCheck].pageNum = 1
                 tipiv.challenge[tipiv.indexTapCheck].pageNum = 1
                 tipiv.challenge[tipiv.indexTapCheck].list = []
                 tapList()
             }
         },
         mounted: function() {
             /* 项目列表请求 */
             $.ajax({
                 url: common.urls + '/project/classifyList.do',
                 dataType: 'json',
                 type: 'get',
                 data: {
                     userId: common.data.info.id,
                     type: '1',
                     state: '1'
                 },
                 success: function(data) {
                     if (data.status == 10001) {
                         for (var i = 0; i < data.dataInfo.info.length; i++) {
                             data.dataInfo.info[i].list = []
                             data.dataInfo.info[i].pageNum = 1
                         }
                         tipiv.challenge = data.dataInfo.info
                         tipiv.challenge[tipiv.indexTapCheck].pageNum = 1
                         tipiv.indexbusiCheck = -1
                         tipiv.projectId = ''
                         tapList()
                         tipiv.$nextTick(function() {
                             /*菜单点击事件*/
                             $("#nav li").click(function() {
                                 var i = Number($(this).attr("i"));
                                 tipiv.swiper.slideTo(i); //以轮播的方式切换列表
                                 tipiv.indexTapCheck = i

                                 $(".navMian").css('top', '-20rem')
                                 $(".screen-img img").css('transform', 'rotate(-180deg)')
                                 $("#mask").hide()
                                 tipiv.sieve = true
								 select();
                             })
                             select()
                         })


                         tipiv.$nextTick(function() {

                             /*初始化轮播*/
                             tipiv.swiper = new Swiper('#swiper', {
                                 onTransitionEnd: function(swiper) {
                                     var i = swiper.activeIndex; //轮播切换完毕的事件
                                     changePage(i);
                                     tipiv.indexTapCheck = i
                                     var left = 0
                                     tipiv.challenge[tipiv.indexTapCheck].pageNum = 1
                                     tipiv.indexbusiCheck = -1
                                     tipiv.projectId = ''
                                     tipiv.challenge[tipiv.indexTapCheck].list = []
                                     tapList()
                                     if ($("#scrollxContent").scrollLeft() + $("#nav li").eq(i).offset().left - $("#scrollxContent").width() / 2 >= 0) {
                                         left = $("#scrollxContent").scrollLeft() + $("#nav li").eq(i).offset().left - $("#scrollxContent").width() / 2 + 38
                                     }
                                     $("#scrollxContent").scrollLeft(left);
                                     tipiv.upData.update()
                                     tipiv.upData.slideTo(0, 0, false);
                                 }
                             });
                             // 初始化上拉刷新
                             tipiv.upData = new Swiper('#upData', {
                                 direction: 'vertical',
                                 slidesPerView: 'auto',
                                 mousewheelControl: true,
                                 freeMode: true,
                                 observer: true, //修改swiper自己或子元素时，自动初始化swiper
                                 observeParents: true, //修改swiper的父元素时，自动初始化swiper
                                 onTouchEnd: function(swiper) {
                                     var _viewHeight = document.getElementById('upData').offsetHeight;
                                     var _contentHeight = document.getElementById('slide').offsetHeight;
                                     if (tipiv.upData.translate <= _viewHeight - _contentHeight && tipiv.upData.translate < 0) {
                                         tapList()
                                     }
                                     if (tipiv.upData.translate >= 50) {
                                         tipiv.upHtml = true
                                         tipiv.challenge[tipiv.indexTapCheck].pageNum = 1
                                         tipiv.indexbusiCheck = -1
                                         tipiv.projectId = ''
                                         tipiv.challenge[tipiv.indexTapCheck].list = []
                                         tapList()
                                     }
                                 }
                             })
                         })
                     } else(
                         pop(data.msg)
                     )

                 },
                 error: function(data) {

                 }
             })

         },

     })

     function tapList(data) {
         if (tipiv.upText == '加载中..') {
             return
         }
         tipiv.upText = '加载中..'
             /* 视频列表 */
         $.ajax({
             url: common.urls + '/video/list.do',
             dataType: 'json',
             type: 'get',
             data: {
                 userId: common.data.info.id,
                 projectId: tipiv.challenge[tipiv.indexTapCheck].id,
                 serviceId: tipiv.projectId,
                 page: tipiv.challenge[tipiv.indexTapCheck].pageNum++
             },
             success: function(data) {

                 if (data.status == 10001) {
                     console.log(data)
                     tipiv.upHtml = false
                     if (data.dataInfo.info.length <= 0) {
                         tipiv.upText = '没有更多了'
                     } else {
                         tipiv.upText = '上拉加载更多'
                     }

                     tipiv.challenge[tipiv.indexTapCheck].list = tipiv.challenge[tipiv.indexTapCheck].list.concat(data.dataInfo.info)
                     tipiv.$nextTick(function() {

                         tipiv.upData.update()
                     })
                 } else {
                     tipiv.upText = '上拉加载更多'
                     pop(data.msg)
                 }
             },

             error: function(data) {
                 tipiv.upText = '上拉加载更多'
             }
         })



     }

     function select() {
         tipiv.business = []
             /* 业务列表请求 */
         $.ajax({
             url: common.urls + '/project/classifyList.do',
             dataType: 'json',
             type: 'get',
             data: {
                 userId: common.data.info.id,
                 type: '2',
                 projectId: tipiv.challenge[tipiv.indexTapCheck].id
             },
             success: function(data) {
                 if (data.status == 10001) {
                     tipiv.business = data.dataInfo.info
                     console.log(tipiv.business)
                     tipiv.$nextTick(function() {
                         // 点击显示筛选
                         $(".screentrue").on("click", function() {
                             select()
                             if (tipiv.sieve == true) {
                                 $(".navMian").css('top', '4.8rem')
                                 $(".screen-img img").css('transform', 'rotate(-0deg)')
                                 $("#mask").show()
                                 $(this).removeClass('screentrue').addClass('screenfalue')
                                 tipiv.sieve = false
                             } else {
                                 $(".navMian").css('top', '-12rem')
                                 $(".screen-img img").css('transform', 'rotate(-180deg)')
                                 $("#mask").hide()
                                 tipiv.sieve = true
                             }
                         })
                         $("#mask").on("click", function() {
                             $(".navMian").css('top', '-12rem')
                             $(".screen-img img").css('transform', 'rotate(-180deg)')
                             $("#mask").hide()
                             tipiv.sieve = true
                         })
                     })
                 } else {
                     pop(data.msg)
                 }
             },
             error: function(data) {
                 console.log(data)
             }
         })
     }
 })