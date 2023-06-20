# Telegram Bridge
Simple Telegram Bridge is a minimalist application designed to bridge the gap between your systems and Telegram. 
It allows you to automatically register users via a Telegram bot using their phone numbers. 
It also provides a convenient POST endpoint for sending notifications.
It use PostgreSQL database for storing users, phones and messages.

## Prerequisites
Before you begin, ensure you have met the following requirements:
* Node.js (v14.0.0 or later)
* npm (v6.0.0 or later)
* A valid Telegram Bot Token. If you don't have one, you can generate it following these [instructions](https://core.telegram.org/bots#botfather)
## Installation
1. Clone the repository:
```
git clone https://github.com/Neshyk/TelegramBridge.git
```
2. Navigate into the project directory:
```
cd telegramBridge
```
3. Install dependencies:
```
npm install
```
4. Create a .env file and add your Postgre SQL connection string:
```
DATABASE_URL=postgres://user:password@localhost:5432/TelegramBridge
```
5. Start the server:
```
npm run start
```
Your Telegram Bridge should now be up and running!
6. Add you bot token to the database table Bots
```
INSERT INTO public."Bots"(token, "lastMessageId", "createdAt", "updatedAt")
	VALUES (token, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); 
```

## Usage
To register users, they should initiate a conversation with your Telegram bot. The bot will automatically register their phone number.
To send notifications to a registered user, use the /notify/sendMessage endpoint.
## API Documentation
### POST /notify/sendMessage
Sends a message to a registered user.
Request body:
```
{
  "phoneNumber": "+380971545445",
  "text": "Notify message"
}
```
* phoneNumber: A string that represents the phone number of the user. It should include the international code.
* text: A string that contains the message to be sent to the user.
## Support
If you encounter any problems or have suggestions, please open an issue at https://github.com/Neshyk/TelegramBridge/issues
## License
Simple Telegram Bridge is released under the MIT License.
