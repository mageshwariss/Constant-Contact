var entity;
var moduledata = [];
var contactlist = [];
Totallist = [];
custommodulelist = [];
Thirdpartycustomfield = [];
var entityName;
// PageLoad listener that returns the entity details of the active page
ZOHO.embeddedApp.on("PageLoad", async function (data) {
  console.log("loaddata", data);
  entity = data.Entity;
  // Get the record details of the entity using the value returned by PageLoad listener
  /* if (entity == "constentcontact__list") {
     document.getElementById("moduletype").style.display = "block";
  } else  */if (entity == "Leads" || entity == "Contacts") {
    if (entity == "Leads") {
      document.getElementById("allLeads").style.display = "inline-block";
      document.getElementById("leadlabel").style.display = "inline-block";
    } else if (entity == "Contacts") {
      document.getElementById("allContacts").style.display = "inline-block";
      document.getElementById("contactlabel").style.display = "inline-block";
    }
    document.getElementById("syncdiv").style.display = "block";
    document.getElementById("crmCreationBottomBand").style.display = "block";
    window.apiUtil.GetInitiallistcontact_custommodule(entity);
  }
})
ZOHO.embeddedApp.init();
async function Configrelateddata(i, recordid) {
  relateddata = [];
  if (contactlist[i].list_members.length) {
    for (var k = 0; k < contactlist[i].list_members.length; k++) {
      await ZOHO.CRM.API.searchRecord({ Entity: "constentcontact__list", Type: "criteria", Query: "(Name:equals:" + contactlist[i].list_members[k].listname + ")" })
        .then(function (matcheddata) {
          if (matcheddata.statusText != "nocontent") {
            console.log(matcheddata.data[0].id);
            let my_object = {};
            my_object.Associate_List = matcheddata.data[0].id;
            my_object.Associate_Leads = recordid;
            relateddata.push(my_object);
          }
        })
    }
  }
  return relateddata;
}




