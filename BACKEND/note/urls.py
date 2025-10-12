from django.urls import path

from note.views import NotesView

urlpatterns = [
    path("", NotesView.as_view(), name="note_view"),
]
