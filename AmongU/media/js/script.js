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
    //if (query == '#') return;
    var lts = '/api/event/get?q=' + query + '&id=all&input_token=' + access_token;
  
    $.ajax({url: lts, success: function(response) {
        console.log(response);
        $('#news_feed').empty();
        if (response['paging'] == undefined) response['paging'] = {};
        if (response['paging']['previous'] == undefined) response['paging']['previous'] = '#';
        if (response['paging']['next'] == undefined) response['paging']['next'] = '#';
       // var pagination = '<br /><div class="pagination pagination-large"><ul><li><a href="#" onclick="display_news_feed(\'' + response['paging']['previous'] + '\', true);">Prev</a></li><li><a href="#" onclick="display_news_feed(\'' + response['paging']['next'] + '\', true);">Next</a></li></ul></div><br />';
      //  $('#news_feed').append(pagination);
        for (var i = 0; i < response['data'].length; i++) {
            var item = response['data'][i];
            
            var txt = '<div class="row"> \
                <div class="small-12 large-12 columns"> \
                    <p><a href="javascript:void(0);" onclick="show_event_description(\'' + item['id'] + '\');"><strong>' + item['name'] + '</strong></a><br /><span id="event' + item['id'] + '">' + item['start_time'] + '</span><br/><span id="eventdesc' + item['id'] + '"></span></p> \
                    <ul class="inline-list"> \
                        <li><a href="">Reply</a></li> \
                        <li><a href="">Share</a></li> \
                    </ul> \
                </div> \
            </div><hr />';
            /*var txt = '<div class="media"> \
                    <a class="pull-left" href="#"> \
                        <img class="media-object" src="http://www.sixstarpro.com/images/bullets/bullet_arrow.png"> \
                    </a> \
                    <div class="media-body">  \
                        <h4 class="media-heading"><a href="#" onclick="show_event_description(\'' + item['id'] + '\')">' + item['name'] + '</a></h4><div id="event' + item['id'] + '"></div>            \
                    </div> \
                </div>';*/
            
           
            $('#news_feed').append(txt);
        }
       // $('#news_feed').append(pagination);
    }});
}

function show_event_description(event_id) {
    if ($('#eventdesc' + event_id).html() == '') {
        $('#eventdesc' + event_id).html('Loading Description...');
        FB.api('/' + event_id, function(response) {
            console.log(response);
            var s = "";
            if (response['description'] != undefined)
                s += '<pre>' + response['description'] + '</pre>';
            $('#eventdesc' + event_id).html(s);
        });
    } else {
      $('#eventdesc' + event_id).html('');
    }
}

function display_event_create() {
    $('#news_feed').load('/event/create');
}


function event_create() {
    progress_bar_animation($('#progress_meter'));
    $('#progress_event_create').show();
    _api_event_create({
        'name': $('#id_name').val(),
        'description': $('#id_description').val(),
        'start_time': $('#id_start_time').val(),
        'location': $('#id_location').val()
    }, function(response) {
        $('#news_feed').html('Event Created');
    });
    //$('#news_feed').html('Creating...');
}
function _api_event_create(data, success) {
    console.log(data);
    $.ajax({
       type: "POST",
       url: "/api/event/create",
       data: data,
       success: success,
       dataType: 'application/json'
    });
}

function _progress_bar_step_1(id) {
    if ($(id).data('animate') == 'true') {    
        $(id).css('float', 'left');
        $(id).animate({'width': '100%'}, 400, function() {
            _progress_bar_step_2(id);
        });
    }
}
function _progress_bar_step_2(id) {
    if ($(id).data('animate') == 'true') {    
        $(id).css('float', 'right');
        $(id).animate({'width': '10%'}, 400, function() {
            _progress_bar_step_3(id);
        } );
    }
}
function _progress_bar_step_3(id) {    
    if ($(id).data('animate') == 'true') {    
        $(id).css('float', 'right');
        $(id).animate({'width': '100%'}, 400, function() {
            _progress_bar_step_4(id);
        } );
    }
}
function _progress_bar_step_4(id) {
    if ($(id).data('animate') == 'true') {    
        $(id).css('float', 'left');
        $(id).animate({'width': '10%'}, 400, function() {
            _progress_bar_step_1(id);
        } );
    }
}
function progress_bar_animation(id) {
    var complete = false;
    $(id).data('animate', 'true');
    $(id).css('width', '10%');
    _progress_bar_step_1(id);
}
function progress_bar_animation_stop(id) {
    $(id).data('animate', 'false');
}