class ReservationService:
    def __init__(self, payment_gateway, notification_service):
        self.payment_gateway = payment_gateway
        self.notification_service = notification_service 
        
        def reserve_flight(self, client_email, amount):
            if self.payment_gateway.process_payment(amount):
                return self.notification_service.send_confirmation( client_email, "Sua reserva foi confirmada." )
            return False