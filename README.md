Chat App

A real-time chat application built with Django Channels, WebSockets, and Redis, enabling users to communicate instantly. This app supports text messaging, and future updates will include media sharing functionality.
Table of Contents

    Features
    Getting Started
    Tech Stack
    Installation
    Usage
    Project Structure
    Configuration
    Troubleshooting
    Planned Features
    Contributing

Features

    Real-time messaging with WebSocket support.
    User login and authentication.
    Client-side search functionality.
    Text messaging with plans for media sharing.
    Typing indicators for active users.

Getting Started

These instructions will help you set up and run the chat app on your local machine.
Tech Stack

    Frontend: HTML, CSS, JavaScript
    Backend: Django, Django Channels, WebSockets
    Database: SQLite (for development purposes)
    Message Broker: Redis (running locally)
    ASGI Server: Daphne

Installation
1. Clone the Repository

        git clone https://github.com/your-username/chat-app.git
        cd chat-app

2. Create and Activate a Virtual Environment

        python -m venv venv
        source venv/bin/activate   # For macOS/Linux
        venv\Scripts\activate      # For Windows

3. Install Dependencies

        pip install -r requirements.txt

4. Set up Redis

Ensure Redis is installed and running on your local machine. You can start it with:

    redis-server

5. Run Migrations

        python manage.py migrate

6. Create a Superuser (for admin access)

        python manage.py createsuperuser

        Note: The project includes a default superuser:

        Username: admin
        Password: admin@123

7. Start the Development Server

        daphne -p 8080 ChatAppTask.asgi:application

Usage

    Access the Chat App: Open your browser and go to http://127.0.0.1:8000/.

    Login/Register:
        Create a new account or log in with an existing account to access the chat interface.

    Start Chatting:
        Start real-time messaging by entering a chat room.

Project Structure

    index.html: Main page for user authentication and registration.
    home.html: Chat room interface, where users can send and receive messages.
    create_account.html: Form for creating a new account.
    home.js: Client-side JavaScript to manage WebSocket connections and UI updates.
    consumers.py: WebSocket consumers handle real-time data transmission.
    routing.py: Routes for WebSocket connections.
    views.py: Manages application views and user authentication.
    settings.py: Contains project configurations, including Redis setup.

Configuration

Ensure that Django Channels is configured to connect to Redis. In settings.py, verify the Redis configuration:

      CHANNEL_LAYERS = {
          'default': {
              'BACKEND': 'channels_redis.core.RedisChannelLayer',
              'CONFIG': {
                  "hosts": [('127.0.0.1', 6379)],
              },
          },
      }

Troubleshooting

    Redis Connection: If the app fails to connect to Redis, make sure Redis is running on 127.0.0.1:6379.
