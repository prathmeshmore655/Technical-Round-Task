from channels.generic.websocket import AsyncWebsocketConsumer
import json
from datetime import datetime
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.db.models import Q




class ChatAppConsumer(AsyncWebsocketConsumer):



    async def connect(self):


        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.group_room_name = f'chat_{self.room_name}'



        await self.channel_layer.group_add(
            self.group_room_name,
            self.channel_name
        )

        await self.accept()





    async def receive(self, text_data):



        data = json.loads(text_data)




        if data.get("type") == "fetch_history":


            sender_id = data['sender']
            receiver_id = data['receiver']


            await self.chat_history(sender_id, receiver_id)



        elif data.get("type") == "typing":


            await self.handle_typing(data)


        


        else:



            message = data.get('message')
            sender_id = data['sender']
            receiver_id = data['receiver']


            await self.SaveChat(message, sender_id, receiver_id, self.room_name)




            await self.channel_layer.group_send(
                self.group_room_name,
                {
                    'type': 'chat_processing',
                    'message': message,
                    'sender': sender_id,
                    'receiver': receiver_id,
                    'now': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                }


            )






    async def chat_processing(self, event):



        message = event['message']
        sender = event['sender']
        receiver = event['receiver']
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")




        await self.send(
            text_data=json.dumps({
                "message": message,
                "sender": sender,
                "receiver": receiver,
                "now": current_time
            })
        )







    async def handle_typing(self, data):

        is_typing = data['is_typing']
        typer = data['typer']
        name = data['name']



        await self.channel_layer.group_send(
            self.group_room_name,
            {
                "type": "typing",  
                "status": is_typing,
                "typer": typer,
                "name": name
            }
        )




        

    async def typing(self, event):

        status = event["status"]
        typer = event["typer"]
        name = event["name"]


        await self.send(
            text_data=json.dumps({
                "type": "typing",
                "status": status,
                "typer": typer,
                "name": name
            })
        )




    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_room_name,
            self.channel_name
        )






    @database_sync_to_async
    def SaveChat(self, message, sender_id, receiver_id, room_name):


        from chat.models import ChatStorageModel, User


        try:

            sender = User.objects.get(id=sender_id)
            receiver = User.objects.get(id=receiver_id)


            ChatStorageModel.objects.create(
                sender=sender,
                receiver=receiver,
                message=message,
                room_name=room_name
            )


        except User.DoesNotExist:


            print("Sender or receiver does not exist")







    async def chat_history(self, sender_id, receiver_id):


        from chat.models import ChatStorageModel



        history = await sync_to_async(list)(

            ChatStorageModel.objects.filter(

                Q(sender_id=sender_id, receiver_id=receiver_id) |
                Q(sender_id=receiver_id, receiver_id=sender_id)

            ).order_by("DateTime")


        )



        history_data = [

            {
                "sender": await sync_to_async(lambda: message.sender.username)(),
                "receiver": await sync_to_async(lambda: message.receiver.username)(),
                "message": message.message,
                "datetime": message.DateTime.strftime("%Y-%m-%d %H:%M:%S"),
                "msg_type": 'text'
            }
            for message in history
        ]



        await self.send(
            text_data=json.dumps({
                "type": "history",
                "history": history_data
            })


            
        )
