var app = new Vue({
  el: "#container",//id选择
  data: {
    show: true,  //用于控制“登录”和“注册”的切换
    switchClass: "moveArea",
    bkIndex: 0,  //切换背景图用
    bkSourceList: [
      'background:url("background_default.jpg");',
      'background:url("https://api.mz-moe.cn/img.php");' ,
      'background:url("https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture");'
    ],
    isPassed: false,
    mainArea: 'mainAreaHidden',
    drawer: false,
    direction: 'rtl',
    h: 1,
    w: 1
  },
  methods: {
    changeShow() {
      if (this.show) {  //登录 -> 注册
        this.show = false
      }
      else {      //注册 -> 登录
        this.show = true
        this.switchClass = "moveAreaHidden"
        setTimeout(this.changeClass, 665)
      }
    },
    changeClass() {
      this.switchClass = "moveArea"
    },
    changeBk() {  //有时间的话可以改成异步的
      this.bkIndex++
      this.bkIndex %= 3
      var bkSource = this.bkSourceList[this.bkIndex] 
      var attr = bkSource + 'background-repeat: no-repeat;\
      background-attachment: fixed;\
      background-position: center;\
      background-size: cover;\
      -webkit-background-size: cover;\
      -moz-background-size: cover;\
      -o-background-size: cover;\
      overflow-y: hidden;\
      overflow-x: hidden;'
      document.querySelector('body').setAttribute('style', attr)
      //document.cookie = "bkIndex=" + bkIndex  //保存当前背景设置在cookie中
    },
    pass() {
      this.isPassed = true
      setTimeout(this.chanegeClass1, 665)
    },
    chanegeClass1() {
      this.mainArea = 'mainArea'
    },
    errorHandler(){
      return true;
    }
    
  },
})

