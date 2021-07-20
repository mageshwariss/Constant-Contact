async function pushcontact() {
    var synctoinitiate = document.getElementById("synctoinitiate").innerHTML;
    var typeofview = document.getElementById("specificlead").innerText;
    var listid = document.getElementById("specificlist").getAttribute("value");
    var listname = document.getElementById("specificlist").innerHTML;
    var syncname = document.getElementById("syncDesc").value;
    console.log("selectview & listname", selectview, listname, syncname);
    if (syncname != "") {
        document.getElementById("syncDescErr").style.display = "none";
        if (selectview != null) {
            document.getElementById("selectview").style.display = "none";
            var selectedview;
            if (selectview == "All Leads") {
                selectedview = selectview;
            } else if (selectview == "Custom View") {
                selectedview = typeofview;
            }
            if (selectedview != "Select View" && listname != "Select a mailing list") {
                document.getElementById("selectcustomview").style.display = "none";
                document.getElementById("selectlistname").style.display = "none";
                if (addnewlist == true) {
                    console.log("clicked newlist");
                    await window.apiUtil.Insertnewlist(syncname, listname, synctoinitiate, selectedview, listid);
                } else {
                    await ZOHO.CRM.API.searchRecord({ Entity: "constentcontact__list", Type: "criteria", Query: "(Name:equals:" + listname + ")" })
                        .then(async function (matcheddata) {
                            console.log("macheddata", matcheddata);
                            if (matcheddata.statusText != "nocontent") {
                                if (matcheddata.data[0].Mapping_Parameter == selectedview) {
                                    await window.apiUtil.createlist(matcheddata.data[0].id, selectedview);
                                } else {
                                    var config = {
                                        Entity: "constentcontact__list",
                                        APIData: {
                                            "id": matcheddata.data[0].id,
                                            "Mapping_Parameter": selectedview
                                        },
                                        Trigger: ["workflow"]
                                    }
                                    await ZOHO.CRM.API.updateRecord(config)
                                        .then(async function (updatedata) {
                                            console.log("updatemapping_parameter", updatedata);
                                            ZOHO.CRM.API.searchRecord({ Entity: "ConstantList_Vs_Leads", Type: "criteria", Query: "(Associate_List:equals:" + matcheddata.data[0].id + ")" })
                                                .then(async function (linkingrecord) {
                                                    console.log("linkingrecord", linkingrecord);
                                                    if (linkingrecord.statusText != "nocontent") {
                                                        for (var i = 0; i < linkingrecord.data.length; i++) {
                                                            await ZOHO.CRM.API.deleteRecord({ Entity: "ConstantList_Vs_Leads", RecordID: linkingrecord.data[i].id })
                                                                .then(async function (deleterecord) {
                                                                    console.log("deleterecord", deleterecord);
                                                                    var externallistid = {
                                                                        "listids": listid
                                                                    }
                                                                    await ZOHO.CRM.CONNECTOR.invokeAPI("constentcontact.constantcontact.removecontactsfromlists", externallistid).then(async function (removedresp) {
                                                                        console.log("removedresp", removedresp);
                                                                        if (i == linkingrecord.data.length - 1) {
                                                                            await window.apiUtil.createlist(matcheddata.data[0].id, selectedview);
                                                                        }
                                                                    })
                                                                })
                                                        }
                                                    } else {
                                                        await window.apiUtil.createlist(matcheddata.data[0].id, selectedview);
                                                    }
                                                })
                                        })
                                }
                            } else {
                                await window.apiUtil.Insertnewlist(listname, synctoinitiate, selectedview, listid);
                            }
                        })
                }
            } else {
                if (selectedview == "Select View" && listname == "Select a mailing list") {
                    document.getElementById("selectcustomview").style.display = "block";
                    document.getElementById("selectlistname").style.display = "block";
                } else if (selectedview != "Select View" && listname == "Select a mailing list") {
                    document.getElementById("selectcustomview").style.display = "none";
                    document.getElementById("selectlistname").style.display = "block";
                } else if (selectedview == "Select View" && listname != "Select a mailing list") {
                    document.getElementById("selectcustomview").style.display = "block";
                    document.getElementById("selectlistname").style.display = "none";
                }
            }
        } else {
            document.getElementById("selectview").style.display = "block";
        }
    } else {
        document.getElementById("syncDescErr").style.display = "block";
    }
}
async function pushtoconstantcontact(importcontact, listid) {
    console.log("importcontact", importcontact);
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