/**
 * 原生js选项卡插件
 * @auhtor addfun
 */
;(function(factory, root){
  factory(root);
}(function(root){

  //选项卡tab构造函数
  function TabFn(tab){
    this.init(tab)
  }

  TabFn.prototype={
    //将constructor指正
    constructor: TabFn,
    
    //构造函数入口
    init: function(tab){
      //将dom保存为实例的属性
      this.$tab = tab
      //默认配置参数
      this.config = {
        //用来定义鼠标的触发类型
        "triggerType": "mouseenter",//click
        //用来定义内容的切换效果
        "effect": "",//slider fade
        //默认显示第几张tab
        "invoke": 1,//1,2,3. <length
        //是否为自动轮播，几毫秒轮播间隔
        "auto": 3000
      }

      //获取配置参数
      this.getConfig()
      //设置配置
      this.setConfig()
      //绑定默认事件
      this.addEvent()

      //是否自动播放
      this.autoPlay()
      
    },

    //获取配置参数
    getConfig: function(){
      var $tab = this.$tab,
          getConfig = JSON.parse($tab.getAttribute('data-config'));
      extend(this.config,getConfig);

      //保存dom节点
      this.$titleItem = $tab.getElementsByClassName("tab-title-item");
      this.$contentItem = $tab.getElementsByClassName("tab-content-item");
    },
    
    //设置配置参数
    setConfig: function(){
      var invoke = this.config.invoke;
      this.timer = null
      this.loopIndex = invoke-1
      this.tabLength = this.$titleItem.length
      this.$titleItem[invoke-1].addClass('active')
      this.$contentItem[invoke-1].addClass('current')
      this.choseLoopFun()
    },
    //绑定事件函数
    addEvent: function(){
      var config = this.config,
          triggerType = config.triggerType == 'click' ? 'click' : 'mouseenter',
          _this = this,
          $tab = _this.$tab,
          $titleItem = _this.$titleItem;
      $tab.addEventListener('mouseenter', function(e){
        clearInterval(_this.timer);
      },true)
      $tab.addEventListener('mouseout', function(e){
        clearInterval(_this.timer);
        _this.autoPlay()
      },true)
      $tab.addEventListener(triggerType, function(e){
        var target = e.target || e.srcElement;
        if(target.className === 'tab-title-item'){
          var index = Array.prototype.indexOf.call($titleItem,target)
          _this.loopIndex = index;
          if(target.className.indexOf('active') !== -1 || target.className.indexOf('tab-title-item') === -1) return;
          target.sibling().forEach(function(el){
            el.removeClass('active');// this.classList.remove('active')
          })
          target.addClass('active');// this.classList.add('active')
          _this.choseLoopFun()
        }
      }, true)
    },
    //是否自动播放
    autoPlay: function(){
      var _this = this;
          auto = _this.config.auto;
      if(!auto) return;
      this.timer = setInterval(function(){
        _this.loopIndex++
        if(_this.loopIndex>=_this.tabLength){
          _this.loopIndex = 0
        }
        _this.loopFun();
      }, _this.config.auto)
    }, 
    //循环播放的函数
    loopFun: function(){
      var _this = this,
          loopIndex = _this.loopIndex,
          $titleItem = _this.$titleItem;
      $titleItem[loopIndex].addClass('active')
      $titleItem[loopIndex].sibling().forEach(function(el){
        el.removeClass('active')
      })
      _this.choseLoopFun()
    },
    //根据配置选择循环方法
    choseLoopFun: function(){
      var _this = this,
          config = _this.config;
      if(config.effect == 'fade'){
        _this.choseLoopFun = function(){
          var _this = this,
              $contentItem = _this.$contentItem,
              loopIndex = _this.loopIndex;
          $contentItem[loopIndex].sibling().forEach(function(el){
            _this.fadeOut(el);
          })
          _this.fadeIn($contentItem[loopIndex]);
        }
      }else{
        _this.choseLoopFun = function(){
          var _this = this,
            $contentItem = _this.$contentItem,
            loopIndex = _this.loopIndex;
          $contentItem[loopIndex].sibling().forEach(function(el){
            el.removeClass('current');
          })
          $contentItem[loopIndex].addClass('current');
        }
      }
    },
    //淡入
    fadeIn: function(dom, time){
      dom.addClass('current')
      dom.style.opacity = 0;
      move(dom,{opacity: 100},function(){
        // console.log('ok! 这是执行回调函数')
      },time)
    },

    //淡出
    fadeOut: function(dom, time){
      move(dom,{opacity: 0},function(){
        dom.removeClass('current')
      },time)
    }
  }

  //处理传过来的dom是否为类数组的形式 如果是 就实例化多个
  function initTabFn(dom){
    var len = dom.length
    if(len){
      for(var i=0;i<len;i++){
        new TabFn(dom[i])
      }
    }else{
      new TabFn(dom)
    }
  }

  root.TabFn = initTabFn //将initTabFn暴露给全局 该函数的上一级执行期上下文(ao)被外部的TabFn变量引用 形成闭包

  /*--------------------------------------------------------------------------------------
  以下是该组件用到的一些封装的方法(包括了公共方法，在这里也没作为全局来使用了（临时写的） 0..0！ )
  ---------------------------------------------------------------------------------------*/

  /**
   * @desc 运动类
   * t:当前时长
   * b:初始值
   * c:|最终值-初始值|
   * d:总时长
   */
  var moveStyle = {
    linear: function (t, b, c, d){  //匀速
      return c*t/d + b;
    },
    easeIn: function(t, b, c, d){  //加速曲线
      return c*(t/=d)*t + b;
    },
    easeOut: function(t, b, c, d){  //减速曲线
      return -c *(t/=d)*(t-2) + b;
    },
    easeBoth: function(t, b, c, d){  //加速减速曲线
      if ((t/=d/2) < 1) {
        return c/2*t*t + b;
      }
      return -c/2 * ((--t)*(t-2) - 1) + b;
    },
  }

  /**
   * @desc 获取dom元素计算后的样式
   * @param {object} dom 元素节点
   * @param {string} prop 元素css属性
   */
  function getStyle(dom, prop){
    if(window.getComputedStyle){
      getStyle = function(dom, prop){
        return getComputedStyle(dom, null)[prop]
      }
    }else{
      getStyle = function(dom, prop){
        return dom.currenStyle[prop]
      }
    }
    return getStyle(dom, prop)
  }

  /**
   * @desc 时间运动函数
   * @param {object} dom 元素节点
   * @param {object} json 元素css素性对象
   * @param {function} sucHandle 运动完成回调函数
   * @param {number} time 运动时间(默认400毫秒)
   */
  function move(dom, json, sucHandle, time){
    var iCurr = {},
        startTime = +new Date();
    if(typeof sucHandle != 'function'){
      time = arguments[2];
      sucHandle = null;
    }
    if(!time){
      time = 400;
    }
    for(var attr in json){
      if(attr == 'opacity'){
        iCurr[attr] = parseInt(getStyle(dom, attr)*100)
      }else{
        iCurr[attr] = parseInt(getStyle(dom, attr))
      }
    }
    animation()
    function animation(){
      cancelAnimationFrame(dom._timer_)
      var t = time- Math.max(0, startTime + time - (+new Date()));
      if(t < time){
        for(var attr in json){
          var s = iCurr[attr],
              l = json[attr] - s,
              p = moveStyle.easeIn(t, s, l, time);
          if(attr == 'opacity'){
            dom.style.opacity = p/100;
            dom.style.filter = 'alpha(opacity=' + p + ')';
          }else{
            dom.style[attr] = p + 'px';
          }
        }
        dom._timer_ = requestAnimationFrame(animation);
      }else{
        cancelAnimationFrame(dom._timer_)
        for(var attr in json){
          if(attr == 'opacity'){
            dom.style.opacity = json[attr] /100;
            dom.style.filter = 'alpha(opacity=' + json[attr] + ')';
          }else{
            dom.style[attr] = json[attr] + 'px';
          }
        }
        sucHandle && sucHandle();
      }
    }
  }

  /**
   * @desc 合并多个对象(依次从右往左覆盖)
   * @param {arguments} 第一个参数可选填为布尔值，来确定是否为深度克隆
   * @return {object} 返回合并后的对象
   */
  function extend(){
    var target = arguments[0] || {},
        deep = false,
        i = 1,
        len = arguments.length;
    if(typeof target === "boolean"){
      deep = target
      target = arguments[1] || {}
      i++
    }
    if(i === len){
      target = {}
      i--
    }
    for(;i<len;i++){
      clone(deep,target,arguments[i])
    }
    return target;
  }

  /**
   * @desc 克隆
   * @param {boolean} deep 是否为深度克隆
   * @param {object} target 目标对象
   * @param {object} origin 源对象
   * @return {object} 返回一个target对象
   */
  function clone(deep, target, origin){
    var target = target || {},
        objToString = Object.prototype.toString;
    for(var prop in origin){
      if(origin.hasOwnProperty(prop)){
        if(deep){
          if(typeof origin[prop] === "object" && origin[prop] !== null){
            if(objToString.call(origin[prop]) === "[object object]"){
              target[prop] = {};
            }else{
              target[prop] = [];
            }
            clone(deep,target[prop],origin[prop]);
          }else{
            target[prop] = origin[prop];
          }
        }else{
          target[prop] = origin[prop];
        }
      }
    }
    return target;
  }

  /* ---- */
}, window));
