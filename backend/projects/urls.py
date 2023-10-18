from django.urls import path
from .views import *

urlpatterns = [
	path('create/', ProjectCreateView.as_view(), name='create'),
	path('load/', ProjectDetailView.as_view(), name='load-projects'),
	path('delete/<int:pk>/', ProjectDeleteView.as_view(), name='delete-project'),
	path('task/create/', TaskCreateView.as_view(), name='task-create'),
	path('task/mine/', TaskListView.as_view(), name='user-task'),
	path('generate-report/', GenerateReportView.as_view(), name='generate_report'),
    path('task/comment/', CommentCreateView.as_view(), name='comment-create'),
    path('task/attach-file/', AttachFileAPIView.as_view(), name='attach-file'),
    path('task/start/<int:pk>/', StartTaskAPIView.as_view(), name='start-task'),
    path('task/finish/<int:pk>/', FinishTaskAPIView.as_view(), name='finish-task'),

]