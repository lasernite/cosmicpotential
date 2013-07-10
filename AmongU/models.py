from django.db import models


class UserProfile(models.Model):
	facebook_id = models.CharField(max_length=50)
	
	def __unicode__(self):
		return self.facebook_id


class Group(models.Model):
	owner = models.ForeignKey(UserProfile)
	name = models.CharField(max_length=30)
	description = models.CharField(max_length=500)
	
	def __unicode__(self):
		return self.name
	
	
class Event(models.Model):
	owner = models.ForeignKey(UserProfile)	
	name = models.TextField()
	description = models.TextField()
	start_time = models.DateTimeField()
	end_time = models.DateTimeField(blank=True, null=True)
	location = models.TextField()
	
	venue_street = models.TextField(blank=True, null=True)
	venue_city = models.CharField(max_length=50,blank=True, null=True)
	venue_state = models.CharField(max_length=50,blank=True, null=True)
	venue_country = models.CharField(max_length=10,blank=True, null=True)
	venue_zip = models.CharField(max_length=10,blank=True, null=True)
	venue_latitude = models.FloatField(blank=True, null=True)
	venue_longitude = models.FloatField(blank=True, null=True)
	
	picture = models.TextField(blank=True, null=True)
	
	def __unicode__(self):
		return str(self.id)