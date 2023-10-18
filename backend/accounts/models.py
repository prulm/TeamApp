from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class UserAccountManager(BaseUserManager):
	def create_user(self, first_name, last_name, email, password=None):
		if not email:
			raise ValueError('User must have an email address')

		email = email.lower()
		user = self.model(email=email, first_name=first_name, last_name=last_name)
		user.set_password(password)
		user.save()
		return user

	def create_superuser(self, first_name, last_name, email, password=None):
		user = self.create_user(first_name, last_name, email, password)
		user.is_superuser = True
		user.save()
		return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
	first_name = models.CharField(max_length=255)
	last_name = models.CharField(max_length=255)
	email = models.EmailField(max_length=255, unique=True)
	is_active = models.BooleanField(default=True)

	objects = UserAccountManager()

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['first_name', 'last_name']

	def get_full_name(self):
		return self.first_name+" "+self.last_name

	def get_short_name(self):
		return self.first_name

	def __str__(self):
		return self.email
