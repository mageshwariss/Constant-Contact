async function pushcontact() {
    var listname = document.getElementById("createlist").value;
    var listid = document.getElementById("createlist").getAttribute("name");
    console.log("listname and listid", listname, listid);
    //window.apiUtil.setVisible('#loading', true);
    // document.getElementById("syncStep2").innerHTML = "Inserting";
    //document.getElementById("syncStep2").disabled = true;

    if (listname != "" && listid == null) {
        document.getElementById("listErr").style.display = "none";
        await createnewlist().then(async function () {
            await checkthe_validation();
        })
    } else if (listid != null) {
        await checkthe_validation();
    } else if (listname == null || listname == "") {
        document.getElementById("listErr").style.display = "block";
    }
}
async function checkthe_validation() {
    var listname = document.getElementById("createlist").value;
    var listid = document.getElementById("createlist").getAttribute("name");
    if (listid != null && listid != undefined) {
        var typeofview = document.getElementById("specificlead").innerText;
        if (selectview != null) {
            document.getElementById("selectview").style.display = "none";
            var selectedview;
            if (selectview == "All Leads" || selectview == "All Contacts") {
                selectedview = selectview;
            } else if (selectview == "Custom View") {
                selectedview = typeofview;
            }
            if (selectedview != "Select View" && (listname != null || listname != "")) {
                document.getElementById("syncStep2").innerHTML = "Inserting";
                document.getElementById("syncStep2").disabled = true;
                document.getElementById("selectcustomview").style.display = "none";
                document.getElementById("listErr").style.display = "none";
                console.log("clicked newlist");
                await window.apiUtil.Insertnewlist(listname, selectedview, listid);
            } else {
                if (selectedview == "Select View" && (listname == null || listname == "")) {
                    document.getElementById("selectcustomview").style.display = "block";
                    document.getElementById("listErr").style.display = "block";
                } else if (selectedview != "Select View" && (listname == null || listname == "")) {
                    document.getElementById("selectcustomview").style.display = "none";
                    document.getElementById("listErr").style.display = "block";
                } else if (selectedview == "Select View" && (listname != null || listname != "")) {
                    document.getElementById("selectcustomview").style.display = "block";
                    document.getElementById("listErr").style.display = "none";
                }
            }
        }
        else {
            document.getElementById("selectview").style.display = "block";
        }
    }
}
async function pushtoconstantcontact(importcontact, listid) {
    console.log("importcontact", importcontact, listid);
    if (listid != null && listid != undefined) {
        if (importcontact.length > 0) {
            var dynamicdata = {
                "importdata": importcontact,
                "listid": listid
            }
            console.log("dynamicobj", dynamicdata);
            await ZOHO.CRM.CONNECTOR.invokeAPI("constentcontact.constantcontact.importcontactstolistusingjson", dynamicdata).then(async function (resp) {
                console.log("importTotallist", resp);
                if (resp.status_code == 201) {
                    window.apiUtil.apiSuccessmsg("Inserted successfully");
                } else {
                    window.apiUtil.apiErrormsg(resp);
                }
            }).catch(function (error) {
                console.log("error", error);
                window.apiUtil.apiErrormsg(error);
            });
        } else {
            window.apiUtil.apiSuccessmsg("There are no records for this custom view");
        }
    }
}