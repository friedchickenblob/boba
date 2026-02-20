from django.urls import path
from . import views

app_name = "food"

# urlpatterns contains all of the routes that this application supports routing for.
# this routes traffic from polls/ to the index function that we defined earlier in the views file.
urlpatterns = [
    path("", views.index, name="index"),
    path("boba/", views.boba_demo, name="boba_demo"),
]
