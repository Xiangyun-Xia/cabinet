/**
 * Created by xxy on 2017/12/4.
 */

(function ($) {
    //设置默认参数
    var defaults = {
        //存放机柜的页面元素的id
        id: '',
        //机柜的宽度
        width: 180,
        //机柜的U数
        unit: 20,
        //每一U的高度
        height: 20,
        //是否显示层数提示
        unitNumShow: 0,
    };

    //定义插件的私有方法
    var rackMethod = {
        //加载html
        __initHtml: function (option) {
            // optUNS = option.unitNumShow
            //创建要返回的元素
            var node;
            //机柜最外层
            var rackBox = '<div class="rack-box" style="width: ' + option.width + 'px;  height: auto;">';
            //机柜里层
            var rackInnerBox = '<div class="rack-inner-box">';
            //机柜上方温度湿度显示区域
            var rackIndexBox = '<div class="rack-index-box" style="height: ' + option.height + 'px;"><span>温度<b id="' + option.id + '-temp">0</b>℃</span><span>湿度<b id="' + option.id + '-wetness">0%</b>RH</span></div>'
            node = rackBox + rackInnerBox + rackIndexBox;
            //机柜unit层集合
            var rackUnitBoxs = '';
            //循环创建机柜unit层
            for (let i = 0; i < option.unit; i++) {
                //判断是否需要显示层数提示
                if (option.unitNumShow) {
                    var text = null;
                    //不足10在前面补0
                    if ((i + 1) < 10) {
                        text = '0' + (i + 1);
                    } else {
                        text = i + 1;
                    }
                    var rackUnitBox = '<div class="rack-unit-box" style="height:' + option.height + 'px;line-height: ' + option.height + 'px" id="' + option.id + '-unitBox-' + (i + 1) + '">' + text + '</div>'
                } else {
                    var rackUnitBox = '<div class="rack-unit-box" style="height:' + option.height + 'px" id="' + option.id + '-unitBox-' + (i + 1) + '"></div>'
                }
                rackUnitBoxs = rackUnitBox + rackUnitBoxs;
            }
            //闭合div
            node = node + rackUnitBoxs + '</div></div>';
            return node;
        },

        //加载机柜
        __initRack: function (opt) {
            //覆盖默认参数
            var option = $.extend(true, {}, defaults, opt);
            //创建html
            var html = this.__initHtml(option);
            //将html放入指定元素内
            $('#' + option.id).append(html);
            //执行点击绑定
            this.__clickBind();
            //执行拖拽绑定（因为click执行了unbind，所以先绑定click后绑定drag）
            this.__dragBind();
        },

        //拖拽方法绑定
        __dragBind: function () {
            $('.rack-unit-box').bind({

                //设置允许放置
                dragover: function (e) {
                    e.preventDefault();
                },

                //设置拖拽进入时透明度变化（起提示作用）
                dragenter: function (e) {
                    // console.log(e);
                    $('#' + e.target.id).css('opacity', '0.5');
                },

                //拖拽离开时复原
                dragleave: function (e) {
                    // console.log(e);
                    $('#' + e.target.id).css('opacity', '1');
                },

                //放置时触发的方法
                drop: function (e) {
                    if (cabMethod.cabDrop) {
                        //执行用户定义的放置事件
                        cabMethod.cabDrop(e);
                    }
                },
            })
        },

        //点击方法绑定
        __clickBind: function () {
            //unbind()避免重复绑定
            $('.rack-unit-box').unbind().bind({
                //点击事件
                click: function (e) {
                    if (cabMethod.cabClick) {
                        //执行用户定义的点击事件
                        cabMethod.cabClick(e);
                    }
                },
            })
        },
    };

    //定义插件暴露的方法
    var cabMethod = {

        //点击
        cabClick: "",

        //放置
        cabDrop: "",

        /**
         * 添加设备
         * @param e 添加的容器的信息
         * @param dev 添加的设备的信息
         */
        addDevice: function (e, dev) {
            //如果没有传入设备大小，给定默认值为1U，避免报错
            if (!dev.size) {
                dev.size = {
                    height: 1,
                    width: 1,
                }
            }
            //判断该设备的大小
            if (dev.size.height == 1 && dev.size.width == 1) {
                //将背景图片换成传入的图片并将透明度重置为1
                $('#' + e.target.id).css({
                    'background-image': 'url("' + dev.imgUrl + '")',
                    'opacity': '1'
                });
                //添加指示灯，默认为绿色
                // $('#' + e.target.id).html('<span class="rack-unit-light rack-unit-redlight"></span>')
                $('#' + e.target.id).html('<span class="rack-unit-light rack-unit-greenlight"></span>')
                // $('#' + e.target.id).html('<span class="rack-unit-light rack-unit-yellowlight"></span>')
                //给div内添加设备的信息
            } else {
                //计算还需要占用的U层
                var nextNum = dev.size.height - 1;
                //设置空间是否足够的标记
                var enoughFlag = true;
                //获取下边需要占用的U层的div组成的数组
                var arr = $('#' + e.target.id).prevAll(':lt(' + nextNum + ')')

                console.log(arr);
                //判断下边需要占用的U层是否已有设备
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].innerHTML.length > 2) {
                        enoughFlag = false;
                        break;
                    }
                }
                //判断空间是否足够
                if (arr.length < nextNum || !enoughFlag) {
                    alert("可用空间不足，请保证放置的Unit上方有足够的空间");
                    //恢复样式
                    $('#' + e.target.id).css('opacity', '1');
                } else {
                    //将下面占用的U层隐藏
                    $('#' + e.target.id).prevAll(':lt(' + nextNum + ')').css(
                        'display', 'none'
                    )
                    //设置背景
                    $('#' + e.target.id).css({
                        'height': e.target.clientHeight * dev.size.height + 'px',
                        'line-height': e.target.clientHeight * dev.size.height + 'px',
                        'width': e.target.clientWidth * dev.size.width + 'px',
                        'background-image': 'url("' + dev.imgUrl + '")',
                        'opacity': '1'
                    });
                    //获取层数
                    if ($('#' + e.target.id).html()) {
                        //计算层数
                        var unitsStart = $('#' + e.target.id).html();
                        var unitsEnd = +$('#' + e.target.id).html() + nextNum;
                        if (unitsEnd < 10) {
                            unitsEnd = '0' + unitsEnd;
                        } else {
                            unitsEnd = '' + unitsEnd;
                        }
                        var unitsShow = unitsStart + '~' + unitsEnd;
                        $('#' + e.target.id).html(unitsShow + '<span class="rack-unit-light rack-unit-greenlight"></span>')
                    } else {
                        //添加指示灯，默认为绿色
                        $('#' + e.target.id).html('<span class="rack-unit-light rack-unit-greenlight"></span>')
                    }
                    //传入设备信息
                }


            }
        },

        //删除设备
        removeDevice:function () {

        },


        //恢复初始状态
        resetUnit: function (e) {
            $('#' + e.target.id).css('opacity', '1');
        },

        /**
         * 刷新设备状态
         * @param id 机柜容器的id
         * @param dev 该机柜内所有设备的状态
         */
        refreshStatus: function (id, dev) {
            //更新温度湿度
            $('#' + id + '-temp').html(dev.temp);
            $('#' + id + '-wetness').html(dev.wetness);
            //更新设备状态

        }

    };

    function cabinet(opt) {
        rackMethod.__initRack(opt);
    }

    window.cabinet = cabinet;
    window.cabMethod = cabMethod;
})(jQuery);