import os
from django.shortcuts import render_to_response, render
from django.http import HttpResponse, HttpResponseRedirect
from AmongU.models import UserProfile, Event
from django.views.decorators.csrf import csrf_exempt

from forms import EventForm

"Handler static media files: css, js, images, etc. These are stored in media directory"
@csrf_exempt
def event_create(request):
    if request.method == 'POST': # If the form has been submitted...
        form = EventForm(request.POST) # A form bound to the POST data
        
        owner = UserProfile.objects.get(facebook_id=request.COOKIES['profile_id'])
        if form.is_valid(): # All validation rules pass
            entry = Event(name = form.cleaned_data['name'],
                          owner = owner,
                          description = form.cleaned_data['description'],
                                         start_time = form.cleaned_data['start_time'],
                                         #end_time = '',# form.cleaned_data['end_time'],
                                         location = form.cleaned_data['location'],
                                         )
            entry.save()
            #return HttpResponse(str(form.cleaned_data))
            return HttpResponseRedirect('/event/created') # Redirect after POST
        else:
          return HttpResponse('Form Error: ' + str(form.errors))
    else:
        form = EventForm() # An unbound form        

    return render(request, 'event_create.html', {
        'form': form,
    })

def event_created(request):
  return render_to_response('created_event.html')
