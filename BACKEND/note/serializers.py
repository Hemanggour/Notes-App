from rest_framework import serializers

from note.models import Note


class NoteModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Note
        fields = [
            "note_uuid",
            "title",
            "content",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "note_uuid",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        note_obj = Note.objects.create(
            **self.context,
            **validated_data,
        )
        return note_obj
