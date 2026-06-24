from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser,
    Equipment,
    Todo,
    Inquiry,
    Job,
    JobApplication,
    LabourRating,
    LabourSkill,
    LabourEarning,
    Notification,
)


class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = (
        'email',
        'username',
        'first_name',
        'phone',
        'role',
        'is_staff',
        'is_active'
    )
    list_filter = ('is_staff', 'is_active', 'role')
    ordering = ('email',)
    search_fields = ('email', 'username', 'first_name')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {
            'fields': (
                'username',
                'first_name',
                'phone',
                'role',
                'address',
                'latitude',
                'longitude',
                'is_available',
            )
        }),
        ('Permissions', {
            'fields': (
                'is_staff',
                'is_active',
                'is_superuser',
                'groups',
                'user_permissions',
            )
        }),
        ('Important dates', {
            'fields': ('last_login', 'date_joined')
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'username',
                'first_name',
                'phone',
                'role',
                'password1',
                'password2',
                'is_staff',
                'is_active',
            ),
        }),
    )


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Equipment)
admin.site.register(Todo)
admin.site.register(Inquiry)
admin.site.register(Job)
admin.site.register(JobApplication)
admin.site.register(LabourRating)
admin.site.register(LabourSkill)
admin.site.register(LabourEarning)
admin.site.register(Notification)
