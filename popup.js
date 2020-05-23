
var imported = document.createElement('script');

imported.src = 'script.js';
document.head.appendChild(imported);

var message = document.querySelector('#message');
chrome.runtime.onMessage.addListener(function (request, sender) {
  if (request.action == "getSource") {
    console.log("request resources", request.source);

    let doc = document.createElement('html');
    doc.innerHTML = request.source;

    console.log(document);
    var endpoint = 'https://v2018.api2pdf.com/chrome/html';
    var apikey = 'aabb4766-18dc-4458-b6eb-634849982410'; //replace this with your own from portal.api2pdf.com
    var payload = {
      "html": request.source,
      "inlinePdf": false
    };
    console.log(payload)
    $.ajax({
      url: endpoint,
      method: "POST",
      dataType: "json",
      crossDomain: true,
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(payload),
      cache: false,
      beforeSend: function (xhr) {
        /* Authorization header */
        xhr.setRequestHeader("Authorization", apikey);
      },
      success: function (data) {
        console.log(data.pdf); //this is the url to the pdf
        var save = document.createElement('a');
        save.href = data.pdf;
        save.target = '_blank';
        // save.download = filename || 'unknown';

        var evt = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': false
        });
        save.dispatchEvent(evt);

        (window.URL || window.webkitURL).revokeObjectURL(save.href);

      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("something went wrong")
      }
    });

  }

});

function onWindowLoad() {
  console.log("window loading")

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function () {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      console.log("last err", chrome.runtime.lastError.message)
      // message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;