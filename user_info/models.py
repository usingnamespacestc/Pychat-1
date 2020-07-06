from django.db import models


class GroupChat(models.Model):
    group_id = models.CharField(primary_key=True, max_length=30)
    group_master_id = models.CharField(max_length=30)
    last_message_id = models.CharField(max_length=30)

    class Meta:
        db_table = 'group_chat'


class GroupChatMessage(models.Model):
    message_id = models.CharField(primary_key=True, max_length=30)
    content = models.CharField(max_length=30)
    message_type = models.CharField(max_length=30)
    old_file_name = models.CharField(max_length=30, blank=True, null=True)
    send_time = models.CharField(max_length=30)
    send_user_id = models.CharField(max_length=30)
    received_group_id = models.CharField(max_length=30)

    class Meta:
        db_table = 'group_chat_message'


class GroupUser(models.Model):
    group_id = models.CharField(primary_key=True, max_length=30)
    user_id = models.CharField(max_length=30)
    ulvgmid = models.CharField(max_length=30)

    class Meta:
        db_table = 'group_user'
        unique_together = (('group_id', 'user_id'),)


class PrivateChat(models.Model):
    message_id = models.CharField(primary_key=True, max_length=30)
    content = models.CharField(max_length=30)
    message_type = models.CharField(max_length=30)
    old_file_name = models.CharField(max_length=30, blank=True, null=True)
    send_time = models.CharField(max_length=30)
    send_user_id = models.CharField(max_length=30)
    read_user_id = models.CharField(max_length=30)
    boolread = models.IntegerField()

    class Meta:
        db_table = 'private_chat'


class User(models.Model):
    user_id = models.CharField(primary_key=True, max_length=30)
    nickname = models.CharField(max_length=30)
    pwd = models.CharField(max_length=30)
    icone = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'user'


class UserUser(models.Model):
    main_user_id = models.CharField(primary_key=True, max_length=30)
    vice_user_id = models.CharField(max_length=30)
    type = models.IntegerField()
    remark = models.CharField(max_length=30, blank=True, null=True)

    class Meta:
        db_table = 'user_user'


class Lable(models.Model):
    user_lable = models.CharField(max_length=30)
    user_id = models.ForeignKey(
        'UserUser', to_field='main_user_id', on_delete=models.CASCADE)

    class Meta:
        db_table = 'lable'


class Test(models.Model):
    test_id = models.CharField(primary_key=True, max_length=30)
    port = models.IntegerField(blank=True, null=True, default=22)

    class Meta:
        db_table = 'test'
