var selectview;
newlycreatedlead = [];
specificcustomviewdata = [];
//var thirdparty_createlistdata;
metafields = [];
addnewlist = false;
customview = [];
$(document).ready(function () {
    $(document).on("click", async function (event) {
        if (event.target.name == "allContacts") {
            var ele = document.getElementsByName('allContacts');
            for (i = 0; i < ele.length; i++) {
                if (ele[i].checked)
                    selectview = ele[i].value;
            }
            document.getElementById("selectview").style.display = "none";
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
            }
        }
        if (event.target.id == "addnewSynclist") {
            console.log("created new list", event);
            addnewlist = true;
        }
        if (event.target.className == "leadstype" || event.target.className == "LT") {
            document.getElementById("specificlead").innerText = event.target.innerText;
            document.getElementsByClassName("userselectedlead")[0].setAttribute("value", event.target.id);
            document.getElementById("selectcustomview").style.display = "none";
            getspecificcustomviewdata(event.target.id);
        }
        if (event.target.className == "listname" || event.target.className == "LiV") {
            document.getElementById("specificlist").innerText = event.target.innerText;
            document.getElementsByClassName("userselectedlist")[0].setAttribute("value", event.target.id);
            document.getElementById("selectlistname").style.display = "none";
        }
        if (event.target.className == "crmfields" || event.target.className == "crm") {
            document.getElementById("specificfield").innerText = event.target.innerText;
            document.getElementsByClassName("userselectedfield")[0].setAttribute("value", event.target.id);
        }
        if (event.target.className == "constantfields" || event.target.className == "constant") {
            document.getElementById("constantfield").innerText = event.target.innerText;
            document.getElementsByClassName("selectedconstantfield")[0].setAttribute("value", event.target.id);
        }
        /* if (event.target.className == "modulesynctype" || event.target.className == "LiVe") {
            document.getElementById("synctoinitiate").innerText = event.target.innerText;
            showhide_basedonsynctype();
        } */
        if (!$(event.target).closest("#selectlist").length && !$(event.target).closest("#myInput").length
            && !$(event.target).closest("#synctype").length && !$(event.target).closest("#typemodule").length && !$(event.target).closest("#selectcustomleads").length
            && !$(event.target).closest("#crmNewFieldFltr").length && !$(event.target).closest("#constantNewFielddrpdwn").length) {
            $(".zdPopover").slideUp("fast");
            $('div').remove('.zdPopover');
        }
        if (event.target.className == "moduletype" || event.target.className == "everymodule") {
            document.getElementById("syncmodule").innerText = event.target.innerText;
            entity = document.getElementById("syncmodule").innerText;
            document.getElementById("emptymodule").style.display = "none";
            /* await window.apiUtil.GetInitiallistcontact_thirdparty(event.target.innerText).then(function () {
                showhide_basedonsynctype();
            }) */
            await window.apiUtil.GetInitiallistcontact_custommodule(event.target.innerText).then(function () {
                showhide_basedonsynctype();
            })
        }
    });
});
/* function synctype() {
    console.log("clicked");
    if (!document.getElementById("syncoption")) {
        $('div').remove('.zdPopover');
        var settop = document.getElementById("synctype").offsetTop;
        // var scrollTop = $("#Appcreate").scrollTop();
        // settop = settop - scrollTop + 30;
        var offsetWidth = document.getElementById('synctype').offsetWidth;
        $('body').append('<div class="zdPopover" id="syncoption" style="min-width:' + offsetWidth + 'px; max-width: 361px; left: 406px;font-size:18px;">' +
            '<ul class="inputDropdown" id="sync" style="display: block;">' +

            '<div style="line-height:0;"><i class="glyphicon glyphicon-search" id="dropdownsearchicon"></i>' +
            '<input type="text" id="myInput" onkeyup="dropdownsearchfilter(sync)" autocomplete="off" placeholder="Search.." style="width:94%"></div>' +

            '<li id="0" class="modulesynctype"><span class="LiVe" id="Immediate_sync" title="Immediate_sync">Immediate sync</span></li>' +
            '<li id="1" class="modulesynctype"><span class="LiVe" id="Periodic_sync" title="Periodic_sync">Periodic sync</span></li>' +
            '</ul></div>');
    }
    var el = $('#synctype'); //this would just be your selector
    var bottom = el.offset().top + el.outerHeight(true);
    var settop = $("#synctype").offset().top;
    if (bottom > 325) {
        var elmnt = document.getElementsByClassName("inputDropdown")[0];
        console.log("elemnt", elmnt);
        settop = settop - elmnt.offsetHeight;
    } else {
        settop = settop + document.getElementById("synctype").offsetHeight;
    }
    document.getElementById("syncoption").style.top = settop + "px";
    console.log("finalsettop", settop);
} */
function diffmodule() {
    if (!document.getElementById("moduleoption")) {
        $('div').remove('.zdPopover');
        var settop = document.getElementById("typemodule").offsetTop;
        // var scrollTop = $("#Appcreate").scrollTop();
        // settop = settop - scrollTop + 30;
        var offsetWidth = document.getElementById('typemodule').offsetWidth;
        $('body').append('<div class="zdPopover" id="moduleoption" style="min-width:' + offsetWidth + 'px; max-width: 361px; left: 406px;font-size:18px;">' +
            '<ul class="inputDropdown" id="modules" style="display: block;">' +

            '<div style="line-height:0;"><i class="glyphicon glyphicon-search" id="dropdownsearchicon"></i>' +
            '<input type="text" id="myInput" onkeyup="dropdownsearchfilter(modules)" autocomplete="off" placeholder="Search.." style="width:94%"></div>' +

            '<li id="0" class="moduletype"><span class="everymodule" id="Leads">Leads</span></li>' +
            '<li id="1" class="moduletype"><span class="everymodule" id="Contacts">Contacts</span></li>' +
            '</ul></div>');
    }
    var el = $('#typemodule'); //this would just be your selector
    var bottom = el.offset().top + el.outerHeight(true);
    var settop = $("#typemodule").offset().top;
    if (bottom > 325) {
        var elmnt = document.getElementsByClassName("inputDropdown")[0];
        console.log("elemnt", elmnt);
        settop = settop - elmnt.offsetHeight;
    } else {
        settop = settop + document.getElementById("typemodule").offsetHeight;
    }
    document.getElementById("moduleoption").style.top = settop + "px";
    console.log("finalsettop", settop);
}
function Getcustomview() {
    if (!document.getElementById("specificview")) {
        $('div').remove('.zdPopover');
        var settop = document.getElementById("selectcustomleads").offsetTop;
        var offsetWidth = document.getElementById('selectcustomleads').offsetWidth;
        $('body').append('<div class="zdPopover" id="specificview" style="min-width:' + offsetWidth + 'px; max-width: ' + offsetWidth + 'px; left: 170px;">' +
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
    var el = $('#selectcustomleads'); //this would just be your selector
    var bottom = el.offset().top + el.outerHeight(true);
    var settop = $("#selectcustomleads").offset().top;
    if (bottom > 325) {
        var elmnt = document.getElementsByClassName("inputDropdown")[0];
        console.log("elemnt", elmnt);
        settop = settop - elmnt.offsetHeight;
    } else {
        settop = settop + document.getElementById("selectcustomleads").offsetHeight;
    }
    document.getElementById("specificview").style.top = settop + "px";
    console.log("finalsettop", settop);
}
function Getlistname() {
    console.log("opened");
    if (!document.getElementById("listselect")) {
        $('div').remove('.zdPopover');
        var offsetWidth = document.getElementById('selectlist').offsetWidth;
        $('body').append('<div class="zdPopover" id="listselect" style="min-width:' + offsetWidth + 'px; max-width: 200px; left: 170px;">' +
            '</div>');
        let rootElement = document.getElementById("listselect"), _template;
        _template = '<ul class="inputDropdown" id="syncto_list" style="display: block;">' +

            '<div style="line-height:0;"><i class="glyphicon glyphicon-search" id="dropdownsearchicon"></i>' +
            '<input type="text" id="myInput" onkeyup="dropdownsearchfilter(syncto_list)" autocomplete="off" placeholder="Search.."></div>';
        if (custommodulelist.length > 0) {
            for (var i = 0; i < custommodulelist.length; i++) {
                console.log(custommodulelist[i].Name);
                _template += '<li id="' + custommodulelist[i].constentcontact__listid + '" class="listname"><span class="LiV" id="' + custommodulelist[i].constentcontact__listid + '" title="' + custommodulelist[i].Name + '">' + custommodulelist[i].Name + '</span></li>';
            }
        }
        /*  if (Totallist.length > 0) {
        for (var i = 0; i < Totallist.length; i++) {
            _template += '<li id="' + Totallist[i].list_id + '" class="listname"><span class="LiV" id="' + Totallist[i].list_id + '" title="' + Totallist[i].name + '">' + Totallist[i].name + '</span></li>';
        }
    } */
        _template += '<li  class="test" id="addlist"  style="text-align:center;cursor: pointer;"><span class="createlist" title="Create mailing list" data-toggle="modal" data-target="#myModal" style="font-size: 14px;color: #349bee !important;" >Create mailing list</span></li></ul>';
        rootElement.innerHTML = _template;

    }
    var el = $('#selectlist'); //this would just be your selector
    var bottom = el.offset().top + el.outerHeight(true);
    var settop = $("#selectlist").offset().top;
    if (bottom > 325) {
        var elmnt = document.getElementsByClassName("inputDropdown")[0];
        console.log("elemnt", elmnt);
        settop = settop - elmnt.offsetHeight;
    } else {
        settop = settop + document.getElementById("selectlist").offsetHeight;
    }
    document.getElementById("listselect").style.top = settop + "px";
    console.log("finalsettop", settop);
    $("#addlist").click(function (event) {
        // $('#myModal').modal('show');
        console.log("open popup");
        $("#myModal .modal-header").css("display", "block");
        $('#myModal .modal-title').html('Create mailing list');
        //$("#myModal .modal-footer").css("display", "none");
        $("#myModal .modal-body").css("font-size", "13px");
        $('#myModal .modal-body').html('<div class="p20" id="listCont">' +
            '<div class="cmpfrm uslct w100" style="margin-top:0px;"><ul><li><label>Name</label></li>' +
            '<li><input id="LIST_NAME" maxlength="100" type="text" class="w70" name="listInputBox">' +
            '<div id="error_1" class="frmerrdiv" style="display:none;position:initial;">Duplicate list name is found.<br>Please select it from the above existing lists.</div>' +
            '<div id="error_2" class="frmerrdiv " style="display:none;">Please enter the listname </div></li></ul>' +
            '<ul><li class="vt"><label>Tell contacts how you know them<span style="color: rgb(180, 0, 0);">*</span></label></li>' +
            '<li><textarea class="w70" maxlength="300" id="DESC" style="height:60px" placeholder=" e.g. You are receiving this newsletter because you have signed up for it on our website" name="DESCRIPTION" purpose=" e.g. You are receiving this newsletter because you have signed up for it on our website"></textarea>' +
            '<div id="error_3" class="frmerrdiv" style="display:none;">List description cannot be empty.</div>' +
            '<div class="f12 lgtgrytxt"><p style="word-break: break-all;width: 319px;">Note: Your message will be added to the footers of all your email campaigns.</p></div></li></ul>' +
            '</div></div>');
        $('#myModal .modal-footer').html('<span class="PluginButton" id="addnewSynclist">Save</span>' +
            '<button class="PluginCancelButton" data-dismiss="modal">Cancel</button>');

        $('#addnewSynclist').click(async function () {
            console.log("function called");
            var listname = document.getElementById("LIST_NAME").value;
            var desc = document.getElementById("DESC").value;
            console.log("hfj", listname, desc);
            var duplicatelistname = false;
            if (listname != "") {
                var findIndexlistname = Totallist.findIndex((list) => (list.name === listname));
                console.log("findIndexlistname", findIndexlistname);
                if (findIndexlistname != -1) {
                    duplicatelistname = true;
                }
                /* await ZOHO.CRM.API.searchRecord({ Entity: "constentcontact__list", Type: "criteria", Query: "(Name:equals:" + listname + ")" })
                      .then(async function (matcheddata) {
                          if (matcheddata.statusText != "nocontent") {
                              duplicatelistname = true;
                          }
                      }) */
            }
            console.log("duplicatelistname", duplicatelistname);
            if (listname != "" && desc != "") {
                console.log("duplicatelistname", duplicatelistname);
                if (duplicatelistname == false) {
                    console.log("having all values");
                    $('#myModal').modal('hide');
                    $('.modal-backdrop').hide();
                    document.getElementById("specificlist").innerText = document.getElementById("LIST_NAME").value;
                    document.getElementById("error_1").style.display = "none";
                    document.getElementById("error_2").style.display = "none";
                    document.getElementById("error_3").style.display = "none";
                    var dataobj = {
                        "listname": listname,
                        "listdesc": desc
                    }
                    await ZOHO.CRM.CONNECTOR.invokeAPI("constentcontact.constantcontact.create_list", dataobj)
                        .then(async function (data) {
                            var createlistdata = JSON.parse(data.response);
                            // thirdparty_createlistdata=createlistdata;
                            console.log("list", createlistdata);
                            document.getElementsByClassName("userselectedlist")[0].setAttribute("value", createlistdata.list_id);
                        })
                } else {
                    $('#myModal').modal('show');
                    document.getElementById("error_1").style.display = "block";
                }
            } else if (listname == "" && desc != "") {
                $('#myModal').modal('show');
                document.getElementById("error_1").style.display = "none";
                document.getElementById("error_2").style.display = "block";
                document.getElementById("error_3").style.display = "none";
            } else if (listname != "" && desc == "") {
                if (duplicatelistname == false) {
                    console.log("empty desc");
                    $('#myModal').modal('show');
                    document.getElementById("error_1").style.display = "none";
                    document.getElementById("error_3").style.display = "block";
                    document.getElementById("error_2").style.display = "none";
                } else {
                    $('#myModal').modal('show');
                    document.getElementById("error_1").style.display = "block";
                }
            }
            else if (listname == "" && desc == "") {
                $('#myModal').modal('show');
                document.getElementById("error_2").style.display = "block";
                document.getElementById("error_3").style.display = "block";
            }

        });
    });

}

function getspecificcustomviewdata(optionid) {
    console.log("optionid", optionid);
    var typeofview = document.getElementById("specificlead").innerText;
    var customviewid = document.getElementById("specificlead").getAttribute("value");
    console.log("optionid", optionid, customviewid);
    if (customviewid != "") {
        ZOHO.CRM.API.getAllRecords({ "Entity": entity, "cvid": customviewid }).then(function (data) {
            console.log("customview record", data);
            if (data.statusText != "nocontent") {
                specificcustomviewdata = data.data;
            } else {
                document.getElementById("error").style.display = "block";
                document.getElementById("errormsg").innerHTML = "There is no record in " + typeofview;
                console.log("before filter customview", customview);
                customview = customview.filter(cview => cview.id != customviewid);
                document.getElementById("specificlead").innerText = "";
                console.log("after filter customview", customview);
                setTimeout(async function () {
                    document.getElementById("error").style.display = "none";
                    document.getElementById("errormsg").innerHTML = '';
                }, 3000);
            }
        });
    }
}
function showhide_basedonsynctype() {
    //var typeofsync = document.getElementById("synctoinitiate").innerText;
    var typeofmodule = document.getElementById("syncmodule").innerText;
    // if (typeofsync != "" && typeofmodule != "") {
    if (typeofmodule != "") {
        //document.getElementById("emptysync").style.display = "none";
        document.getElementById("moduletype").style.display = "none";
        document.getElementById("syncdiv").style.display = "block";
        document.getElementById("crmCreationBottomBand").style.display = "block";
    } /* else if (typeofsync == "") {
        document.getElementById("emptysync").style.display = "block";
        document.getElementById("emptymodule").style.display = "none";
        document.getElementById("moduletype").style.display = "block";
        document.getElementById("syncdiv").style.display = "none";
        document.getElementById("crmCreationBottomBand").style.display = "none";
    } */ else if (typeofmodule == "") {
        // document.getElementById("emptysync").style.display = "none";
        setTimeout(async function () {
            if (document.getElementById("syncmodule").innerText == "") {
                document.getElementById("emptymodule").style.display = "block";
            } else {
                document.getElementById("emptymodule").style.display = "none";
            }
        }, 3000);
        //document.getElementById("typesync").style.display = "block";
        document.getElementById("moduletype").style.display = "block";
        document.getElementById("syncdiv").style.display = "none";
        document.getElementById("crmCreationBottomBand").style.display = "none";
    } /* else if (typeofsync == "" && typeofmodule == "") {
        document.getElementById("emptysync").style.display = "block";
        setTimeout(async function () {
            if (document.getElementById("syncmodule").innerText == "") {
                document.getElementById("emptymodule").style.display = "block";
            } else {
                document.getElementById("emptymodule").style.display = "none";
            }
        }, 3000);
        //document.getElementById("typesync").style.display = "block";
        document.getElementById("moduletype").style.display = "block";
        document.getElementById("syncdiv").style.display = "none";
        document.getElementById("crmCreationBottomBand").style.display = "none";
    } */
}

function backsyncSelectView() {
    //document.getElementById("typesync").style.display = "block";
    document.getElementById("moduletype").style.display = "block";
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
function fieldmapping() {
    document.getElementById("newMappingDiv").style.display = "block";
    document.getElementById("addNewMap").style.display = "none";
    $("#newMappingDiv").appendTo($("#selMapDiv"));
    document.getElementById("specificfield").innerText = "Select CRM Field";
    document.getElementById("constantfield").innerText = "Select Constant Contact Field";
    if (metafields.length == 0) {
        ZOHO.CRM.META.getFields({ "Entity": entity }).then(function (data) {
            console.log(data);
            metafields = data.fields;
        });
    }
}
function fltrdrpdwn(event) {
    console.log("crm new field click", event);
    if (!document.getElementById("crmNewFielddrpdwn")) {
        $('div').remove('.zdPopover');
        var offsetWidth = document.getElementById('crmNewFieldFltr').offsetWidth;
        $('body').append('<div class="zdPopover" id="crmNewFielddrpdwn" style="min-width:' + offsetWidth + 'px; max-width:' + offsetWidth + 'px ; left: 85px;">' +
            '</div>');
        let rootElement = document.getElementById("crmNewFielddrpdwn"), _template;
        _template = '<ul class="inputDropdown" id="fields" style="display: block;">' +

            '<div style="line-height:0;"><i class="glyphicon glyphicon-search" id="dropdownsearchicon"></i>' +
            '<input type="text" id="myInput" onkeyup="dropdownsearchfilter(fields)" autocomplete="off" placeholder="Search.." style="width:95%"></div>';
        if (metafields.length > 0) {
            for (var i = 1; i < metafields.length; i++) {
                if (metafields[i].field_label != "Last Name" && metafields[i].field_label != "Email") {
                    _template += '<li id="' + metafields[i].api_name + '" class="crmfields"><span class="crm" id="' + metafields[i].api_name + '" title="' + metafields[i].field_label + '">' + metafields[i].field_label + '</span></li>';
                }
            }
        }

        _template += '</ul>';
        rootElement.innerHTML = _template;
    }
    var el = $('#crmNewFieldFltr'); //this would just be your selector
    var bottom = el.offset().top + el.outerHeight(true);
    var settop = $("#crmNewFieldFltr").offset().top;
    if (bottom > 325) {
        var elmnt = document.getElementsByClassName("inputDropdown")[0];
        console.log("elemnt", elmnt);
        settop = settop - elmnt.offsetHeight;
    } else {
        settop = settop + document.getElementById("crmNewFieldFltr").offsetHeight;
    }
    document.getElementById("crmNewFielddrpdwn").style.top = settop + "px";
    console.log("finalsettop", settop);
}
function constantdrpdwn() {
    console.log("constant new fieldclick", contactlist);
    if (!document.getElementById("constantFielddrpdwn")) {
        $('div').remove('.zdPopover');
        var offsetWidth = document.getElementById('constantNewFielddrpdwn').offsetWidth;
        $('body').append('<div class="zdPopover" id="constantFielddrpdwn" style="min-width:' + offsetWidth + 'px; max-width: ' + offsetWidth + 'px; left: 331px;">' +
            '<ul class="inputDropdown" id="difffield" style="display: block;">' +
            '<div style="line-height:0;"><i class="glyphicon glyphicon-search" id="dropdownsearchicon"></i>' +
            '<input type="text" id="myInput" onkeyup="dropdownsearchfilter(difffield)" autocomplete="off" placeholder="Search.." style="width:95%"></div>' +
            '<li id="company_name" class="constantfields"><span class="constant" id="company_name">Company Name</span></li>' +
            '<li id="first_name" class="constantfields"><span class="constant" id="first_name">First Name</span></li>' +
            '<li id="create_source" class="constantfields"><span class="constant" id="create_source">Create Source</span></li>' +
            '<li id="street" class="constantfields"><span class="constant" id="street">Street</span></li>' +
            '<li id="city" class="constantfields"><span class="constant" id="city">City</span></li>' +
            '<li id="state" class="constantfields"><span class="constant" id="state">State</span></li>' +
            '<li id="zip" class="constantfields"><span class="constant" id="zip">Zip Code</span></li>' +
            '<li id="country" class="constantfields"><span class="constant" id="country">Country</span></li>' +
            '</ul></div>');
    }
    var el = $('#constantNewFielddrpdwn'); //this would just be your selector
    var bottom = el.offset().top + el.outerHeight(true);
    var settop = $("#constantNewFielddrpdwn").offset().top;
    if (bottom > 325) {
        var elmnt = document.getElementsByClassName("inputDropdown")[0];
        console.log("elemnt", elmnt);
        settop = settop - elmnt.offsetHeight;
    } else {
        settop = settop + document.getElementById("constantNewFielddrpdwn").offsetHeight;
    }
    document.getElementById("constantFielddrpdwn").style.top = settop + "px";
    console.log("finalsettop", settop);
}
function addCrmMapping() {
    var crmfield = document.getElementById("specificfield").innerHTML;
    var crmfieldapiname = document.getElementById("specificfield").getAttribute("value");
    var constantfield = document.getElementById("constantfield").innerHTML;
    var constantfieldapiname = document.getElementById("constantfield").getAttribute("value");
    console.log("crmfield " + crmfield, "crmfieldapiname " + crmfieldapiname, "constantfield ", constantfield, "constantfieldapiname" + constantfieldapiname);
    let rootElement = document.getElementById("selMapDiv"), _template;
    _template = '<div class="tbl W100 f14  "><div id="crmMapDiv_' + crmfieldapiname + '" onmouseover="showIcons(id)" onmouseout="hideIcons(id)">' +
        '<div class="w30 p15 bdrbtm" id=' + crmfieldapiname + '>' + crmfield + '</div><div class="w30 p15 bdrbtm">' +
        '<i class="fa fa-long-arrow-right" aria-hidden="true"></i></div>' +
        '<div class="bdrbtm w30" id=' + constantfieldapiname + '>' + constantfield + '</div><div class="bdrbtm w200x vm">' +
        '<i class="fa fa-trash" id="deleteCrmMap_' + crmfieldapiname + '" onclick="syncMapDelete(id)" aria-hidden="true" style="display:none;"></i></div></div></div>';

    rootElement.innerHTML += _template;
    document.getElementById("newMappingDiv").style.display = "none";
    document.getElementById("addNewMap").style.display = "block";
    $("#addNewMap").appendTo($("#selMapDiv"));
}
function closenewmappingdiv() {
    document.getElementById("newMappingDiv").style.display = "none";
    document.getElementById("addNewMap").style.display = "block";
}
function showIcons(crmfield) {
    var newString = crmfield.slice(crmfield.indexOf("_") + 1);
    console.log("apicrmfield", newString);
    document.getElementById("deleteCrmMap_" + newString).style.display = "block";
}
function hideIcons(crmfield) {
    var newString = crmfield.slice(crmfield.indexOf("_") + 1);
    console.log("apicrmfield", newString);
    document.getElementById("deleteCrmMap_" + newString).style.display = "none";
}
function syncMapDelete(crmfield) {
    var newString = crmfield.slice(crmfield.indexOf("_") + 1);
    console.log("apicrmfield", newString);
    $("#crmMapDiv_" + newString).remove();
}