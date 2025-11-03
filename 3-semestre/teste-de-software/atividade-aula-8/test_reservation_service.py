import unittest
from unittest.mock import Mock 
from reservation_service import ReservationService
from notification_service import NotificationService

class TestReservationService(unittest.TestCase):
    
    def test_reserva_com_sucesso(self):
        """
        Verifica se uma reserva é concluída com sucesso.
        Espera-se que o mock de pagamento retorne True (sucesso),
        e que o método 'process_payment' seja chamado com o valor correto.
        O resultado final da reserva deve ser True.
        """
        payment_mock = Mock()
        payment_mock.process_payment.return_value = True 
        stub = NotificationService()
        
        service = ReservationService(payment_mock, stub)
        result = service.reserve_flight("cliente@teste.com", 500.0)
        
        self.assertTrue(result)
        payment_mock.process_payment.assert_called_with(500.0)
    
    def test_falha_pagamento(self): 
        """
        Verifica se a reserva falha quando o processamento do pagamento não é bem-sucedido.
        Espera-se que o mock de pagamento retorne False (falha),
        e que o método 'process_payment' seja chamado.
        O resultado final da reserva deve ser False.
        """
        payment_mock = Mock() 
        payment_mock.process_payment.return_value = False
        stub = NotificationService() 
 
        service = ReservationService(payment_mock, stub) 
        result = service.reserve_flight("cliente@teste.com", 500.0) 
 
        self.assertFalse(result) 
        payment_mock.process_payment.assert_called_with(500.0) 
 
    def test_email_invalido(self): 
        """
        Verifica se a reserva é negada quando um email inválido (vazio) é fornecido.
        Espera-se que a reserva retorne False e, crucialmente,
        que o método 'process_payment' NÃO seja chamado, pois a validação do email
        deve ocorrer antes de qualquer tentativa de pagamento.
        """
        payment_mock = Mock() 
        payment_mock.process_payment.return_value = True # Valor de retorno irrelevante, pois não deve ser chamado
        stub = NotificationService() 
 
        service = ReservationService(payment_mock, stub) 
        result = service.reserve_flight("", 500.0) 
        
        self.assertFalse(result)
        payment_mock.process_payment.assert_not_called()
    
    def test_pagamento_com_valor_zero(self):
        """
        Adicionando um novo teste para um comportamento inesperado: valor de pagamento zero.
        Verifica se a reserva é recusada quando o valor do pagamento é 0.0.
        Espera-se que a reserva retorne False e que o processamento do pagamento
        NÃO seja chamado, pois não há pagamento a ser feito.
        """
        payment_mock = Mock()
        payment_mock.process_payment.return_value = True
        stub = NotificationService()

        service = ReservationService(payment_mock, stub)
        result = service.reserve_flight("cliente@teste.com", 0.0) # Valor de pagamento zero

        self.assertFalse(result) # Confirma que a reserva falhou para valor zero
        payment_mock.process_payment.assert_not_called() # Verifica que o pagamento não foi processado

# Comparação das Abordagens de Mock e Stub:

# Mock (payment_mock):
# O 'payment_mock' (do 'unittest.mock') é um objeto que simula o comportamento do 'PaymentService' real.
# É usado para:
# 1. Controlar o resultado de um método ('process_payment.return_value = True/False'), permitindo testar
#    cenários de sucesso e falha do pagamento sem depender de um serviço de pagamento real.
# 2. Verificar interações ('payment_mock.process_payment.assert_called_with()'). Isso valida que o código
#    sob teste ('ReservationService') interagiu com o 'PaymentService' mockado da maneira esperada (com
#    os argumentos corretos e no momento certo).
# Mocks são "objetos com verificação de comportamento", que não só simulam, mas também registram as interações.

# Stub (stub = NotificationService()):
# O 'stub' é uma instância da classe 'NotificationService'. No contexto de um stub, essa classe
# teria uma implementação simplificada ou vazia para seus métodos (por exemplo, 'notify_user' poderia
# simplesmente conter 'pass').
# É usado para:
# 1. Preencher uma dependência: O 'ReservationService' precisa de um 'NotificationService' para ser
#    instanciado, mesmo que o foco do teste não seja a notificação. O stub provê essa interface.
# 2. Evitar efeitos colaterais: Garante que a lógica de notificação não gere problemas ou dependências
#    externas (como envio real de e-mails) durante o teste do 'ReservationService'.
# Stubs são "objetos que fornecem respostas pré-definidas ou vazias" e não são usados para verificar interações;
# seu propósito é permitir que o código testado funcione sem erros devido a dependências.

# Em resumo: O Mock é interativo e "observa" o que acontece com ele, permitindo verificações pós-execução.
# O Stub é mais passivo, apenas oferecendo uma implementação mínima para que o código possa rodar,
# sem verificar se foi chamado ou como.

if __name__ == "__main__": 
    unittest.main()