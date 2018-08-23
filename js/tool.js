/**
 * @desc 获取dom上的class值
 * @return {string} class字符串
 */
Element.prototype.getClass = function(){
  return this.getAttribute('class')
}

/**
 * @desc 给dom添加某个class
 * @param {string} className 
 */
Element.prototype.addClass = function(className){
  var cls = this.getClass(),
      reg = new RegExp(className,'gm');
  if(!reg.test(cls)){
    this.setAttribute('class', cls +' '+ className)
  }
  return this;
}

/**
 * @desc 移除dom上的某个class
 * @param {string} className 
 */
Element.prototype.removeClass = function(className){
  var cls = this.getClass()
  var arr = cls.split(' '+className)
  var newCls = ''
  for(var i=0;i<arr.length;i++){
    newCls += arr[i]
  }
  this.setAttribute('class', newCls)
}

/**
 * @desc 获取dom上的兄弟元素节点
 * @return {array} 数组
 */
Element.prototype.sibling = function(){
  var arr = [],
      nodes = this.parentNode.children;
  for(var i=0,len=nodes.length;i<len;i++){
    if(nodes[i] !== this){
      arr.push(nodes[i])
    }
  }
  return arr;
}

//兼容处理
requestAnimateFrame = (function(){
  return window.requestAnimationFrame || 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame || function(fn){
    return setTimeout(fn,17)
  }
}());

cancelAnimateFrame = (function(){
  return window.cancelAnimationFrame || 
  window.webkitCancelAnimationFrame || 
  window.mozCancelAnimationFrame || function(id){
    clearTimeout(id)
  }
}());