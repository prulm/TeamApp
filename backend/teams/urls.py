from django.urls import path
from .views import *

urlpatterns = [
	path('create/', TeamCreateView.as_view(), name='create'),
	path('load/', TeamLoadView.as_view(), name='user-teams'),
	path('invite/', MemberCreateView.as_view(), name='member-add'),
	path('delete/<pk>/', TeamDeleteView.as_view(), name='delete-team'),
]