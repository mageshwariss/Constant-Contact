var selectview;
newlycreatedlead = [];
specificcustomviewdata = [];
addnewlist = false;
customview = [];
function synctype() {
    console.log("clicked");
    if (!document.getElementById("syncoption")) {
        $('div').remove('.zdPopover');
        var settop = document.getElementById("synctype").offsetTop;
        // var scrollTop = $("#Appcreate").scrollTop();
        // settop = settop - scrollTop + 30;
        var offsetWidth = document.getElementById('synctype').offsetWidth;
        $('body').append('<div class="zdPopover" id="syncoption" style="min-width:' + offsetWidth + 'px; max-width: 361px; left: 406px;top:195px;font-size:18px;">' +
            '<ul class="inputDropdown" id="sync" style="display: block;">' +

            '<div style="line-height:0;"><i class="glyphicon glyphicon-search" id="dropdownsearchicon"></i>' +
            '<input type="text" id="myInput" onkeyup="dropdownsearchfilter(sync)" autocomplete="off" placeholder="Search.." style="width:94%"></div>' +

            '<li id="0" class="modulesynctype"><span class="LiVe" id="Immediate_sync" title="Immediate_sync">Immediate sync</span></li>' +
            '<li id="1" class="modulesynctype"><span class="LiVe" id="Periodic_sync" title="Periodic_sync">Periodic sync</span></li>' +
            '</ul></div>');
    }
}
function Getcustomview() {
    if (!document.getElementById("specificview")) {
        $('div').remove('.zdPopover');
        var settop = document.getElementById("selectcustomleads").offsetTop;
        var offsetWidth = document.getElementById('selectcustomleads').offsetWidth;
        $('body').append('<div class="zdPopover" id="specificview" style="min-width:' + offsetWidth + 'px; max-width: 361px; left: 160px;top:' + settop + 'px;">' +
            '</div>');
        let rootElement = document.getElementById("specificview"), _template;
        _template = '<ul class="inputDropdown" id="typeofleads" style="display: block;">' +

            '<div style="line-height:0;"><i class="glyphicon glyphicon-search" id="dropdownsearchicon"></i>' +
            '<input type="text" id="myInput" onkeyup="dropdownsearchfilter(typeofleads)" autocomplete="off" placeholder="Search.." style="width:95%"></div>';
        if (customview.length > 0) {
            for (var i = 1; i < customview.length; i++) {
                _template += '<li id="' + customview[i].id + '" class="leadstype"><span class="LT" id="' + customview[i].id + '" title="' + customview[i].display_value + '">' + customview[i].display_value + '</span></li>';
            }
        }

        _template += '</ul>';
        rootElement.innerHTML = _template;
    }
}
function Getlistname() {
    console.log("opened");
    if (!document.getElementById("listselect")) {
        $('div').remove('.zdPopover');
        var settop = document.getElementById("selectlist").offsetTop;
        // var scrollTop = $("#Appcreate").scrollTop();
        // settop = settop - scrollTop + 30;
        var offsetWidth = document.getElementById('selectlist').offsetWidth;
        $('body').append('<div class="zdPopover" id="listselect" style="min-width:' + offsetWidth + 'px; max-width: 200px; left: 160px;top:' + settop + 'px;">' +
            '</div>');
        let rootElement = document.getElementById("listselect"), _template;
        _template = '<ul class="inputDropdown" id="syncto_list" style="display: block;">' +

            '<div style="line-height:0;"><i class="glyphicon glyphicon-search" id="dropdownsearchicon"></i>' +
            '<input type="text" id="myInput" onkeyup="dropdownsearchfilter(syncto_list)" autocomplete="off" placeholder="Search.."></div>';
        if (Totallist.length > 0) {
            for (var i = 0; i < Totallist.length; i++) {
                _template += '<li id="' + Totallist[i].list_id + '" class="listname"><span class="LiV" id="' + Totallist[i].list_id + '" title="' + Totallist[i].name + '">' + Totallist[i].name + '</span></li>';
            }
        }
        _template += '<li  class="test" id="addlist"  style="text-align:center;cursor: pointer;"><span class="createlist" title="Create mailing list" data-toggle="modal" data-target="#myModal" style="font-size: 14px;color: #349bee !important;" >Create mailing list</span></li></ul>';
        rootElement.innerHTML = _template;

    }
    $("#addlist").click(function (event) {
        console.log("open popup");
        $("#myModal .modal-header").css("display", "block");
        $('#myModal .modal-title').html('Create mailing list');
        //$("#myModal .modal-footer").css("display", "none");
        $("#myModal .modal-body").css("font-size", "13px");
        $('#myModal .modal-body').html('<div class="p20" id="listCont">' +
            '<div class="cmpfrm uslct w100" style="margin-top:0px;"><ul><li><label>Name</label></li>' +
            '<li><input id="LIST_NAME" maxlength="100" type="text" class="w70" name="listInputBox">' +
            '<div id="error_1" class="frmerrdiv" style="display:none;position:initial;">Duplicate list name is found. Please select it from the above existing lists.</div>' +
            '<div id="error_2" class="frmerrdiv " style="display:none;">Please enter the listname </div></li></ul>' +
            '<ul><li class="vt"><label>Tell contacts how you know them<span style="color: rgb(180, 0, 0);">*</span></label></li>' +
            '<li><textarea class="w70" maxlength="300" id="DESC" style="height:60px" placeholder=" e.g. You are receiving this newsletter because you have signed up for it on our website" name="DESCRIPTION" purpose=" e.g. You are receiving this newsletter because you have signed up for it on our website"></textarea>' +
            '<div id="error_3" class="frmerrdiv" style="display:none;">List description cannot be empty.</div>' +
            '<div class="f12 lgtgrytxt"><p style="word-break: break-all;width: 319px;">Note: Your message will be added to the footers of all your email campaigns.</p></div></li></ul>' +
            '</div></div>');
        $('#myModal .modal-footer').html('<span class="PluginButton" id="addnewSynclist">Save</span>' +
            '<button class="PluginCancelButton" data-dismiss="modal">Cancel</button>');

        $('#addnewSynclist').click(function () {
            console.log("function called");
            var listname = document.getElementById("LIST_NAME").value;
            var desc = document.getElementById("DESC").value;
            console.log("hfj", listname, desc);
            if (listname != "" && desc != "") {
                console.log("having all values");
                $('#myModal').modal('hide');
                $('.modal-backdrop').hide();
                document.getElementById("specificlist").innerText = document.getElementById("LIST_NAME").value;
                document.getElementById("error_2").style.display = "none";
                document.getElementById("error_3").style.display = "none";
                var dataobj = {
                    "listname": listname,
                    "listdesc": desc
                }
                ZOHO.CRM.CONNECTOR.invokeAPI("constentcontact.constantcontact.create_list", dataobj)
                    .then(async function (data) {
                        var createlistdata = JSON.parse(data.response);
                        console.log("list", createlistdata);
                        document.getElementsByClassName("userselectedlist")[0].setAttribute("value", createlistdata.list_id);
                        //window.apiUtil.Insertnewlist(listname, synctoinitiate, typeofview);
                    })
            } else if (listname == "" && desc != "") {
                $('#myModal').modal('show');
                document.getElementById("error_2").style.display = "block";
                document.getElementById("error_3").style.display = "none";
                // document.getElementsById("LIST_NAME").setAttribute("class", "err");
                // document.getElementsByTagName("input")[0].setAttribute("class", "err");
            } else if (listname != "" && desc == "") {
                console.log("empty desc");
                $('#myModal').modal('show');
                document.getElementById("error_3").style.display = "block";
                document.getElementById("error_2").style.display = "none";
            }
            else if (listname == "" && desc == "") {
                $('#myModal').modal('show');
                document.getElementById("error_2").style.display = "block";
                $('#myModal').modal('show');
                document.getElementById("error_3").style.display = "block";
            }

        });
    });

}
$(document).ready(function () {
    $(document).on("click", async function (event) {
        if (event.target.name == "allContacts") {
            var ele = document.getElementsByName('allContacts');
            for (i = 0; i < ele.length; i++) {
                if (ele[i].checked)
                    selectview = ele[i].value;
            }
            console.log("selectview", selectview);
            if (selectview == "Custom View") {
                document.getElementById('customviewsection').style.display = "table-row";
                if (customview.length == 0) {
                    await ZOHO.CRM.META.getCustomViews({ "Entity": entity }).then(function (data) {
                        console.log(data);
                        if (data.statusText != "nocontent") {
                            customview = data.custom_views;
                        }
                    });
                }

            } else if (selectview == "All Leads") {
                document.getElementById('customviewsection').style.display = "none";
                // window.apiUtil.filternewlycreatedrecord();
                /* await ZOHO.CRM.API.searchRecord({ Entity: entity, Type: "criteria", Query: "(constentcontact__Flag:equals:0)" })
                     .then(function (response) {
                         console.log("response of flag record", response);
                         if (response.statusText != "nocontent") {
                             newlycreatedlead = response.data;
                             console.log("null flag record", newlycreatedlead);
                         }
                     }) */
            }
        }
        if (event.target.id == "addnewSynclist") {
            console.log("created new list", event);
            addnewlist = true;
        }
        if (event.target.className == "leadstype" || event.target.className == "LT") {
            document.getElementById("specificlead").innerText = event.target.innerText;
            document.getElementsByClassName("userselectedlead")[0].setAttribute("value", event.target.id);
            getspecificcustomviewdata();
        }
        if (event.target.className == "listname" || event.target.className == "LiV") {
            document.getElementById("specificlist").innerText = event.target.innerText;
            document.getElementsByClassName("userselectedlist")[0].setAttribute("value", event.target.id);
        }
        if (event.target.className == "modulesynctype" || event.target.className == "LiVe") {
            document.getElementById("synctoinitiate").innerText = event.target.innerText;
            showhide_basedonsynctype();
        }

        if (!$(event.target).closest("#selectlist").length && !$(event.target).closest("#myInput").length
            && !$(event.target).closest("#synctype").length && !$(event.target).closest("#selectcustomleads").length) {
            $(".zdPopover").slideUp("fast");
            $('div').remove('.zdPopover');
        }
    });
});
function getspecificcustomviewdata() {
    var typeofview = document.getElementById("specificlead").innerText;
    var customviewid = document.getElementById("specificlead").getAttribute("value");
    if (customviewid != "") {
        ZOHO.CRM.API.getAllRecords({ "Entity": entity, "cvid": customviewid }).then(function (data) {
            console.log("customview record", data);
            if (data.statusText != "nocontent") {
                specificcustomviewdata = data.data;
            }
        });
    }
}
function showhide_basedonsynctype() {
    document.getElementById("typesync").style.display = "none";
    document.getElementById("syncdiv").style.display = "block";
    document.getElementById("crmCreationBottomBand").style.display = "block";
}
async function pushcontacttoconstantcontact() {
    console.log("moduledata", moduledata);
    var synctoinitiate = document.getElementById("synctoinitiate").innerHTML;
    var typeofview = document.getElementById("specificlead").innerText;
    var listid = document.getElementById("specificlist").getAttribute("value");
    var listname = document.getElementById("specificlist").innerHTML;
    console.log("listid", listid);
    if (addnewlist == true) {
        console.log("clicked newlist");
        window.apiUtil.Insertnewlist(listname, synctoinitiate, typeofview);
    } else {
        /*  ZOHO.CRM.API.searchRecord({ Entity: "ConstantList_Vs_Leads", Type: "criteria", Query: "(Associate_List:equals:" + listname + ")" })
             .then(function (matcheddata) { */
        var selectedview;
        if (selectview == "All Leads") {
            selectedview = selectview;
        } else if (selectview == "Custom View") {
            selectedview = typeofview;
        }
        // await ZOHO.CRM.API.searchRecord({ Entity: "constentcontact__list", Type: "criteria", Query: "((Name:equals:" + listname + ")and(Mapping_Parameter:equals:" + selectedview + "))" })
        // if (selectview == "All Leads") {
        await ZOHO.CRM.API.searchRecord({ Entity: "constentcontact__list", Type: "criteria", Query: "(Name:equals:" + listname + ")" })
            .then(async function (matcheddata) {
                console.log("macheddata", matcheddata);
                if (matcheddata.statusText == "nocontent") {
                    await window.apiUtil.Insertnewlist(listname, synctoinitiate, selectedview, listid);
                    /*  var data = [
                         {
                             "Name": listname,
                             "Sync_Frequency": synctoinitiate,
                             "Mapping_Parameter": typeofview
                         }
                     ];
                     await ZOHO.CRM.API.insertRecord({ Entity: "constentcontact__list", APIData: data, Trigger: ["workflow"] }).then(async function (response) {
                         console.log("inserted main record", response);
                        await window.apiUtil.configmoduledata().then(async function (configuredata) {
                         //await configmoduledata(matcheddata).then(async function (configuredata) {
                             console.log("configuredata", configuredata);
                             //var designedimportdata = designtheimportdata(configuredata, matcheddata);
                             await window.apiUtil.designtheimportdata(configuredata, matcheddata).then(async function (designedimportdata) {
                             //await designtheimportdata(configuredata, matcheddata).then(async function (designedimportdata) {
                                 console.log("designedimportdata", designedimportdata);
                                 // pushtoconstantcontact(designedimportdata, response.data[0].id);
                                 pushtoconstantcontact(designedimportdata, listid);
                             })
                         })
                     }); */
                } else {
                    //var listid = matcheddata.data[0].id;
                    //await configmoduledata(matcheddata).then(async function (configdata) {
                    await window.apiUtil.configmoduledata(matcheddata.data[0].id).then(async function (configdata) {
                        console.log("configuredata", configdata, matcheddata);
                        var designedimportdata = window.apiUtil.designtheimportdata(configdata, matcheddata.data[0].id);
                        // await window.apiUtil.designtheimportdata(configdata, matcheddata.data[0].id).then(async function (designedimportdata) {
                        //await designtheimportdata(configdata, matcheddata).then(async function (designedimportdata) {
                        console.log("designedimportdata", designedimportdata);
                        // pushtoconstantcontact(designedimportdata, matcheddata.data[0].id);

                        pushtoconstantcontact(designedimportdata, listid);
                        //  })
                    })
                }
            })
    }
    // }
}
function pushtoconstantcontact(importcontact, listid) {
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
            } else {
                window.apiUtil.apiErrormsg(resp);
            }
        }).catch(function (error) {
            console.log("error", error);
            window.apiUtil.apiErrormsg(error);
        });
    } else {
        window.apiUtil.apiSuccessmsg("There is no new Lead in CRM");
    }
}
/* async function designtheimportdata(dasigndata, matcheddata) {
    console.log("designdata", designdata);
    var synctoinitiate = document.getElementById("synctoinitiate").innerHTML;
    designimportdata = [];
    customrelatedtdata = [];
    for (var i = 0; i < dasigndata.length; i++) {
        console.log(dasigndata[i].Email);
        designimportdata[i] = {};
        designimportdata[i]["email"] = dasigndata[i].Email;
        designimportdata[i]["first_name"] = dasigndata[i].First_Name;
        designimportdata[i]["last_name"] = dasigndata[i].Last_Name;
        designimportdata[i]["company_name"] = dasigndata[i].Company;
        designimportdata[i]["country"] = dasigndata[i].Country;
        designimportdata[i]["cf:mapping_parameter"] = selectview;
        designimportdata[i]["cf:sync_frequency"] = synctoinitiate;
        if (matcheddata.statusText != "nocontent") {
            var listid = matcheddata.data[0].id;
            customrelatedtdata[i] = {};
            customrelatedtdata[i]["Associate_List"] = listid;
            customrelatedtdata[i]["Associate_Leads"] = dasigndata[i].id;
            var config = {
                Entity: "Leads",
                APIData: {
                    "id": dasigndata[i].id,
                    "constentcontact__Flag": "1"
                },
                Trigger: ["workflow"]
            }
            ZOHO.CRM.API.updateRecord(config)
                .then(function (data) {
                    console.log(data)
                })
        }

    }
    if (customrelatedtdata.length > 0) {
        console.log("relateddata", customrelatedtdata);
        await ZOHO.CRM.API.insertRecord({ Entity: "ConstantList_Vs_Leads", APIData: customrelatedtdata, Trigger: ["workflow"] }).then(function (data) {
            console.log("inserted related record", data);

        });
    }
    return designimportdata;
} */
/* async function configmoduledata(matcheddata) {
    console.log("passedmatcheddata", matcheddata);
    var listid;
    //pagemoduledata = [];
    if (matcheddata.statusText != "nocontent") {
        listid = matcheddata.data[0].id;
        var insertnewdata = []
        console.log("elsepasseddatanocontent", selectview);
        if (selectview == "All Leads") {
            insertnewdata = newlycreatedlead;
            console.log("null flag record", newlycreatedlead);

        } else if (selectview == "Custom View") {
            insertnewdata = specificcustomviewdata;
        }*/
