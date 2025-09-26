import graphene
from graphene_django import DjangoObjectType
from .models import Organization, Project, Task, Comment
from django.db.models import Count


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields ="__all__"

class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_tasks = graphene.Int()

    class Meta:
        model = Project
        fields=("id","name","description","status","due_date","created_at")
    

    def resolve_task_count(self, info):
        return self.tasks.count()
    
    def resolve_completed_tasks(self, info):
        return self.tasks.filter(status="DONE").count()
    


class TaskType(DjangoObjectType):
    class Meta:
        model= Task
        fields ="__all__"


class TaskCommentType(DjangoObjectType):
    class Meta:
        model= Comment
        fields = "__all__"



# Quiries on the data

class Query(graphene.ObjectType):
    organization = graphene.List(OrganizationType)
    projects_for_org = graphene.List(ProjectType)
    project = graphene.Field(ProjectType, id= graphene.ID(required= True))
    tasks_for_projects = graphene.List(TaskType, project_id = graphene.ID(required = True))

    project_status = graphene.Field(
        graphene.JSONString,
        project_id = graphene.ID(required= True)
    )

    task_comments = graphene.List(TaskCommentType, task_id=graphene.ID(required=True))


    def resolve_task_comments(self, info, task_id):
        org = getattr(info.context, "organization", None)
        return Comment.objects.filter(task__project__organization=org, task__id=task_id)


    def resolve_organization(root, info):
        return Organization.objects.all()
    
    def resolve_projects_for_org(self, info):
        request = info.context

        org = getattr(request,"organization", None)
        if not org:
            return Project.objects.none()
        return org.projects.all()
    
    def resolve_project(self, info, id):
        request = info.context
        org = getattr(request, "organization",None)
        return Project.objects.filter(organization =org, id = id).first()
    
    def resolve_tasks_for_projects(self, info, project_id):
        request = info.context
        org = getattr(request, "organization", None)
        q = Task.objects.filter(project__organization = org, project__id = project_id)
        return q

    def resolve_project_status(self, info, project_id):
        request = info.context
        org= getattr(request,"organization", None)
        q = Task.objects.filter(project__organization = org, project__id = project_id)
        total = q.count()
        done  = q.filter(status = "Done").count()
        completion = (done/total* 100) if total else 0
        
        return {
            "total" : total, "done": done, "completiion_rate":completion
        }
    


# Mutation

class CreateProject(graphene.Mutation):
    class Arguments:
        name= graphene.String(required = True)
        description= graphene.String()
        status = graphene.String()
        dueDate = graphene.types.datetime.Date()

    project = graphene.Field(ProjectType)

    def mutate(self, info, name, description=None, status="ACTIVE", dueDate=None):
        request = info.context
        org = getattr(request,"organization", None)

        if not org:
            raise Exception("Organization context required (Set X-ORG_SLUG header)")
        
        p = Project.objects.create(
            organization = org,
            name = name,
            description = description,
            status = status,
            dueDate= dueDate
        )

        return CreateProject(project = p)
    

class UpdateProject(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required =True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        dueDate = graphene.types.datetime.Date()

    project = graphene.Field(ProjectType)


    def mutate(self, info, id, **kwargs):
        request = info.context
        org = getattr(request, "organization",None)
        p = Project.objects.filter(organization = org, id = id).first()
        if not p:
            raise Exception("Project not found")
        for k, v in kwargs.items():
            if v is not None:
                setattr(p, k, v)
        
        p.save()
        return UpdateProject(project = p)


class CreateTask(graphene.Mutation):
    class Arguments:
        projectId = graphene.ID(required = True)
        title = graphene.String(required =True)
        description = graphene.String()
        status = graphene.String()
        assigneeEmail = graphene.String()

    task = graphene.Field(TaskType)

    def mutate(slef, info, project_id, title, description=None,status= "TODO", assigneeEmail=None):
        request= info.context
        org = getattr(request, "organization",None)
        project = Project.objects.filter(organization = org, id = project_id).first()

        if not project:
            raise Exception("Project not found")
        
        t = Task.objects.create(project= project, title= title, description = description or "", status= status, assigneeEmail=assigneeEmail or "")
        return CreateTask(task = t)
    

class UpdateTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required = True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        assigneeEmail = graphene.String()

    task = graphene.Field(TaskType)

    def mutate(self, info, id, **kwargs):
        request = info.context

        org = getattr(request, "organization", None)
        task = Task.objects.filter(project__organization = org, id = id).first()

        if not task:
            raise Exception("Task not foound")
        for k,v in kwargs.items():
            if v is not None:
                setattr(task, k, v)
        
        task.save()
        return UpdateTask(task=task)
    

class AddTaskComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required = True)
        content = graphene.String(required = True)
        authorEmail = graphene.String(required = True)

    comment = graphene.Field(TaskCommentType)

    def mutate(self, info, task_id, content,         authorEmail = graphene.String(required = True)
):
        request = info.context
        org = getattr(request,"organization", None)

        task = Task.objects.filter(project__organization = org, id = task_id).first()

        if not task:
            raise Exception("Task not found")
        
        c = Comment.objects.create(task = task, content= content, authorEmail = authorEmail)

        return AddTaskComment(comment = c)

 
class DeleteProject(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
    
    ok = graphene.Boolean()

    def mutate(self, info, id):
        request = info.context
        org = getattr(request, "organization", None)
        project = Project.objects.filter(organization=org, id=id).first()
        if not project:
            raise Exception("Project not found")
        project.delete()
        return DeleteProject(ok=True)


class DeleteTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
    
    ok = graphene.Boolean()

    def mutate(self, info, id):
        request = info.context
        org = getattr(request, "organization", None)
        task = Task.objects.filter(project__organization=org, id=id).first()
        if not task:
            raise Exception("Task not found")
        task.delete()
        return DeleteTask(ok=True)


class DeleteTaskComment(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
    
    ok = graphene.Boolean()

    def mutate(self, info, id):
        request = info.context
        org = getattr(request, "organization", None)
        comment = Comment.objects.filter(task__project__organization=org, id=id).first()
        if not comment:
            raise Exception("Comment not found")
        comment.delete()
        return DeleteTaskComment(ok=True)


class Mutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    delete_project = DeleteProject.Field()


    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    delete_task = DeleteTask.Field()

    add_task_comment = AddTaskComment.Field()
    delete_task_comment = DeleteTaskComment.Field()


schema = graphene.Schema(query = Query, mutation = Mutation)
    
