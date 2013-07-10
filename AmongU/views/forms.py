from django.forms import ModelForm

# Create the form class.
class EventForm(ModelForm):
  class Meta:
    model = Event
    exclude = ('owner',)