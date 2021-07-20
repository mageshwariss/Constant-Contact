var apiCore = {
    apiSuccessmsg: function (sucmessage) {
        document.getElementById("success").style.display = "block";
        document.getElementById("sucMsg").innerHTML = sucmessage;
        setTimeout(function () {
            document.getElementById("success").style.display = "none";
            document.getElementById("sucMsg").innerHTML = '';
        }, 3000);
    },
    apiErrormsg: function (errmessage) {
        document.getElementById("error").style.display = "block";
        document.getElementById("errormsg").innerHTML = errmessage;
        setTimeout(function () {
            document.getElementById("error").style.display = "none";
            document.getElementById("errormsg").innerHTML = '';
        }, 3000);
    },
    insertintolinkingmodule: async function (contactlistindex, specificviewdatas) {
        var index = specificviewdatas.findIndex(record => record.Email === contactlist[contactlistindex].email_address.address);
        console.log("each_module_record", index);
        if (index != -1) {
            console.log("found");
            await Configrelateddata(contactlistindex, moduledata[index].id).then(async function (related) {
                console.log("relate", related);
                relateddata = related;
                console.log("relate", relateddata);
                await ZOHO.CRM.API.insertRecord({ Entity: "ConstantList_Vs_Leads", APIData: relateddata, Trigger: ["workflow"] }).then(async function (response) {
                    console.log("inserted related record", response);
                })
            })
        }

    },
    filternewlycreatedrecord: async function (listid, selectedview) {
        console.log("selectedview",selectedview);
        var filterdata = [];
        await ZOHO.CRM.API.searchRecord({ Entity: "ConstantList_Vs_Leads", Type: "criteria", Query: "(Associate_List:equals:" + listid + ")" })
            .then(async function (response) {
                console.log("response", response);
                if (response.statusText != "nocontent") {
                    for (var i = 0; i < response.data.length; i++) {
                        if (selectedview == "All Leads") {
                            if (moduledata.some(contact => contact.id === response.data[i].Associate_Leads.id)) {
                                filterdata = moduledata.filter((contact) => contact.id !== response.data[i].Associate_Leads.id);
                                console.log("filterdata", filterdata);
                            }
                        } else {
                            if (specificcustomviewdata.some(contact => contact.id === response.data[i].Associate_Leads.id)) {
                                filterdata = specificcustomviewdata.filter((contact) => contact.id !== response.data[i].Associate_Leads.id);
                                console.log("filterdata", filterdata);
                            }

                        }
                    }
                } else {
                    if (selectedview == "All Leads") {
                        console.log("moduledata",moduledata,selectedview);
                        filterdata = moduledata;
                    } else {
                        filterdata = specificcustomviewdata;
                    }
                }
            })
        console.log("finalfilterdata", filterdata,moduledata);
        return filterdata;
    },
    Insertnewlist: async function (listname, synctoinitiate, selectedview, listid) {
        var data = [
            {
                "Name": listname,
                "Sync_Frequency": synctoinitiate,
                "Mapping_Parameter": selectedview
            }
        ];
        await ZOHO.CRM.API.insertRecord({ Entity: "constentcontact__list", APIData: data, Trigger: ["workflow"] }).then(async function (response) {
            console.log("inserted main record", response);
            var internallistid = response.data[0].details.id;
            await window.apiUtil.configmoduledata(internallistid,selectedview).then(async function (configuredata) {
                //await configmoduledata(matcheddata).then(async function (configuredata) {
                console.log("configuredata", configuredata);
                //var designedimportdata =window.apiUtil.designtheimportdata(configuredata, response.data[0].id);
                await window.apiUtil.designtheimportdata(configuredata, internallistid, selectedview).then(async function (designedimportdata) {
                    //await designtheimportdata(configuredata, matcheddata).then(async function (designedimportdata) {
                    console.log("designedimportdata", designedimportdata);
                    // pushtoconstantcontact(designedimportdata, response.data[0].id);
                    pushtoconstantcontact(designedimportdata, listid);
                })
            })
        });
    },
    configmoduledata: async function (listid, selectedview) {
        var insertrecord = []
        await window.apiUtil.filternewlycreatedrecord(listid, selectedview).then(async function (filteredrecord) {
            insertrecord = filteredrecord;
        })
        return insertrecord;
    },
    designtheimportdata: async function (designdata, listid, selectedview) {
        console.log("listid", listid, designdata);
        //console.log("designdata", designdata);
        var synctoinitiate = document.getElementById("synctoinitiate").innerHTML;
        console.log("totalfields", document.getElementById("selMapDiv").children);
        var childnode = document.getElementById("selMapDiv").children;

        designimportdata = [];
        customrelatedtdata = [];
        for (var i = 0; i < designdata.length; i++) {
            console.log(designdata[i].Email);
            designimportdata[i] = {};
            designimportdata[i]["email"] = designdata[i].Email;
            designimportdata[i]["last_name"] = designdata[i].Last_Name;
            designimportdata[i]["cf:mapping_parameter"] = selectedview;
            designimportdata[i]["cf:sync_frequency"] = synctoinitiate;
            for (j = 4; j < childnode.length; j++) {
                console.log("childnode[j].className", childnode[j].className, childnode[j].firstElementChild.id);
                if (childnode[j].className == "tbl W100 f14  " && childnode[j].firstElementChild.id.includes("crmMapDiv")) {
                    var crmfield = childnode[j].childNodes[0].childNodes[0].id;
                    console.log("designdata",crmfield,designdata[i].Email);
                    var constantcontactfield = childnode[j].childNodes[0].childNodes[2].id;
                    designimportdata[i][constantcontactfield] = designdata[i][crmfield];
                    console.log("designimportdata", designimportdata);
                }
            }
            /* designimportdata[i]["email"] = designdata[i].Email;
            designimportdata[i]["first_name"] = designdata[i].First_Name;
            designimportdata[i]["last_name"] = designdata[i].Last_Name;
            designimportdata[i]["company_name"] = designdata[i].Company;
            designimportdata[i]["country"] = designdata[i].Country;
            designimportdata[i]["cf:mapping_parameter"] = selectedview;
            designimportdata[i]["cf:sync_frequency"] = synctoinitiate; */
            // if (matcheddata.statusText != "nocontent") {
            // var listid = matcheddata.data[0].id;
            customrelatedtdata[i] = {};
            customrelatedtdata[i]["Associate_List"] = listid;
            customrelatedtdata[i]["Associate_Leads"] = designdata[i].id;
            /* var config = {
                Entity: "Leads",
                APIData: {
                    "id": designdata[i].id,
                    "constentcontact__Flag": "1"
                },
                Trigger: ["workflow"]
            }
            await ZOHO.CRM.API.updateRecord(config)
                .then(function (data) {
                    console.log(data)
                }) */
            // }

        }
        if (customrelatedtdata.length > 0) {
            console.log("relateddata", customrelatedtdata);
            await ZOHO.CRM.API.insertRecord({ Entity: "ConstantList_Vs_Leads", APIData: customrelatedtdata, Trigger: ["workflow"] }).then(function (data) {
                console.log("inserted related record", data);

            });
        }
        return designimportdata;
    }
};

window.apiUtil = apiCore;