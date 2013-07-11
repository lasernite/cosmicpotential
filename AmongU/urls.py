from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'AmongU.views.home', name='home'),
    url(r'^$', 'views.static_view', {'template_path': 'home.html'}),
    # url(r'^AmongU/', include('AmongU.foo.urls')),
    
    url(r'^media/((?:static)|(?:css)|(?:js)|(?:img))/(\w{1,50})\.(\w{1,10})$', 'views.static_handler'),


    url(r'^event/create$', 'views.event_create'),
    url(r'^event/created$', 'views.static_view', {'template_path': 'created_event.html'}),
  	url(r'^group/create$', 'views.group_create'),
    url(r'^group/created$', 'views.static_view', {'template_path': 'created_group.html'}),
    
    
    url(r'^user/login$', 'views.user_login'),
    
    #url(r'^img/glyphicons-halflings.png$', 'openshift.views.static_handler', {'path':'glyphicons-halflings.png', 'mimetype':'images/png'}),
    url(r'^admin/', include(admin.site.urls)),
    
# ===
# Local API for abstracting away operations
# ===

    # Login
    url(r'^api/user/login$', 'views.api_user_login'),
    url(r'^api/user/logout$', 'views.api_user_logout'),
    
    url(r'^api/event/get$', 'views.api_event_get'),
    url(r'^api/event/create$', 'views.api_event_create'),
    url(r'^api/event/delete$', 'views.api_event_delete'),
)
