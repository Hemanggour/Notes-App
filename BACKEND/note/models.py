import uuid

from django.contrib.auth import get_user_model
from django.db import models

# Create your models here.
User = get_user_model()


class Note(models.Model):
    note_uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["note_uuid"]),
        ]

    def __str__(self):
        return self.title
