(function() {
    var allPageDisplay = null;
    
    var add = function(type, content) {
        var tab = document.getElementById("blacklist_tbl")
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
    
    function cutString(stringToCut) {
        if (stringToCut.length == 0)
            return "<em>No title</em>"
        if (stringToCut.length <= 50)
            return stringToCut
        return stringToCut.slice(0, 50) + "..."
    }
    
    function addHistoricPages(pages) {
        var history_table = document.getElementById("history_tbl")
        for(i in pages) {
            var thisRow = document.createElement("tr")
            thisRow.innerHTML = "<tr><td>" + cutString(pages[i].title) + "</td><td>" + cutString(pages[i].url) + "</td></tr>"
            var deletePage = document.createElement("td")
            var deleteButton = document.createElement("a")
            deleteButton.classList = ["delete"];
            deleteButton.innerHTML = "Delete"
            deleteButton.onclick = function(e) {
                var r = e.target.parentElement.parentElement
                chrome.storage.local.remove(r.id)
                notie.alert(4, "Page deleted.", 2)
                r.parentNode.removeChild(r)
            }
            deletePage.appendChild(deleteButton)
            thisRow.appendChild(deletePage)
            thisRow.id = pages[i].time;
            history_table.appendChild(thisRow)        
        }
    }
    
    
    function getHistory(query="") {
        var history_table = document.getElementById("history_tbl")
        history_table.innerHTML = "<table class='ui table' id='history_tbl'></table>"
        chrome.storage.local.get(function(results) {
            var allPages = []
            for (key in results) {
                if (!isNaN(key) && (results[key].url + "/" + results[key].title).indexOf(query) > -1) {
                    allPages.push(results[key])
                }
            }
            allPages.reverse()
            allPageDisplay = nextPages(allPages)
            addHistoricPages(allPageDisplay.next().value)
        })
    }

    
    function* nextPages(allPages){
        while(true)
            yield allPages.splice(0, 20)
    }
    
    chrome.storage.local.get('blacklist', function(result) {
        var bl = result.blacklist
        if (bl.length > 0 && (bl['SITE'].length + bl['PAGE'].length + bl['REGEX'].length > 0)) {
            var tab = document.getElementById("blacklist_tbl")
            var fields = ["SITE", "PAGE", "REGEX"]
            for (var j = 0; j < fields.length; j++) {
                for (var i = 0; i < bl[fields[j]].length; i++) {
                    add(fields[j], bl[fields[j]][i])
                }
            }
        } else {
            add("SITE", "chrome-ui://newtab");
            save(false);
        }
    });
        
    function save(showAlert) {
        var showAlert = (typeof showAlert !== 'undefined') ?  showAlert : true;
        if (showAlert) { notie.alert(4, "Saved Preferences.", 2); }
        var tab = document.getElementById("blacklist_tbl");
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
    
    function loadMore() {
        addHistoricPages(allPageDisplay.next().value)
    }
    
    function clearAllData() {
        chrome.storage.local.clear();
        notie.alert(1, 'Deleted. Restarting Falcon...', 2)
        setTimeout(function() {
            chrome.runtime.reload()
        }, 2000);    
    }
    
    getHistory()
    document.getElementById("save").onclick = save;
    document.getElementById("add").onclick = add;
    document.getElementById("loadmore").onclick = loadMore;
    
    document.getElementById("clear").onclick = function() {
            notie.confirm('Are you sure you want to do that?', 'Yes', 'Cancel', function() {
                clearAllData()
            })
    }
    
    document.getElementById("search_history").onkeyup = function () {
        getHistory(document.getElementById("search_history").value);
    }

    
})();
