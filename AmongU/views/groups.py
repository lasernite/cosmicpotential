import os
from django.shortcuts import render_to_response, render
from django.http import HttpResponse, HttpResponseRedirect
from openshift.models import UserProfile, Group
from django.views.decorators.csrf import csrf_exempt

from django.forms import ModelForm

#Create form class
class GroupForm(ModelForm):
	class Meta:
		model = Group
		exclude = ('owner',)

@csrf_exempt

def group_create(request):
	if request.method == 'POST': # If the form has been submitted
		form = GroupForm(request.POST) # A form bound to POST data
			
		owner = UserProfile.objects.get(facebook_id=request.COOKIES['profile_id'])
		if form.is_valid(): # Validation rules pass
			entry = Group(name = form.cleaned_data['name'],
						  owner = owner,
						  description = form.cleaned_data['description'])
			entry.save()
			#return HttpResponse(str(form.cleaned_data))
			return HttpResponseRedirect('/group/created') # Redirect after POST
		else:
			return HttpResponse('Form Error: ' + str(form.errors))
	else:
		form = GroupForm() # An unbound form
		
	return render(request, 'create_group.html', { 'form':form, })

def group_created(request):
	return render_to_response('created_group.html')