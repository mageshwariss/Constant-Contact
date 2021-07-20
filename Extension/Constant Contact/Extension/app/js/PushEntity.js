async function pushcontact() {
    var synctoinitiate = document.getElementById("synctoinitiate").innerHTML;
    var typeofview = document.getElementById("specificlead").innerText;
    var listid = document.getElementById("specificlist").getAttribute("value");
    var listname = document.getElementById("specificlist").innerHTML;
    console.log("listid", listid);
    var selectedview;
    if (selectview == "All Leads") {
        selectedview = selectview;
    } else if (selectview == "Custom View") {
        selectedview = typeofview;
    }
    if (addnewlist == true) {
        console.log("clicked newlist");
        window.apiUtil.Insertnewlist(listname, synctoinitiate, selectedview, listid);
    } else {
        await ZOHO.CRM.API.searchRecord({ Entity: "constentcontact__list", Type: "criteria", Query: "(Name:equals:" + listname + ")" })
            .then(async function (matcheddata) {
                console.log("macheddata", matcheddata);
                if (matcheddata.statusText != "nocontent") {
                    await window.apiUtil.configmoduledata(matcheddata.data[0].id, selectedview).then(async function (configdata) {
                        console.log("configuredata", configdata, matcheddata);
                        //  var designedimportdata = window.apiUtil.designtheimportdata(configdata, matcheddata.data[0].id);
                        await window.apiUtil.designtheimportdata(configdata, matcheddata.data[0].id, selectedview).then(async function (designedimportdata) {
                            console.log("designedimportdata", designedimportdata);
                            pushtoconstantcontact(designedimportdata, listid);
                        })
                    })
                }
            })
    }

}
function pushtoconstantcontact(importcontact, listid) {
    console.log("importcontact", importcontact);
    if (importcontact.length > 0) {
        var dynamicdata = {
            "importdata": importcontact,
            "listid": listid
        }
        console.log("dynamicobj", dynamicdata);
        ZOHO.CRM.CONNECTOR.invokeAPI("constentcontact.constantcontact.importcontactstolistusingjson", dynamicdata).then(function (resp) {
            console.log("importTotallist", resp);
            if (resp.status_code == 201) {
                window.apiUtil.apiSuccessmsg("Inserted successfully");
                ZOHO.CRM.UI.Popup.close()
                    .then(function (data) {
                        console.log(data)
                    })
            } else {
                window.apiUtil.apiErrormsg(resp);
            }
        }).catch(function (error) {
            console.log("error", error);
            window.apiUtil.apiErrormsg(error);
        });
    } else {
        window.apiUtil.apiSuccessmsg("There is no new Lead in CRM");
        ZOHO.CRM.UI.Popup.close()
            .then(function (data) {
                console.log("popup close",data);
            })
    }
}