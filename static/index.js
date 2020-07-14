const bkSourceList = [
  'background:url("static/background_default.jpg");',
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

//iframe文件上传方法
var iframe = document.getElementById('iframe');
iframe.onload = function() {
  var data = {
    name: 'aym'
  };
  // 向domain2传送跨域数据
  iframe.contentWindow.postMessage(JSON.stringify(data), 'http://www.domain2.com');
};

// 接受domain2返回数据
window.addEventListener('message', function(e) {
  alert('data from domain2 ---> ' + e.data);
}, false);

// const user_id = 'gck1'
var chatSocket;

var time;
var normar_title=document.title;
document.addEventListener('visibilitychange', function () {
if (document.visibilityState == 'hidden') {
    clearTimeout(time);
    document.title = '客官请留步ε=ε=ε=┏(゜ロ゜;)┛';
} else {
    document.title = '你终于回来了(。・∀・)ノ';
    time=setTimeout(function(){ document.title = normar_title; }, 3000);
}
});	

var app = new Vue({
  el: "#container",//id选择
  watch: {
    //好友列表搜索关键字用的
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  data: {
    //用于保存自己的信息
    myUid: "",
    myIcon: "",
    myNickName: "",
    myDescription: "",
    otherIcon: "",
    allVisible: true,//因为我想开启只显示图片的模式，所以用这个控制所有元素的开关显示
    show: true,  //用于控制“登录”和“注册”的切换
    switchClass: "moveArea",
    isPassed: false,  //用于验证登录
    mainArea: 'mainAreaHidden',
    settingsDrawer: false,
    friendsDrawer:false,
    nickname: '',
    phonenumber: '',
    discription: '',
    allList :[],
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
    value: '',  //修改背景用的一个value
    firstPw: '',  //注册的第一个密码
    secondPw: '',  //注册的第二个密码
    regPermit: false,  //这个是true了，则允许发送注册请求
    
    inputContent: "",  //聊天框中输入的内容
    logUsername: "",  //登录的用户名和密码
    logPassword: "",
    regUsername: "",
    regPassword: "",
    
    //下面最近消息的列表
    recentFriends: [
      // {name: "冷和华", avatar: "static/usr/1.jpg"}, 
      // {name: "李安", avatar: "static/usr/2.jpg"},
      // {name: "彭姝琪", avatar: "static/usr/3.jpg"},
      // {name: "张世新", avatar: "static/usr/4.jpg"},
      // {name: "赵伊洋", avatar: "static/usr/5.jpg"},
      // {name: "刘泽秋", avatar: "static/usr/6.jpg"},
      // {name: "王宇迪", avatar: "static/usr/7.jpg"},
      // {name: "李童", avatar: "static/usr/8.jpg"},
      // {name: "李晓莉", avatar: "static/usr/9.jpg"}
    ],

    //以下是好友列表数据
      friendsDrawer:false,
      filterText: '',
      friendListData: [],
      //friendListData样式
      // friendListData: [{
      //   icon:"static/usr/4.jpg",
      //   key:"zsx",//key是username
      //   label:"张世新",  //label是昵称
      //   tag:["ldby","170711"],
      //   phonenum:"",
      //   description:"zsxldbyzsxldby",
      //   isFriend:true,//不然的话就在黑名单里
      // }, {
      //   icon:"static/usr/xw.jpg",
      //   key:"xw",
      //   label:"谢唯",
      //   tag:["xwxw","170710"],
      //   phonenum:"18610670712",
      //   description:"救命，我变成一只狗了。",
      //   isFriend:true,
      // }, {
      //   icon:"static/usr/3.jpg",
      //   key:"psq",
      //   label:"彭姝琪",
      //   tag:[],
      //   phonenum:"13661147840",
      //   description:"爱搓麻将的阔太太",
      //   isFriend:true,
      // }, {
      //   icon:"static/usr/5.jpg",
      //   key:"zyy",
      //   label:"赵伊洋",
      //   tag:[],
      //   phonenum:"13661147840",
      //   description:"我在我输入法的个人词典里都加了些什么",
      //   isFriend:true,
      // }],
      //用于好友管理的数据
      blacklist: [],//右边的表，也就是黑名单
      
      friendDetailVisible:false,
      friendManageVisible:false,
      addFriendVisible:false,
      editGroupVisible:false,
      searchFriendList: '',
      searchGroupList: '',
      userInfo:'',
      groupInfo:'',
      groupListData: [],//把群聊加在这里就能在左边显示了
      //用于标签的数据
        inputTagVisible: false,
        inputTagValue:'',
    //用于搜索新用户的数据
      searchNewFriend:'',
      potentialFriends: [],
      state: '',
      timeout:  null,
    //用于群聊列表的数据
      groupmemberlist:[],//右边的表，也就是群聊中的成员
      // groupListData: [{
      //   icon:"static/usr/xw.jpg",
      //   key:"0001",
      //   label:"谢唯的群聊",
      // }, {
      //   icon:"static/usr/3.jpg",
      //   key:"0002",
      //   label:"彭姝琪的群聊",
      // }],
      talkToWho: "欢迎使用PyChat",  //用于指示和谁聊天
      currentTalk: "",  //用于指示当前聊天的对象，如果是人，则为uid，如果是群，则为gid
      currentMessageList: [],  //用于保存和当前聊天对象的消息数组 
    //用于响应式消息通知的数据
    dialogArr : [],//消息通知
    numberOfNotification: 0,
  },
  methods: {
    changeProfile() {
      console.log("giaogiaogiao")
      chatSocket.send(JSON.stringify({'type':'changeProfile', 'description': this.myDescription, 'nickname': this.myNickName}))
    },
    //消息提示模块
    requestNotification(tit, sid) {
      const h1 = this.$createElement;
      const h2 = this.$createElement;
      this.dialogArr.push(this.$notify({
        title: tit,
        message: h1('p', null, [
          //h('span', null, '内容'),
          h2('button', {
            on:{
              click:function(){
                alert("你接受了该请求");
                console.log(sid)
                chatSocket.send(JSON.stringify({'type':'addFriend', 'tId':sid}))

              }
            }
          }, "接受")
        ]),
        position: 'top-right',
        duration: 0
      }));
    },
    //上方的提示 typ分别有"success""warning""error"或者""
    topNotification(mes, typ) {
      if(typ === ""){
        this.$message({
          message: mes,
        });
      }
      else{
        this.$message({
          message: mes,
          type: typ,
        });
      }
    },
    //右上角的提示（会自动关闭）
    rightNotification(tit, mes) {
      const h = this.$createElement;

      this.$notify({
        title: tit,
        message: h('i', { style: 'color: teal'}, mes)
      });
    },
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
    tempLogin() {
      this.isPassed = true
      setTimeout(this.chanegeClass1, 665)
    },
    login() {
      if (this.logUsername === "") {
        this.topNotification("请输入用户名", "error")
      }
      if (this.logPassword === "") {
        this.topNotification("请输入密码", "error")
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
            //console.log("nmsl")
            that.isPassed = true
            that.Authorization = response['data']['Authorization']
            
            // Vmasks: 这里我来搞定
            //以下部分用于初始化用户信息
            that.myUid = response.data.uid
            that.myIcon = response.data.icon
            that.myNickName = response.data.nickname
            that.myDescription = response.data.description
            //以下部分为初始化群列表
            that.groupListData = response.data.groupList
            //以下部分为初始化好友列表s
            for (friend of response.data.friendsList) {
              let tmp = {}
              tmp.icon = friend.icon
              tmp.key = friend.user_id
              tmp.label = friend.nickname
              tmp.description = friend.description
              tmp.isFriend = (friend.type === 1) ? true : false
              tmp.tag = ["好友"]
              tmp.messageList = []  //用于储存和此人的聊天记录，里面装对象，对象包含一个bool类型的变量，以判断是不是自己发送的
              tmp.counter = 0  //用于保存未读消息的数目
              tmp.hasRead = true
              // console.log(tmp)
              that.friendListData.push(tmp)
            }
            that.allList = response['data']['allList'];
            that.potentialFriends = that.allList;
            /*stc：这里是我的领域*/
            setCookie("Authorization", this.Authorization, 1)//将Authorization保存在cookie中，设置过期时间为1天
            //that.friendListData = response['friendList']//因为现在前后端还不一致所以不能直接赋值

            chatSocket = new WebSocket('ws://' + window.location.host + '/ws/chat/' + response['data']['uid'] + '/');  
            // Vmasks: 这块地方现在我说了算
            chatSocket.onmessage = function(e) {
              const data = JSON.parse(e.data);
              // console.log("nmhl")
              console.log(data);
              if (data["Invitation"]){
                app.requestNotification(data["message"], data["sId"])
                return ;
              }
              //收到消息后要把消息扔到对应的消息列表里
              let receivedFriend = that.friendListData.filter(function(item) {
                return item.key === data.sId
              })[0]
              
              receivedFriend.messageList.push({isMe: false, content: data.message})
              //更改相应的计数器和标志
              receivedFriend.counter++
              if (receivedFriend.hasRead === true) {
                receivedFriend.hasRead = false
              }
              //判断发来消息的人在不在recentList中
              let recentFriend = that.recentFriends.filter(function(item) {
                return item.key === data.sId
              }) 
              if (recentFriend.length === 0) {  //说明该好友不在recentList中
                that.recentFriends.unshift(that.friendListData.filter(function(item) {
                  return item.key === data.sId
                })[0])
              }
              else {  //在recentList中，则直接提前
                that.recentFriends.unshift(...that.recentFriends.splice(that.recentFriends.indexOf(recentFriend), 1))
              }
              // alert(data);
              // document.querySelector('#chat-log').value += (data.message + '\n');
            };
            
            setTimeout(that.chanegeClass1, 665)
          }
          else {
            //console.log("yigiwoligiao")
            that.topNotification("用户名或密码错误", "error")
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
    judgePWD(){
      if (this.firstPw === '' || this.secondPw === '') {
        this.topNotification("请完整输入两遍密码", "error")
      }
      else if (this.firstPw !== this.secondPw){
        this.topNotification("两次输入的密码不一致", "error")
      }
      else if (this.firstPw.length > 10) {
        this.topNotification("密码不允许超过10位", "error")
      }
      else {
        this.regPassword = this.firstPw
        this.regPermit = true
      }
    },
    regSubmit() {
      var that = this
      if(this.regPermit){
        console.log(this.regPassword)
        axios.post('/login/create', {
          regUsername: this.regUsername,
          regPassword: this.regPassword
        })
        .then(function (response) {
          console.log(response)
          console.log(response.data.success)
          if (response.data.success === true) {
            that.topNotification("注册成功", "success")
          }
          else {
            that.topNotification("注册失败" + response.data.error, "error")
          }
        })
        .catch(function(error) {
          that.topNotification("注册失败" + error, "error")
        })
      }
      else{
        this.judgePWD()
      }
    },
    mousemove(e) {
      if (e.x === 0) {
        this.friendsDrawer=true
      }
    },
    sendMessage() {  //发送消息
      if (this.inputContent !== "") {
        // alert(this.inputContent)
        var msg = this.inputContent
        this.inputContent = ""
        // console.log(msg)
        let currentTalkId = this.currentTalk
        if (currentTalkId !== "") {
          // console.log(msg)
          // console.log(this.currentTalk)
          chatSocket.send(JSON.stringify({'message':msg, "rId":currentTalkId, 'type':'private'}))
          // console.log(this.friendListData)
          // console.log(this.currentTalk)
          //发送消息后，将消息记录存到相应的数组中
          this.friendListData.filter(function(item) {
            return item.key === currentTalkId
          })[0].messageList.push({isMe: true, content: msg})

        }

      }
    },
    selectFriendToTalk(index) {
      this.talkToWho = this.recentFriends[index].label  //设置当前的聊天对象
      this.otherIcon = this.recentFriends[index].icon  //设置当前聊天对象的头像
      this.currentTalk = this.recentFriends[index].key
      this.currentMessageList = this.recentFriends[index].messageList

      this.recentFriends[index].counter = 0
      this.recentFriends[index].hasRead = true
      this.recentFriends.unshift(...this.recentFriends.splice(index, 1))
      // console.log(this.recentFriends)
    },
    sendInvitation(targetId){
      chatSocket.send(JSON.stringify({'type':'inviteFriend', 'tId':targetId}))
    },
    //以下是好友列表的方法
      //显示好友详情窗口
        showFriendDetail(userInfo){//最好每次都重新向服务器根据key获取信息，不要直接从scope.row里读，因为用户信息随时都有可能会被改变
          this.userInfo = userInfo
          this.friendDetailVisible = true
        },
      //打开好友管理窗口
        showFriendManage(){
          this.friendManageVisible = true
        },
      //以下是标签的方法
        handleTagClose(tag) {
          this.userInfo.tag.splice(this.userInfo.tag.indexOf(tag), 1);
        },
        showTagInput() {
          this.inputTagVisible = true;
          this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
          });
        },
        handleInputTagConfirm() {
          let inputTagValue = this.inputTagValue;
          if (inputTagValue) {
            this.userInfo.tag.push(inputTagValue);
          }
          this.inputTagVisible = false;
          this.inputTagValue = '';
        },
    //以下是好友管理的方法
      //在调试窗口输出列表移动了的信息，并且改变好友的type
        handleChange(value, direction, movedKeys) {
          console.log(value, direction, movedKeys);
          for(var i = 0; i < this.friendListData.length; i++) {
            if(this.friendListData[i].key == movedKeys[0]) {
              this.friendListData[i].isFriend = !this.friendListData[i].isFriend;
              break;
            }
          }
        },
      //从数组中找到元素并删除
        removeByKey(arrylist , val) {
          for(var i = 0; i < arrylist.length; i++) {
            if(arrylist[i].key == val) {
              arrylist.splice(i, 1);
              break;
            }
          }
        },
      //从列表中删除好友的方法，带confirm提示
        deleteFriend(key){
          this.$confirm('此操作将从列表中删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.removeByKey(this.friendListData, key)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
    //以下是群聊列表的方法
      //编辑群聊的窗口
        editGroup(groupInfo){
          this.groupInfo = groupInfo
          this.editGroupVisible = true
        },
    //好友列表和群聊列表的共同方法
      //点击了好友/群聊，此时应当切换聊天窗
        listSwitchFocus(row, event, column) {
          console.log(row, event, column)
          // console.log(row)
          //如果在最近聊天的好友里没有，则添加
          let index = this.recentFriends.indexOf(row)
          this.talkToWho = row.label  //设置当前的聊天对象
          this.currentTalk = row.key
          this.otherIcon = row.icon
          this.currentMessageList = row.messageList
          if (index == -1) {
            this.recentFriends.unshift(row)
            if (this.recentFriends.length > 9) {
              this.recentFriends.pop()  //移除最后一个元素
            }
          }
          else {  //已存在于recentList中，直接让其居于首位
            console.log(index)
            this.selectFriendToTalk(index)
          }
          
          // alert(row.label + "：别点了别点了，再点人傻了")
          // alert("id是这个：" + row.key)
        },
    //以下是添加好友的方法
      showAddFriend(){
        this.addFriendVisible = true
      },
    //以下是创建群聊的方法
      createGroup(){
        chatSocket.send(JSON.stringify({'type':'createGroup'}))
        alert("你创建成功了吗？不好说")
      },
    //退出登录,还需要加上删除cookie
      exit() {
        window.location.href="http://59.110.172.43:8000/"
        //此处再删除token即可
      },
    //以下是添加好友的方法
      //干脆直接获取所有用户列表得了，在前端再搜索
        loadAll() {
          // console.log(this.allList);
          return this.allList;
        },
      //在这里写从服务器加载用户列表，加载的结果存在this.potentialFriends
        querySearchAsync(queryString, cb) {
          var potentialFriends = this.potentialFriends;
          var results = queryString ? potentialFriends.filter(this.createStateFilter(queryString)) : potentialFriends;

          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(results);
          }, 3000 * Math.random());
        },
        createStateFilter(queryString) {
          return (state) => {
            return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
        },
        handleSelect(item) {
          // console.log(item)
          // console.log(item.value.split('(')[0])
          console.log(item.value.split('(')[0])
          this.sendInvitation(item.value.split('(')[0])
        },
  },
  //在网页加载完成之后就会执行
  mounted() {
    this.potentialFriends = this.allList;
  }
})