/* await ZOHO.CRM.API.searchRecord({ Entity: "ConstantList_Vs_Leads", Type: "criteria", Query: "(Associate_List:equals:" + listid + ")" })
    .then(async function (response) {
        if (response.statusText != "nocontent") {
            console.log("associatecontact", response);
            associatecontact = response.data;
            relateddata = [];
            for (var j = 0; j < associatecontact.length; j++) {
                if (moduledata.some(contact => contact.id === associatecontact[j].Associate_Leads.id)) {
                    console.log("contact is there in list");
                    moduledata = moduledata.filter((contact) => contact.id !== associatecontact[j].Associate_Leads.id);
                    console.log("filterddata", moduledata);
                }
            }
            console.log("moduledata", moduledata);
            return moduledata;
        } else {
            console.log("this list has no content");
        }
    }) */
// console.log("moduledata", moduledata);
// return moduledata;
/*  console.log("insertnewdata", insertnewdata);
  return insertnewdata;
} else {
  var SendData = []
  console.log("elsepasseddatanocontent", selectview);
  if (selectview == "All Leads") {
      SendData = newlycreatedlead;
      console.log("null flag record", newlycreatedlead);

  } else if (selectview == "Custom View") {
      SendData = specificcustomviewdata;
  }
  return SendData;
}

} */
function backsyncSelectView() {
    document.getElementById("typesync").style.display = "block";
    document.getElementById("syncdiv").style.display = "none";
    document.getElementById("crmCreationBottomBand").style.display = "none";
}
function dropdownsearchfilter(ulid) {
    var input, filter, ul, li, span, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    li = ulid.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        span = li[i].getElementsByTagName("span")[0];
        txtValue = span.textContent || span.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}