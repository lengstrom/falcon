(function() {
    var add = function(type, content) {
        var tab = document.getElementById("table")
        var row = tab.insertRow()
        var stringCell = row.insertCell()
        stringCell.innerHTML = content ? content : ""
        stringCell.contentEditable = true
        stringCell.setAttribute("placeholder", "Add a site...");
        
        var typeCell = row.insertCell()
        var selectCell = document.createElement('select');
        selectCell.innerHTML = '<option value="PAGE">Specific Page</option> \
                        <option value="SITE">Entire Website</option> \
                        <option value="REGEX">Regex</option>'
        selectCell.value = type
        
        typeCell.appendChild(selectCell);
                    
        var enabledCell = row.insertCell()
        enabledCell.innerHTML = "<input type='checkbox' checked></input>"
        var deleteThisCell = document.createElement("a");
        deleteThisCell.classList = ["delete"];
        deleteThisCell.innerHTML = "Delete"
        deleteThisCell.onclick = function(e) {
            var r = e.target.parentElement.parentElement
            r.parentNode.removeChild(r);
        }
        enabledCell.appendChild(deleteThisCell);
    }
    
    chrome.storage.local.get('blacklist', function(result) {
        var bl = result.blacklist
        if (bl['SITE'].length + bl['PAGE'].length + bl['REGEX'].length > 0) {
            var tab = document.getElementById("table")
            var fields = ["SITE", "PAGE", "REGEX"]
            for (var j = 0; j < fields.length; j++) {
                for (var i = 0; i < bl[fields[j]].length; i++) {
                    add(fields[j], bl[fields[j]][i])
                }
            }
        }
    });
        
    document.getElementById("save").onclick = function() {
        var tab = document.getElementById("table");
        var indices = [];
        for (var i = 1; i < tab.rows.length; i++) {
            var row = tab.rows[i]
            if (row.cells[0].innerText === "") {
                indices.push(i)
            }
        }
        
        for (var j = indices.length-1; j > -1; j--) {
            tab.deleteRow(indices[j]);
        }
        
        
        
        if (tab.rows.length == 1) {
            chrome.runtime.sendMessage({
                "msg": 'setBlacklist',
                "blacklist": []
            });
            add("SITE", "");
        } else {
            var b = {
                'SITE': [],
                'PAGE': [],
                'REGEX': []
            }
            for(var i = 1; i < tab.rows.length; i++) {
                b[tab.rows[i].cells[1].childNodes[0].value].push(tab.rows[i].cells[0].innerText)
            }
            
            chrome.runtime.sendMessage({
                "msg": 'setBlacklist',
                "blacklist": b
            })
        }
    }
    
    document.getElementById("add").onclick = add;
    
    document.getElementById("clear").onclick = function () {
        chrome.storage.local.clear()
        chrome.runtime.reload();
    }
    
})();