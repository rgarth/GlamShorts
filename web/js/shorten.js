function isUrlValid(url) {
  return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

function submitform() {
  var shortenAPI = "https://shitp.st/shorten"
  var redirectAPI = "https://shitp.st"
  longURL = $('#url').val();
  var short_text = document.getElementById('short');

  if (!/^(https?|s?ftp):\/\//.test(longURL)) {
    longURL = "http://".concat(longURL)
  }
  if (!isUrlValid(longURL)) {
    short_text.value = ("Error: Invalid URL");
    return;
  }


  $.ajax({
    type: "POST",
    url: shortenAPI,
    data: JSON.stringify({ "url": longURL }),
    success: function (data, textStatus, XmlHttpRequest) {
      if (XmlHttpRequest.status === 200) {
        short_text.value = (redirectAPI + "/" + data["short_url"]);
        short_text.disabled = false;
      } else {
        short_text.value("Error: Response " + XmlHttpRequest.status);
      }
    },
    error: function (XmlHttpRequest, textStatus, errorThrown) {
      if (XmlHttpRequest.status == 406) {
        short_text.value("stop it");
      } else {
        short_text.value("Error: Response " + textStatus);
      }
    },

    dataType: "json",
    contentType: "application/json"
  });
}

function copyresult() {
  var short_text = document.getElementById('short');
  var isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);

  if (isiOSDevice) {

    var editable = short_text.contentEditable;
    var readOnly = short_text.readOnly;

    short_text.contentEditable = true;
    short_text.readOnly = false;

    var range = document.createRange();
    range.selectNodeContents(short_text);

    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    short_text.setSelectionRange(0, 999999);
    short_text.contentEditable = editable;
    short_text.readOnly = readOnly;

  } else {
    short_text.select();
  }
  document.execCommand('copy');
}

$(document).ready(function () {
  $('#url').keydown(function (event) {
    if (event.keyCode == 13) {
      submitform();
      return false;
    }
  });
});

