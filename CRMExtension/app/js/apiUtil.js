var apiCore = {
    GetInitiallistcontact_custommodule: async function (entity) {
        /*
        1.Get Allrecords from pageload module(leads or contacts or custommodule(constant contact lists))
        2.Get Allrecords from custommodule 
        */
        await ZOHO.CRM.API.getAllRecords({
            Entity: entity
        }).then(async function (data) {
            console.log("moduledata", entity, data);
            if (data.statusText != "nocontent") {
                moduledata = data.data;
            }
            if (entity != "constentcontact__list") {
                await ZOHO.CRM.API.getAllRecords({
                    Entity: "constentcontact__list"
                }).then(function (custommoduledata) {
                    console.log("custommoduledata", custommoduledata);
                    if (custommoduledata.statusText != "nocontent") {
                        custommodulelist = custommoduledata.data;
                    }
                })
            }
        })
        var dataobj = {};
        await ZOHO.CRM.CONNECTOR.invokeAPI("constentcontact.constantcontact.getalllist", dataobj).then(async function (getlist) {
            console.log("getlist", getlist);
            var convertjson = JSON.parse(getlist.response);
            Totallist = convertjson.lists;
            console.log("getalllist", Totallist);
        }).catch(function (error) {
            console.log("error", error);
            window.apiUtil.apiErrormsg(error);
        });
    },
    /* createlist: async function (custommodulelistid, selectedview) {
        var External_listid = document.getElementById("createlist").getAttribute("name");
        await window.apiUtil.configmoduledata(custommodulelistid, selectedview).then(async function (configdata) {
            console.log("configuredata", configdata);
            await window.apiUtil.designtheimportdata(configdata, custommodulelistid, selectedview).then(async function (designedimportdata) {
                console.log("designedimportdata", designedimportdata);
                await pushtoconstantcontact(designedimportdata, External_listid);
            })
        })
    }, */
    apiSuccessmsg: function (sucmessage) {
        document.getElementById("success").style.display = "block";
        document.getElementById("sucMsg").innerHTML = sucmessage;
        setTimeout(async function () {
            document.getElementById("success").style.display = "none";
            document.getElementById("sucMsg").innerHTML = '';
            await ZOHO.CRM.UI.Popup.close()
                .then(function (data) {
                    console.log(data)
                })
        }, 3000);
    },
    apiErrormsg: function (errmessage) {
        document.getElementById("error").style.display = "block";
        document.getElementById("errormsg").innerHTML = errmessage.message;
        setTimeout(async function () {
            document.getElementById("error").style.display = "none";
            document.getElementById("errormsg").innerHTML = '';
            await ZOHO.CRM.UI.Popup.close()
                .then(function (data) {
                    console.log(data)
                })
        }, 3000);
    },
    setVisible: function(selector, visible) {
        document.querySelector(selector).style.display = visible ? 'block' : 'none';
    },
    insertintolinkingmodule: async function (contactlistindex, specificviewdatas) {
        var index = specificviewdatas.findIndex(record => record.Email.toLowerCase() === contactlist[contactlistindex].email_address.address);
        console.log("each_module_record", index);
        if (index != -1) {
            console.log("found");
            await Configrelateddata(contactlistindex, specificviewdatas[index].id).then(async function (related) {
                console.log("relate", related);
                relateddata = related;
                console.log("relate", relateddata);
                await ZOHO.CRM.API.insertRecord({ Entity: "ConstantList_Vs_Leads", APIData: relateddata, Trigger: ["workflow"] }).then(async function (response) {
                    console.log("inserted related record", response);
                })
            })
        }

    },
    Insertnewlist: async function (listname, selectedview, listid) {
        var data = [
            {
                "Name": listname,
                "Mapping_Parameter": selectedview,
                "constentcontact__listid": listid,
                "constentcontact__Linked_Module": entity
            }
        ];
        console.log("Insertnewlistdata", data);
        await ZOHO.CRM.API.insertRecord({ Entity: "constentcontact__list", APIData: data, Trigger: ["workflow"] }).then(async function (response) {
            console.log("inserted main record", response);
            var internallistid = response.data[0].details.id;
            await window.apiUtil.configmoduledata(internallistid, selectedview).then(async function (configuredata) {
                console.log("configuredata", configuredata);
                await window.apiUtil.designtheimportdata(configuredata, internallistid, selectedview).then(async function (designedimportdata) {
                    console.log("designedimportdata", designedimportdata);
                    await pushtoconstantcontact(designedimportdata, listid);
                })
            })
        });
    },
    configmoduledata: async function (listid, selectedview) {
        var insertrecord = [];
        if (selectedview == "All Leads" || selectedview == "All Contacts") {
            console.log("moduledata", moduledata, selectedview);
            moduledata = moduledata.filter(contact => contact.Email != null);
            insertrecord = moduledata;
        } else {
            specificcustomviewdata = specificcustomviewdata.filter(contact => contact.Email != null)
            insertrecord = specificcustomviewdata;
        }
        return insertrecord;
    },
    designtheimportdata: async function (designdata, listid, selectedview) {
        console.log("listid", listid, designdata);
        console.log("totalfields", document.getElementById("selMapDiv").children);
        var childnode = document.getElementById("selMapDiv").children;
        designimportdata = [];
        customrelatedtdata = [];
        for (var i = 0; i < designdata.length; i++) {
            //if (designdata[i].Email != null) {
            console.log(designdata[i].Email);
            designimportdata[i] = {};
            designimportdata[i]["email"] = designdata[i].Email;
            designimportdata[i]["last_name"] = designdata[i].Last_Name;
            designimportdata[i]["cf:mapping_parameter"] = selectedview;
            for (j = 4; j < childnode.length; j++) {
                console.log("childnode[j].className", childnode[j].className, childnode[j].firstElementChild.id);
                if (childnode[j].className == "tbl W100 f14  " && childnode[j].firstElementChild.id.includes("crmMapDiv")) {
                    var crmfield = childnode[j].childNodes[0].childNodes[0].id;
                    console.log("designdata", crmfield, designdata[i].Email);
                    var constantcontactfield = childnode[j].childNodes[0].childNodes[2].id;
                    designimportdata[i][constantcontactfield] = designdata[i][crmfield];
                    console.log("designimportdata", designimportdata);
                }
            }
            customrelatedtdata[i] = {};
            if (entity == "Leads") {
                customrelatedtdata[i]["Associate_Leads"] = designdata[i].id;
                customrelatedtdata[i]["Associate_List"] = listid;
            } else if (entity == "Contacts") {
                customrelatedtdata[i]["Associate_Contacts"] = designdata[i].id;
                customrelatedtdata[i]["Associated_List"] = listid;
            }
            // }
        }
        if (customrelatedtdata.length > 0) {
            console.log("relateddata", customrelatedtdata);
            var linkingmodule;
            if (entity == "Leads") {
                linkingmodule = "ConstantList_Vs_Leads";
            } else if (entity == "Contacts") {
                linkingmodule = "ConstantList_Vs_Contacts";
            }
            await ZOHO.CRM.API.insertRecord({ Entity: linkingmodule, APIData: customrelatedtdata, Trigger: ["workflow"] }).then(function (data) {
                console.log("inserted related record", data);

            });
        }
        console.log("designimportdata", designimportdata);
        return designimportdata;
    }
};

window.apiUtil = apiCore;