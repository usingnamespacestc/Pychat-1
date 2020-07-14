from channels.generic.websocket import WebsocketConsumer
import time
import json
# import linkdb.groups as groups
from asgiref.sync import async_to_sync
from linkdb.models import GroupChat as Group
from linkdb.models import GroupUser as GroupUser
from linkdb.models import UserUser as UserUser
from linkdb.models import User as User
from linkdb.models import PrivateChat as PrivateChat
class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.project_pk = self.scope['url_route']['kwargs']['user_id']
        self.group_id = self.project_pk
        print(self.project_pk)
        print("channel_name")
        print(self.channel_name)
        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.group_id,
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.group_id,
            self.channel_name
        )
    # Receive message from WebSocket
    def receive(self, text_data):
        # print(text_data)
        # print("channel_name %s" % self.channel_name)
        text_data_json = json.loads(text_data)
        if text_data_json['type'] == 'private':
            message = text_data_json['message']
            print(self.group_id)
            # Send message to room group
            stamp = int(time.time())
            msg = PrivateChat.objects.create(content=message, message_type='text', send_time=time.strftime("%Y-%m-%d %H:%M", time.localtime(stamp)), 
            send_user_id=self.group_id, read_user_id=text_data_json['rId'],boolread=0)
            msgid = getattr(msg, 'message_id')
            async_to_sync(self.channel_layer.group_send)(
                text_data_json['rId'],
                {
                    'type': 'status_message',
                    'message': message,
                    'sId': self.group_id,
                    'msgId': msgid
                }
            )
        elif text_data_json['type'] == 'privateFile':
            message = text_data_json['message']
            filename = text_data_json['message']
            stamp = int(time.time())
            msg = PrivateChat.objects.create(content=message, message_type='file', send_time=time.strftime("%Y-%m-%d %H:%M", time.localtime(stamp)), 
            send_user_id=self.group_id, read_user_id=text_data_json['rId'],boolread=0)
            msgid = getattr(msg, 'message_id')
            async_to_sync(self.channel_layer.group_send)(
                text_data_json['rId'],
                {
                    'type': 'status_message',
                    'message': message,
                    'sId': self.group_id,
                    'msgId': msgid
                }
            )
        elif text_data_json['type'] == 'group':
            message = text_data_json['message']
            gid = text_data_json['rId']
            users = GroupUser.objects.raw("select * from group_user where group_user.group_id = %d" % gid)
            for p in users:
                user_dict = {k: getattr(p, k) for k in ['user_id', 'nickname']}
                grouplist.append(user_dict)
            for i in users:
                print(i)
            async_to_sync(self.channel_layer.group_send)(
                
            )
        elif text_data_json['type'] == 'inviteFriend':
            tid = text_data_json['tId']
            message = "{}请求添加您为好友。".format(self.group_id)
            print("invite!!!!!!", tid)
            async_to_sync(self.channel_layer.group_send)(
                tid, {
                    'type': 'invatation_message',
                    'message': message,
                    'sId': self.group_id
                }
            )
        elif text_data_json['type'] == 'changeProfile':
            newdescription = text_data_json['description']
            nickname = text_data_json['nickname']
            User.objects.filter(user_id=self.group_id).update(nickname=nickname, description=newdescription)
            async_to_sync(self.channel_layer.group_send)(
                self.group_id,{
                    'type': 'operation_message',
                    'message': 'success'
                }
            )
        elif text_data_json['type'] == 'changeTag':
            mainid = self.group_id
            viceid = text_data_json['tId']
            newtag = text_data_json['tag']
            try:
                UserUser.objects.filter(main_user_id=mainid, vice_user_id=viceid).update(main_user_id=mainid, vice_user_id=viceid, tag=newtag)
                async_to_sync(self.channel_layer.group_send)(
                    self.group_id,{
                        'type': 'operation_message',
                        'message': "success"
                    }
                )
            except:
                async_to_sync(self.channel_layer.group_send)(
                    self.group_id,{
                        'type': 'operation_message',
                        'message': "failed"
                    }
                )
        elif text_data_json['type'] == 'createGroup':
            masterID = self.group_id
            try:
                group = Group.objects.create(group_master_id=masterID, last_message_id=0)
                gid = getattr(group, 'group_id')
                print(gid)
                GroupUser.objects.create(group_id=gid, user_id=self.group_id, ulvgmid=0)
                async_to_sync(self.channel_layer.group_send)(
                    self.group_id,{
                        'type': 'operation_message',
                        'message': "success"
                    }
                )
            except:
                async_to_sync(self.channel_layer.group_send)(
                    self.group_id,{
                        'type': 'operation_message',
                        'message': "failed"
                    }
                )
        elif text_data_json['type'] == 'addFriend':
            targetID = text_data_json['tId']
            try:
                UserUser.objects.create(main_user_id=self.group_id, vice_user_id=targetID, type='1', remark="好友", tag="")
                UserUser.objects.create(vice_user_id=self.group_id, main_user_id=targetID, type='1', remark="好友", tag="")
                async_to_sync(self.channel_layer.group_send)(
                    self.group_id,{
                        'type': 'operation_message',
                        'message': "success"
                    }
                )
            except:
                async_to_sync(self.channel_layer.group_send)(
                    self.group_id,{
                        'type': 'operation_message',
                        'message': "failed"
                    }
                )
    def operation_message(self, event):
        message = event['message']
        if message == "success":
            self.send(text_data=json.dumps({
                "success": True
            }))
        else:
            self.send(text_data=json.dumps({
                "error": True
            }))
    # Receive message from room group
    def status_message(self, event):
        # todo: get real status from service detection api
        message = event['message']
        sId = event['sId']
        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message,
            'sId': sId
        }))
    def invatation_message(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'Invitation': True,
            'message': message,
            'sId': event['sId']
        }))