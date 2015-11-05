'use strict';

export function babeldummy() {};

function initialize(){
	var observer = new MutationObserver(function(mutations, observer) {
      	mutations.forEach(function(record) {
      		if (record.target.id == 'console'
      			|| record.target.id == 'editor') return;
      		if (record.type == 'childList') {
	      		for (var i = 0, node; node = record.addedNodes[i]; i++) {
	      			if (node.tagName.toLocaleLowerCase() == 'script'
	      				&& node.type == 'lively4script') {
	      				saveDOM();
	      				break;
	      			}
	      		}
	      	}
      	})
      }).observe(document, {childList: true, subtree: true});
}

function getURL(){
    var baseurl = $('#baseurl').val() // How to abstract from UI? #TODO #JensLincke
    var filename = $('#filename').val()
    return new URL(baseurl + filename)
}

function saveDOM() {
    var world = $("html").clone();
    world.find("#editor").empty();
    world.find("#console").empty();
    world.find("#ace_editor\\.css").remove();
    world.find("#ace-tm").remove();
    var s = new XMLSerializer();
    var content = "<!DOCTYPE html>" + s.serializeToString(world[0]);

    writeFile(content);
}

function writeFile(content) {
    var url = getURL()
    console.log("[persistence] save " + url)
    $.ajax({
        url: url,
        type: 'PUT',
        data: content,
        success: function(text) {
            console.log("[persistence] file " + url + " written.")
        },
        error: function(xhr, status, error) {
            console.log("[persistence] could not write " + url + ": " + error)
        }
    });
}

initialize();