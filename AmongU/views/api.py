from django.shortcuts import render_to_response
from django.http import HttpResponse
from AmongU.models import *
from django.views.decorators.csrf import csrf_exempt
import json
import urllib2


###
### AUTHENTICATION
###

'''
/api/user/login
PARAM: input_token

Checks the supplied input_token against facebook servers and logs in the user if the token is valid
'''
def api_user_login(request):
  input_token = request.GET['input_token']
  print input_token
  
  access_token = urllib2.urlopen(r'https://graph.facebook.com/oauth/access_token?client_id=522257347834600&client_secret=bba15011bbe37b7054e34ed71d030218&grant_type=client_credentials').read()    
  print access_token
  resp = json.loads(urllib2.urlopen(r'https://graph.facebook.com/debug_token?input_token=' + input_token + '&' + access_token).read())
  print resp
  if resp['data']['is_valid'] == True and resp['data']['app_id'] == 522257347834600:
    profile = UserProfile.objects.filter(facebook_id=str(resp['data']['user_id']))
    if len(profile) == 0:
      profile = UserProfile(facebook_id=str(resp['data']['user_id']))
      profile.save()
    else:
      profile = profile[0]
    
    request.session['is_auth'] = True
    request.session['input_token'] = input_token
    request.session['user_id'] = resp['data']['user_id']
    response = {
      'status': 'success',
      'is_valid': True,
    }
    return HttpResponse(json.dumps(response), mimetype='application/json')            
  else:
    
    response = {
      'status': 'not_authorized',
      'is_valid': False,
    }
    return HttpResponse(json.dumps(response), mimetype='application/json')
  
'''
/api/user/logout
'''
def api_user_logout(request):
  request.session['is_auth'] = False
  del request.session['input_token']
  del request.session['user_id']
  
  response = {
    'status': 'success'
  }
  return HttpResponse(json.dumps(response), mimetype='application/json')


###
### EVENTS
###

'''
/api/events/create
PARAMS: Form data

Creates events
'''
def api_event_create(request):
  if request.method != 'POST':
    return HttpResponse(json.dumps({ 'status': 'failed', 'code': 'APIEVENTCREATE_1', }), mimetype='application/json')
  
  from forms import EventForm
  form = EventForm(request.POST)
  if not form.is_valid():
    return HttpResponse(json.dumps({ 'status': 'failed', 'code': 'APIEVENTCREATE_2', }), mimetype='application/json')
  
  owner = UserProfile.objects.get(facebook_id=request.session['user_id'])
  entry = Event(owner = owner,
                name = form.cleaned_data['name'],
                description = form.cleaned_data['description'],
                start_time = form.cleaned_data['start_time'],
                #end_time = '',# form.cleaned_data['end_time'],
                location = form.cleaned_data['location'],
              )
  
  entry.save()  
  response = {
    'status': 'success',
    'id': entry.id,
  }
  return HttpResponse(json.dumps(response), mimetype='application/json')

'''
/api/event/get
PARAMS: id
'''
def api_event_get(request):
  id = request.REQUEST['id']
  if id == 'all':
    return HttpResponse(urllib2.urlopen('https://graph.facebook.com/search?q=' + request.REQUEST['q'] + '&type=event&method=get&access_token=' + request.session['input_token'] + '&pretty=0').read(), mimetype='application/json')
  else:
    return HttpResponse(urllib2.urlopen('https://graph.facebook.com/' + id + '?access_token=' + request.session['input_token'] + '&pretty=0').read(), mimetype='application/json')

'''
/api/event/delete
PARAMS: id

Deletes event with the given id
'''
def api_event_delete(request):
  user = iapi_user_get()
  event = iapi_event_get(request.REQUEST['id'])
  if event.owner != user.id:
    return HttpResponse(json.dumps({ 'status': 'failed', 'code': 'APIEVENTDELETE_1', }), mimetype='application/json')
  
  status = iapi_event_delete(request.REQUEST['id'])
  
  response = {
    'status': 'success',
  }
  if status == False:
    response = {
      'status': 'failed',
      'code': 'APIEVENTDELETE_1',
    }
  return HttpResponse(json.dumps(response), mimetype='application/json')


###
### INTERNAL METHODS, NOT PUBLICLY EXPOSED
###

# Database getters
def iapi_user_get(id=None, profile_id=None):
  if id==None and profile_id==None:
    return UserProfile.objects.get(facebook_id=request.session['user_id'])
  
def iapi_event_get(id):
  return Event.objects.get(id=id)  


'''
PARAMS: id
Deletes event with the given id
'''
def iapi_event_delete(id):
  event = Event.objects.filter(id=id)
  if len(event) == 0: return False
  else: event = event[0]
  event.delete()
  return True