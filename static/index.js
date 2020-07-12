const bkSourceList = [
  'background:url("background_default.jpg");',
  'background:url("https://api.mz-moe.cn/img.php");' ,
  'background:url("https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture");'
]

function init() {
  let bkMode = 0
  bkMode = getCookie("bkMode")
  var bkSource = bkSourceList[bkMode - 1]  //数组是从0开始的 
  var attr = bkSource + `background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  overflow-y: hidden;
  overflow-x: hidden;`
  document.querySelector('body').setAttribute('style', attr)
}

function setCookie(cname,cvalue,exdays){
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000));
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname){
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}
const user_id = 'gck1'
const chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/' + user_id + '/');

var app = new Vue({
  el: "#container",//id选择
  data: {
    show: true,  //用于控制“登录”和“注册”的切换
    switchClass: "moveArea",
    isPassed: false,  //用于验证登录
    mainArea: 'mainAreaHidden',
    settingsDrawer: false,
    friendsDrawer:false,
    nickname: '',
    phonenumber: '',
    discription: '',
    options: [{//背景图片模式选择
      value: 1,
      label: '默认图片'
    }, {
      value: 2,
      label: '二次元图片'
    }, {
      value: 3,
      label: '国家地理图片'
    }, {
      value: 4,
      label: '自定义图片',
      disabled: true
    }],
    value: '',  //这个是干嘛用的，修改背景吗？
    firstPw: '',  //注册的第一个密码
    secondPw: '',  //注册的第二个密码
    regPermit: false,  //这个是true了，则允许发送注册请求
    recentFriends: [
      {name: "冷和华", avatar: "static/usr/1.jpg"}, 
      {name: "李安", avatar: "static/usr/2.jpg"},
      {name: "彭姝琪", avatar: "static/usr/3.jpg"},
      {name: "张世新", avatar: "static/usr/4.jpg"},
      {name: "赵伊洋", avatar: "static/usr/5.jpg"},
      {name: "刘泽秋", avatar: "static/usr/6.jpg"},
      {name: "王宇迪", avatar: "static/usr/7.jpg"},
      {name: "李童", avatar: "static/usr/8.jpg"},
      {name: "李晓莉", avatar: "static/usr/9.jpg"}
    ],
    inputContent: "",  //聊天框中输入的内容
    logUsername: "",  //登录的用户名和密码
    logPassword: "",
    regUsername: "",
    regPassword: ""
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
    changeBK(value) {  //有时间的话可以改成异步的
      setCookie("bkMode", value, 1)
      var bkSource = bkSourceList[value - 1]//数组是从0开始的 
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
      //document.cookie = "bkMode=" + bkMode  //保存当前背景设置在cookie中
    },
    pwBlur() {
      alert("yigiwoligiao")
    },
    chanegeClass1() {
      this.mainArea = 'mainArea'
    },
    tempLogin: function() {
      this.isPassed = true
      setTimeout(this.chanegeClass1, 665)
    },
    login() {
      if (this.logUsername === "") {
        alert("请输入用户名")
      }
      else if (this.logPassword === "") {
        alert("请输入密码")
      }
      else {
        let that = this
        axios.post('login/', {
          logUsername: this.logUsername,
          logPassword: this.logPassword
        })
        .then(function (response) {
          console.log(response)
          console.log(response['data'])
          if (response['data']['success']){
            console.log("nmsl")
            that.isPassed = true
            that.Authorization = response['data']['Authorization']
            // this.tempLogin()
            // this.isPassed = true
            setTimeout(that.chanegeClass1, 665)
          }
        })
        .catch(function(error) {
          console.log(error)
        })
      }
      // this.isPassed = true
      // setTimeout(this.chanegeClass1, 665)
    },
    errorHandler(){
      return true;
    },
    changePWD() {
      this.$prompt('请输入密码', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '这个密码👴不喜欢，你给👴换一个'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '密码修改成功！'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });       
      });
    },
    open1() {
      const h = this.$createElement;
      this.$notify({
        title: '输入提示',
        message: h('i', { style: 'color: teal'}, '两次输入的密码不一致，请仔细检查并重新输入！')
      });
    },
    open2() {
      const h = this.$createElement;
      this.$notify({
        title: '输入提示',
        message: h('i', { style: 'color: teal'}, '您没有输入密码！')
      });
    },
    judgePWD(){
      if (this.firstPw !== this.secondPw){
        this.open1()
      }
      else if (this.firstPw === '' || this.secondPw === '') {
        this.open2()
      }
      else {
        this.regPermit = true
      }
    },
    regSubmit() {
      if(this.regPermit){
        axios.post('/login/create', {
          regUsername: this.regUsername,
          regPassword: this.regPassword
        })
        .then(function (response) {
          console.log(response)
        })
        .catch(function(error) {
          console.log(error)
        })
      }
      else{
        this.judgePWD()
      }
    },
    exit(){
      window.location.href("/")
    },
    mousemove(e) {
      if (e.x === 0) {
        this.friendsDrawer=true
      }
    },
    sendMessage() {
      if (this.inputContent !== "") {
        alert(this.inputContent)
        this.inputContent = ""
      }
    },
    selectFriendToTalk(index) {
      this.recentFriends.unshift(...this.recentFriends.splice(index, 1))
      // console.log(this.recentFriends)
    }
  }
})