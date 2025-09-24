from django.shortcuts import get_object_or_404
from .models import Organization

class OrganizationMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        org_slug = request.headers.get("X-ORG-Slug") or request.GET.get("org")
        request.organization = None

        if org_slug:
            request.organization = get_object_or_404(Organization, slug = org_slug)
        return self.get_response(request)