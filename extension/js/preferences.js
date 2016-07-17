(function() {
    chrome.storage.local.get('blacklist', function(result) {
        var bl = result.blacklist
        if (bl['SITE'].length + bl['PAGE'].length + bl['REGEX'].length > 0) {
            var tab = document.getElementById("table")
            tab.deleteRow(1);
            var fields = ["SITE", "PAGE", "REGEX"]
            for (var j = 0; j < fields.length; j++) {
                for (var i = 0; i < bl[fields[j]].length; i++) {
                    var r = tab.insertRow()
                    var stringCell = r.insertCell()
                    stringCell.innerHTML = bl[fields[j]][i]
                    stringCell.contentEditable = true
                    stringCell.setAttribute("placeholder", "Add a site...");

                    var typeCell = r.insertCell()
                    typeCell.innerHTML = '<select> \
                                    <option value="PAGE">Specific Page</option> \
                                    <option value="SITE">Entire Website</option> \
                                    <option value="REGEX">Regex</option> \
                                </select>'
                    typeCell.value = fields[j]
                        
                    var enabledCell = r.insertCell()
                    enabledCell.innerHTML = "<input type='checkbox' checked></input>"
                }
            }
        }
    })
    
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
            add();
        } else {
            var b = {
                'SITE': [],
                'PAGE': [],
                'REGEX': []
            }
            for(var i = 1; i < tab.rows.length; i++) {
                b[tab.rows[i].cells[1].childNodes[1].value].push(tab.rows[i].cells[0].innerText)
            }
            
            chrome.runtime.sendMessage({
                "msg": 'setBlacklist',
                "blacklist": b
            })
        }
    }
    
    var add = function() {
        var tab = document.getElementById("table")
        var row = tab.insertRow()
        var stringCell = row.insertCell()
        stringCell.innerHTML = ""
        stringCell.contentEditable = true
        stringCell.setAttribute("placeholder", "Add a site...");
        
        var typeCell = row.insertCell()
        typeCell.innerHTML = '<select> \
                        <option value="PAGE">Specific Page</option> \
                        <option value="SITE">Entire Website</option> \
                        <option value="REGEX">Regex</option> \
                    </select>'
                    
        var enabledCell = row.insertCell()
        enabledCell.innerHTML = "<input type='checkbox' checked></input>"
    }
    
    document.getElementById("add").onclick = add;
    
})();