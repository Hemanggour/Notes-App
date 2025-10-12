from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from note.models import Note
from note.serializers import NoteModelSerializer
from utils.response_wrapper import formatted_response

User = get_user_model()


class NotesView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    class NotesGetSerializer(serializers.Serializer):
        note_uuid = serializers.ListField(
            child=serializers.UUIDField(),
            required=False,
            read_only=False,
        )

    class NotesPostSerializer(serializers.Serializer):
        title = serializers.CharField(required=True, max_length=255, allow_blank=False)
        content = serializers.CharField(
            required=True, max_length=settings.MAX_CONTENT_LENGTH, allow_blank=False
        )

    class NotesDeleteSerializer(serializers.Serializer):
        note_uuid = serializers.ListField(
            child=serializers.UUIDField(required=True, allow_null=False),
            required=True,
            read_only=False,
        )

    class NotesPatchSerializer(serializers.Serializer):
        note_uuid = serializers.UUIDField(required=True)
        title = serializers.CharField(required=False, max_length=255, allow_blank=False)
        content = serializers.CharField(
            required=False, max_length=settings.MAX_CONTENT_LENGTH, allow_blank=False
        )

    def get(self, *args, **kwargs):
        query_data = {
            "notes_uuids": self.request.query_params.getlist("note_uuid"),
        }

        notes_get_serializer = self.NotesGetSerializer(data=query_data)

        notes_get_serializer.is_valid(raise_exception=True)
        notes_uuids = notes_get_serializer.validated_data.get("notes_uuids", [])

        user_obj = self.request.user

        query = {
            "user": user_obj,
        }

        if notes_uuids:
            query["note_uuid__in"] = notes_uuids

        notes_data = Note.objects.filter(**query).order_by("-created_at")

        return formatted_response(
            data=NoteModelSerializer(notes_data, many=True).data,
            status=status.HTTP_200_OK,
        )

    def post(self, *args, **kwargs):
        serializer = self.NotesPostSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        title = serializer.validated_data.get("title", None)
        content = serializer.validated_data.get("content", None)

        if not title or not content:
            return formatted_response(
                message={"error": "No title or content provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_obj = self.request.user

        note_model_serializer = NoteModelSerializer(
            data={
                "title": title,
                "content": content,
            },
            context={"user": user_obj},
        )
        note_model_serializer.is_valid(raise_exception=True)
        note_obj = note_model_serializer.save()

        return formatted_response(
            data=NoteModelSerializer(note_obj).data,
            status=status.HTTP_201_CREATED,
        )

    def delete(self, *args, **kwargs):
        notes_get_serializer = self.NotesDeleteSerializer(data=self.request.data)
        notes_get_serializer.is_valid(raise_exception=True)
        notes_uuids = notes_get_serializer.validated_data.get("note_uuid", [])

        user_obj = self.request.user

        if not notes_uuids:
            return formatted_response(
                message={"error": "No note UUIDs provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        note_obj = Note.objects.filter(user=user_obj, note_uuid__in=notes_uuids)

        if not note_obj:
            return formatted_response(
                message={"error": "No notes found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        note_obj.delete()

        return formatted_response(
            message={"success": "Notes deleted successfully."},
            status=status.HTTP_200_OK,
        )

    def patch(self, *args, **kwargs):
        serializer = self.NotesPatchSerializer(data=self.request.data)
        serializer.is_valid(raise_exception=True)
        note_uuid = serializer.validated_data.get("note_uuid", None)
        title = serializer.validated_data.get("title", None)
        content = serializer.validated_data.get("content", None)

        user_obj = self.request.user

        if not note_uuid:
            return formatted_response(
                message={"error": "No notes provided."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            note_obj = Note.objects.get(user=user_obj, note_uuid=note_uuid)
        except Note.DoesNotExist:
            return formatted_response(
                message={"error": "Note not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if content is not None:
            note_obj.content = content

        if title is not None:
            note_obj.title = title

        note_obj.save()

        return formatted_response(
            data=NoteModelSerializer(note_obj).data,
            status=status.HTTP_200_OK,
        )
