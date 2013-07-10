import os
from django.shortcuts import render_to_response
from django.http import HttpResponse

"Handles static webpages, served directly from the templates directory"
def static_view(request, template_path):
    return render_to_response(template_path)

"Handler static media files: css, js, images, etc. These are stored in media directory"
def static_handler(request, directory, file_name, extension):    
    # Read file into string s
    PROJECT_DIR = os.path.dirname(os.path.realpath(__file__))
    file_name = file_name + '.' + extension
    f = open(os.path.join(PROJECT_DIR, '..', 'media', directory, file_name))
    s = f.read()
    f.close()
    
    # Determine MIME type of the file
    import mimetypes
    mimetype = mimetypes.guess_type(file_name)
    mimetype = mimetype[0]
    
    return HttpResponse(s, mimetype=mimetype)
