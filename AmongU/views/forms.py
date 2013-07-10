from django.forms import ModelForm
from AmongU.models import Event

# Create the form class.
class EventForm(ModelForm):
  class Meta:
    model = Event
    exclude = ('owner',)