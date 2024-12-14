from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from apps.user.models import User

@shared_task
def send_welcome_email(user_id):
    try:
        user = User.objects.get(id=user_id)
        subject = 'Bienvenido a nuestro Blog!'
        message = f'Hola {user.username}, ¡gracias por unirte a nuestra plataforma!'
        send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
        print(f"Correo enviado a {user.email}")
    except User.DoesNotExist:
        print(f"User with id {user_id} does not exist")
    except Exception as e:
        print(f"Error al enviar correo: {e}")
