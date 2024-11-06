from django.contrib import admin
from chat.models import *




class chatmodel(admin.ModelAdmin):

    list_display = [
        'id',
        'sender',
        'receiver',
        'message',
        'room_name',
        'DateTime'
    ]

    search_fields = [
        'id',
        'sender',
        'receiver',
        'message',
        'room_name',
        'DateTime'
    ]



admin.site.register(ChatStorageModel , chatmodel)