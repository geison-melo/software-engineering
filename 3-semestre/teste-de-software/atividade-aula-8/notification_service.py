class NotificationService:
    def send_confirmation(self, email, message):
        return bool(email and message)