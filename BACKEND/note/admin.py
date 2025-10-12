from django.contrib import admin

from note.models import Note

# Register your models here.


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("note_uuid", "title", "content", "created_at")
    search_fields = ("title", "content")
    readonly_fields = ("note_uuid", "created_at", "updated_at")

    def has_add_permission(self, request):
        return True

    def has_delete_permission(self, request, obj=None):
        return True
