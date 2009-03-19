$('document').ready(function () { 
                      $('#saveButton').click(doSave);
                      var valid = false;
                      $("#upload_form").submit(function () {
                                                 valid = true;
                                               });
                      $('#my_iframe').hide();
                      $('#my_iframe').load(function () {
                                             if (valid) {
                                               var i = $('#my_iframe');
                                               var txt = jQuery(i.attr('contentDocument')).text();
                                               alert(txt);
                                               valid = false;
                                             }
                                           });
                    });

var next = 0;

function doSave() {
  var id = 'a' + next;
  next++;
  $.ajax({ 
           type: 'POST',
           url: '/cgi-bin/save.pl',
           data: { what: $('#txt').attr('value') },         
           success: addDownloadLink
         });
}

function addDownloadLink (dest) {
  if (dest.match(/Error/)) {
    alert("Couln't save: " + dest);
  } else {
    var a = jQuery('<a target="_blank"> Download </a>');
    a.attr('href', dest);
    a.click(function () {
              a.remove();
            });
    $('body').append(a);
  }  
}
