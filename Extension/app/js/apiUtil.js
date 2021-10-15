var apiCore = {
    GetInitiallistcontact_custommodule: async function (entity) {
        /*
        1.Get Allrecords from pageload module(leads or contacts or custommodule(constant contact lists))
        2.Get Allrecords from custommodule 
        */
        await ZOHO.CRM.API.getAllRecords({
            Entity: entity
        }).then(async function (data) {
            console.log("Leads", data);
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
    },
    GetInitiallistcontact_thirdparty: async function (entity) {
        /*
       1.Get Allrecords of pageload module(leads or contacts or custommodule(constant contact lists))
       2.
         */
        await ZOHO.CRM.API.getAllRecords({
            Entity: entity
        }).then(async function (data) {
            console.log("Leads", data);
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
            //var dataobj1 = {};
            await ZOHO.CRM.CONNECTOR.invokeAPI("constentcontact.constantcontact.constant", dataobj).then(async function (data) {
                var convertjson = JSON.parse(data.response);
                contactlist = convertjson.contacts;
                console.log("getallcontactlist", contactlist);
                for (var i = 0; i < Totallist.length; i++) {
                    for (var j = 0; j < contactlist.length; j++) {
                        //contactlist[j]["custom_fields"]["contactid"] = contactlist[j].contact_id;
                        contactlist[j]["list_members"] = [];
                        for (var k = 0; k < contactlist[j].list_memberships.length; k++) {
                            var index = Totallist.findIndex(list => list.list_id === contactlist[j].list_memberships[k]);
                            let my_object = {};
                            my_object.listname = Totallist[index].name;
                            my_object.listid = Totallist[index].list_id;
                            contactlist[j]["list_members"].push(my_object);
                        }
                    }
                }
                //Not basedon customfields
                window.apiUtil.designcustommoduledata().then(function (designedcustomdata) {
                    console.log("designedcustomdata", designedcustomdata);
                    window.apiUtil.PushInitiallist_to_custommodule(designedcustomdata);
                });
                //Based on Customfields of thirdparty
                // PushInitiallistto_custommodule();
            }).catch(function (error) {
                console.log("error", error);
            })
        }).catch(function (error) {
            console.log("error", error);
        });
    },
    designcustommoduledata: async function () {
        var data = [];
        console.log("thirdparty custom fields", contactlist);
        for (var i = 0; i < Totallist.length; i++) {
            const listpresentedcontact = contactlist.filter(contact => contact.list_memberships.includes(Totallist[i].list_id));
            console.log("listpresentedcontact", listpresentedcontact, listpresentedcontact.length, custommodulelist.length);
            if (listpresentedcontact.length > 0) {
                newlistindex = custommodulelist.findIndex((list) => list.Name === Totallist[i].name)
                if (newlistindex == -1) {
                    console.log("not found");
                    let my_object = {};
                    my_object.Name = Totallist[i].name;
                    if (listpresentedcontact[0].custom_fields.length > 0) {
                        my_object.Sync_Frequency = listpresentedcontact[0].custom_fields[0].value;
                        my_object.Mapping_Parameter = listpresentedcontact[0].custom_fields[1].value;
                    }
                    data.push(my_object);
                } else {
                    console.log("newlistindex", newlistindex, custommodulelist[newlistindex].id, custommodulelist[newlistindex].Name);
                    /* var APIData = {};
                      await ZOHO.CRM.API.updateRelatedRecords({ Entity: "constentcontact__list", RecordID: custommodulelist[newlistindex].id, RelatedList: "Leads2", RelatedRecordID: "4493114000000085851", APIData: APIData })
                          .then(function (updaterelatedata) {
                              console.log("updaterelatedata", updaterelatedata);
                          }) */
                }
            }
        }
        if (data.length > 0) {
            console.log("pushdata", data);
        }
        return data;
    },
    PushInitiallist_to_custommodule: async function (designedcustomdata) {
        console.log("designedcustomdata", designedcustomdata);
        if (designedcustomdata.length > 0) {
            await ZOHO.CRM.API.insertRecord({ Entity: "constentcontact__list", APIData: designedcustomdata, Trigger: ["workflow"] }).
                then(async function (response) {
                    console.log("inserted main record", response);
                    var relateddata = [];
                    for (var i = 0; i < contactlist.length; i++) {
                        console.log("contactlist each", contactlist[i], moduledata);
                        //let each_record = moduledata.filter(obj => obj.Email === contactlist[i].email_address.address);
                        if (contactlist[i].custom_fields.length > 0) {
                            if (contactlist[i].custom_fields[1].value == "All Leads") {
                                if (moduledata.length > 0) {
                                    await window.apiUtil.insertintolinkingmodule(i, moduledata);
                                }
                            } else {
                                await ZOHO.CRM.META.getCustomViews({ "Entity": entity }).then(async function (allcustomview) {
                                    console.log(allcustomview);
                                    if (allcustomview.statusText != "nocontent") {
                                        customview = allcustomview.custom_views;
                                        let each_view = customview.filter(obj => obj.display_value === contactlist[i].custom_fields[1].value);
                                        console.log("each_view", each_view);
                                        if (each_view.length > 0) {
                                            await ZOHO.CRM.API.getAllRecords({ "Entity": entity, "cvid": each_view[0].id }).then(async function (specificviewdata) {
                                                console.log("customview record", specificviewdata);
                                                if (specificviewdata.statusText != "nocontent") {
                                                    customviewdata = specificviewdata.data;
                                                    await window.apiUtil.insertintolinkingmodule(i, customviewdata);
                                                }
                                            });
                                        }
                                    }
                                });
                            }

                        } else {
                            console.log("not found");
                            if (contactlist[i].hasOwnProperty("last_name") && contactlist[i].hasOwnProperty("company_name")) {
                                var recordData = {
                                    "Company": contactlist[i].company_name,
                                    "Email": contactlist[i].email_address.address,
                                    "First_Name": contactlist[i].first_name,
                                    "Last_Name": contactlist[i].last_name
                                }
                                console.log("recordData", recordData);
                                await ZOHO.CRM.API.insertRecord({ Entity: "Leads", APIData: recordData, Trigger: ["workflow"] }).then(async function (response) {
                                    console.log("inserted related record", response);
                                    await Configrelateddata(i, response.data[0].details.id).then(async function (related) {
                                        console.log("relate", related);
                                        relateddata = related;
                                        console.log("relate", relateddata);
                                        if (relateddata.length) {
                                            await ZOHO.CRM.API.insertRecord({ Entity: "ConstantList_Vs_Leads", APIData: relateddata, Trigger: ["workflow"] }).then(async function (response) {
                                                console.log("inserted related record", response);
                                            })
                                        }
                                    })
                                })
                            }
                        }
                    }
                    console.log("relateddata", relateddata);
                });
        }
    },
    createlist: async function (custommodulelistid, selectedview) {
        var External_listid = document.getElementById("specificlist").getAttribute("value");
        await window.apiUtil.configmoduledata(custommodulelistid, selectedview).then(async function (configdata) {
            console.log("configuredata", configdata);
            //  var designedimportdata = window.apiUtil.designtheimportdata(configdata, matcheddata.data[0].id);
            await window.apiUtil.designtheimportdata(configdata, custommodulelistid, selectedview).then(async function (designedimportdata) {
                console.log("designedimportdata", designedimportdata);
                await pushtoconstantcontact(designedimportdata, External_listid);
            })
        })
    },
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
        document.getElementById("errormsg").innerHTML = errmessage;
        setTimeout(async function () {
            document.getElementById("error").style.display = "none";
            document.getElementById("errormsg").innerHTML = '';
            await ZOHO.CRM.UI.Popup.close()
                .then(function (data) {
                    console.log(data)
                })
        }, 3000);
    },
    insertintolinkingmodule: async function (contactlistindex, specificviewdatas) {
        var index = specificviewdatas.findIndex(record => record.Email.toLowerCase() === contactlist[contactlistindex].email_address.address);
        console.log("each_module_record", index);
        if (index != -1) {
            console.log("found");
            //await Configrelateddata(contactlistindex, moduledata[index].id).then(async function (related) {
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
    filternewlycreatedrecord: async function (listid, selectedview) {
        console.log("selectedview", selectedview);
        var filterdata = [];
        await ZOHO.CRM.API.searchRecord({ Entity: "ConstantList_Vs_Leads", Type: "criteria", Query: "(Associate_List:equals:" + listid + ")" })
            .then(function (response) {
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
                        console.log("moduledata", moduledata, selectedview);
                        filterdata = moduledata;
                    } else {
                        filterdata = specificcustomviewdata;
                    }
                }
            })
        console.log("finalfilterdata", filterdata, moduledata);
        return filterdata;
    },
    //Insertnewlist: async function (syncname, listname, synctoinitiate, selectedview, listid) {
    Insertnewlist: async function (syncname, listname, selectedview, listid) {
        var data = [
            {
                "Name": listname,
                "Sync_Name": syncname,
                "Mapping_Parameter": selectedview,
                "constentcontact__listid": listid
            }
        ];
        console.log("Insertnewlistdata", data);
        await ZOHO.CRM.API.insertRecord({ Entity: "constentcontact__list", APIData: data, Trigger: ["workflow"] }).then(async function (response) {
            console.log("inserted main record", response);
            var internallistid = response.data[0].details.id;
            await window.apiUtil.configmoduledata(internallistid, selectedview).then(async function (configuredata) {
                //await configmoduledata(matcheddata).then(async function (configuredata) {
                console.log("configuredata", configuredata);
                //var designedimportdata =window.apiUtil.designtheimportdata(configuredata, response.data[0].id);
                await window.apiUtil.designtheimportdata(configuredata, internallistid, selectedview).then(async function (designedimportdata) {
                    //await designtheimportdata(configuredata, matcheddata).then(async function (designedimportdata) {
                    console.log("designedimportdata", designedimportdata);
                    // pushtoconstantcontact(designedimportdata, response.data[0].id);
                    await pushtoconstantcontact(designedimportdata, listid);
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
        // var synctoinitiate = document.getElementById("synctoinitiate").innerHTML;
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
            //designimportdata[i]["cf:sync_frequency"] = synctoinitiate;
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
        console.log("designimportdata", designimportdata);
        return designimportdata;
    }
};

window.apiUtil = apiCore;