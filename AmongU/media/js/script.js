String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function display_home_feed() {
    FB.api('/me/home', function(response) {
        console.log(response);
        $('#news_feed').empty();
        for (var i = 0; i < response['data'].length; i++) {
            var item = response['data'][i];
          
            format_data = {            
            'icon': item['icon'],
            'title': item['type'],
            'content': ''
            }
            if (item['message'] == undefined) item['message'] = ''
          
            if (item['type'] == 'status') {
                format_data['title'] = '<a href="https://www.facebook.com/{0}">{1}</a>'.format(item['from']['id'], item['from']['name']);
                format_data['content'] = item['message']
            } else if (item['type'] == 'photo') {
                format_data['title'] = item['story'];                
                format_data['content'] = '{1}<br /><img src="{0}" />'.format(item['picture'], item['message']);
            } else if (item['type'] == 'link') {
                if (item['story'] == undefined) item['story'] = item['from']['name']
                format_data['title'] = item['story'];                
                format_data['content'] = '{1}<br /><img href="{2}" src="{0}" />'.format(item['picture'], item['message'], item['link']);
            } else {
               continue;
            }
          
            var txt = '<div class="media"> \
                  <a target="_blank" class="pull-left" href="#"> \
                      <img class="media-object" src="{0}"> \
                  </a> \
                  <div class="media-body">  \
                      <h4 class="media-heading">{1}</h4>{2}            \
                  </div> \
              </div>'.format(format_data['icon'], format_data['title'], format_data['content']);
            $('#news_feed').append(txt);
        }
   });
}

function display_news_feed(query, link)
{
    if (query == '#') return;
    var lts = '/search?q=' + query + '&type=event';
    if (link) {
        lts = query.split('facebook.com',2)[1];
    } 
  
    FB.api(lts, function(response) {
        console.log(response);
        $('#news_feed').empty();
        if (response['paging'] == undefined) response['paging'] = {};
        if (response['paging']['previous'] == undefined) response['paging']['previous'] = '#';
        if (response['paging']['next'] == undefined) response['paging']['next'] = '#';
        var pagination = '<br /><div class="pagination pagination-large"><ul><li><a href="#" onclick="display_news_feed(\'' + response['paging']['previous'] + '\', true);">Prev</a></li><li><a href="#" onclick="display_news_feed(\'' + response['paging']['next'] + '\', true);">Next</a></li></ul></div><br />';
        $('#news_feed').append(pagination);
        for (var i = 0; i < response['data'].length; i++) {
            var item = response['data'][i];
            
            
            var txt = '<div class="media"> \
                    <a class="pull-left" href="#"> \
                        <img class="media-object" src="http://www.sixstarpro.com/images/bullets/bullet_arrow.png"> \
                    </a> \
                    <div class="media-body">  \
                        <h4 class="media-heading"><a href="#" onclick="show_event_description(\'' + item['id'] + '\')">' + item['name'] + '</a></h4><div id="event' + item['id'] + '"></div>            \
                    </div> \
                </div>';
            
           
            $('#news_feed').append(txt);
        }
        $('#news_feed').append(pagination);
    });
}

function show_event_description(event_id) {
    if ($('#event' + event_id).html() == '') {          
        FB.api('/' + event_id, function(response) {
            console.log(response);
            var s = '<table class="table table-bordered">';
             
            if (response['description'] != undefined)
                s += '<tr><td>Description</td><td><pre>' + response['description'] + '</pre></td></tr>';
            
            s += '</table>';
            $('#event' + event_id).html(s);
        });
    } else {
      $('#event' + event_id).html('');
    }
}

function display_create_event() {
    $('#main_content').load('/event/create');
}

function event_create() {
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: success,
        dataType: dataType
    });     
}