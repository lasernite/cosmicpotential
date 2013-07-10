import os
from django.shortcuts import render_to_response
from django.http import HttpResponse
from AmongU.models import UserProfile


def user_login(request):
    input_token = request.GET['input_token']    
    import urllib2
    access_token = urllib2.urlopen(r'https://graph.facebook.com/oauth/access_token?client_id=522257347834600&client_secret=bba15011bbe37b7054e34ed71d030218&grant_type=client_credentials').read()    
    resp = urllib2.urlopen(r'https://graph.facebook.com/debug_token?input_token=' + input_token + '&' + access_token).read()
    import simplejson as json
    resp = json.loads(resp)
    print resp
    if resp['data']['is_valid'] == True and resp['data']['app_id'] == 522257347834600:
      profile = UserProfile.objects.filter(facebook_id=str(resp['data']['user_id']))
      if len(profile) == 0:
        profile = UserProfile(facebook_id=str(resp['data']['user_id']))
        profile.save()
      else:
        profile = profile[0]
      
      response = HttpResponse('1')
      response.set_cookie(str('input_token'), input_token)
      response.set_cookie(str('profile_id'), resp['data']['user_id'])
      return response
    else:
      return HttpResponse('0')

# GroupForm from Group model