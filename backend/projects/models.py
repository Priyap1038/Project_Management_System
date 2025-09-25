from django.db import models
from django.utils import timezone


STATUS_CHOICES =[
    ("ACTIVE","Active"),
    ("COMPLETED","Completed"),
    ("ON-HOLD","On-Hold")
]

TASK_STATUS_CHOICES = [
    ("TODO", "To Do"),
    ("IN_PROGRESS", "In Progress"),
    ("DONE", "Done"),
]


# Create your models here.
class Organization(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    contact_email = models.EmailField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

class Project(models.Model):

    organization = models.ForeignKey(Organization, on_delete = models.CASCADE, related_name="projects")
    name = models.CharField(max_length=200) # type: ignore
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices = STATUS_CHOICES, default="ACTIVE")
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name
    

class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=200)
    description = models.TextField(blank= True)
    status = models.CharField(max_length=20, choices=TASK_STATUS_CHOICES, default="TODO") #type: ignore
    assignee_email = models.EmailField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete= models.CASCADE, related_name="comments")
    content = models.TextField()
    author_email = models.EmailField()
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Comment by {self.author_email} on {self.Task}"