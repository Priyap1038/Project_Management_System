from django.contrib import admin
from .models import Organization, Project, Task, Comment

# Register your models here.
@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display =("name","slug","contact_email","created_at")
    search_fields = ("name","contact_email")
    prepopulated_fields = {"slug":("name",)}


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name','organization',"status","due_date","created_at")
    list_filter = ("status","organization")
    search_fields = ("name","description")

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display =("title","project","status","assignee_email","due_date","created_at")
    list_filter = ("status","project")
    search_fields = ("title","description","assignee_email")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display =("content","task","author_email","timestamp")
    search_fields = ("content","author_email")
    list_filter = ("timestamp",)