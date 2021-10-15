var selectview;
newlycreatedlead = [];
specificcustomviewdata = [];
metafields = [];
customview = [];
var duplicatelistname = false;
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

            } else if (selectview == "All Leads" || selectview == "All Contacts") {
                document.getElementById('customviewsection').style.display = "none";
            }
        }
        if (event.target.className == "leadstype" || event.target.className == "LT") {
            document.getElementById("specificlead").innerText = event.target.innerText;
            document.getElementsByClassName("userselectedlead")[0].setAttribute("value", event.target.id);
            document.getElementById("selectcustomview").style.display = "none";
            getspecificcustomviewdata(event.target.id);
        }
        if (event.target.className == "crmfields" || event.target.className == "crm") {
            document.getElementById("specificfield").innerText = event.target.innerText;
            document.getElementsByClassName("userselectedfield")[0].setAttribute("value", event.target.id);
        }
        if (event.target.className == "constantfields" || event.target.className == "constant") {
            document.getElementById("constantfield").innerText = event.target.innerText;
            document.getElementsByClassName("selectedconstantfield")[0].setAttribute("value", event.target.id);
        }
        if (!$(event.target).closest("#myInput").length
            && !$(event.target).closest("#typemodule").length && !$(event.target).closest("#selectcustomleads").length
            && !$(event.target).closest("#crmNewFieldFltr").length && !$(event.target).closest("#constantNewFielddrpdwn").length) {
            $(".zdPopover").slideUp("fast");
            $('div').remove('.zdPopover');
        }
        if (event.target.className == "moduletype" || event.target.className == "everymodule") {
            document.getElementById("syncmodule").innerText = event.target.innerText;
            entity = document.getElementById("syncmodule").innerText;
            document.getElementById("emptymodule").style.display = "none";
            await window.apiUtil.GetInitiallistcontact_custommodule(event.target.innerText).then(function () {
                showhide_basedonsynctype();
            })
        }
    });
});
async function createnewlist() {
    var listname = document.getElementById("createlist").value;
    console.log("hfj", listname);
    if (listname != "") {
        document.getElementById("listErr").style.display = "none";
        var findIndexlistname = Totallist.findIndex((list) => (list.name === listname));
        console.log("findIndexlistname", findIndexlistname);
        if (findIndexlistname != -1) {
            duplicatelistname = true;
        }
        if (duplicatelistname == false) {
            document.getElementById("duplicatelist").style.display = "none";
            var dataobj = {
                "listname": listname
            }
            await ZOHO.CRM.CONNECTOR.invokeAPI("constentcontact.constantcontact.create_list", dataobj)
                .then(async function (data) {
                    var createlistdata = JSON.parse(data.response);
                    console.log("list", createlistdata);
                    document.getElementById("createlist").setAttribute("name", createlistdata.list_id);
                }).catch(function (error) {
                    console.log("error", error);
                    window.apiUtil.apiErrormsg(error);
                });
        } else {
            document.getElementById("duplicatelist").style.display = "block";
        }
    } else {
        document.getElementById("listErr").style.display = "block";
    }
}
function checkduplication() {
    duplicatelistname = false;
    var listname = document.getElementById("createlist").value;
    var findIndexlistname = Totallist.findIndex((list) => (list.name === listname));
    console.log("check duplication", duplicatelistname, findIndexlistname, listname, Totallist);
    if (findIndexlistname != -1) {
        duplicatelistname = true;
    }
    if (duplicatelistname == false) {
        document.getElementById("duplicatelist").style.display = "none";
    } else {
        document.getElementById("duplicatelist").style.display = "block";
    }
}
function diffmodule() {
    if (!document.getElementById("moduleoption")) {
        $('div').remove('.zdPopover');
        var settop = document.getElementById("typemodule").offsetTop;
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
            var predefined_view = false;
            var created_view = false;
            var Totalpredefined_view = customview.filter(cview => cview.system_defined == true);
            var Totalusercreated_view = customview.filter(cview => cview.system_defined == false);
            var combinedArray = Totalpredefined_view.concat(Totalusercreated_view);
            console.log(Totalpredefined_view, Totalusercreated_view, combinedArray);
            for (var i = 1; i < combinedArray.length; i++) {
                console.log("combinedArray[i].display_value", combinedArray[i].display_value);
                if (combinedArray[i].system_defined == true) {
                    if (predefined_view == false) {
                        _template += '<li class="type" style="background-color: #ebf0f5;color: #313949;font-family: LatoBold, sans-serif!important;"><span class="LTY">Predefined Views</span></li>';
                        predefined_view = true;
                    }
                } else if (combinedArray[i].system_defined == false) {
                    if (created_view == false) {
                        _template += '<li class="type" style="background-color: #ebf0f5;color: #313949;font-family: LatoBold, sans-serif!important;"><span class="LTY">User Created Views</span></li>';
                        created_view = true;
                    }
                }
                _template += '<li id="' + combinedArray[i].id + '" class="leadstype"><span class="LT" id="' + combinedArray[i].id + '" title="' + combinedArray[i].display_value + '">' + combinedArray[i].display_value + '</span></li>';
            }
            /* for (var i = 1; i < customview.length; i++) {
                 if (customview[i].system_defined == false) {
                     if (predefined_view == false) {
                         _template += '<li class="type"><span class="LTY">Predefined Views</span></li>';
                         predefined_view = true;
                     }
                    } else if (customview[i].system_defined == true) {
                     if (created_view == false) {
                         _template += '<li class="type"><span class="LTY">User Created Views</span></li>';
                         created_view = true;
                     }
                 }
                 _template += '<li id="' + customview[i].id + '" class="leadstype"><span class="LT" id="' + customview[i].id + '" title="' + customview[i].display_value + '">' + customview[i].display_value + '</span></li>';
             } */
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
    var typeofmodule = document.getElementById("syncmodule").innerText;
    if (typeofmodule != "") {
        document.getElementById("moduletype").style.display = "none";
        document.getElementById("syncdiv").style.display = "block";
        document.getElementById("crmCreationBottomBand").style.display = "block";
    } else if (typeofmodule == "") {
        setTimeout(async function () {
            if (document.getElementById("syncmodule").innerText == "") {
                document.getElementById("emptymodule").style.display = "block";
            } else {
                document.getElementById("emptymodule").style.display = "none";
            }
        }, 3000);
        document.getElementById("moduletype").style.display = "block";
        document.getElementById("syncdiv").style.display = "none";
        document.getElementById("crmCreationBottomBand").style.display = "none";
    }
}

function backsyncSelectView() {
    /*  document.getElementById("moduletype").style.display = "block";
     document.getElementById("syncdiv").style.display = "none";
     document.getElementById("crmCreationBottomBand").style.display = "none"; */
    ZOHO.CRM.UI.Popup.close()
        .then(function (data) {
            console.log(data)
        })
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
