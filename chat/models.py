from django.db import models
from django.contrib.auth.models import User


class ChatStorageModel (models.Model):

    sender = models.ForeignKey(User , on_delete = models.CASCADE , related_name = 'msg_sender' )
    receiver = models.ForeignKey(User , on_delete = models.CASCADE , related_name = 'msg_receiver' )
    message = models.TextField()
    room_name = models.CharField(max_length=30 , default = None)
    DateTime = models.DateTimeField(auto_now_add=True)
    



