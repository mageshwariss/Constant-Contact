var entity;
var moduledata = [];
var contactlist = [];
Totallist = [];
custommodulelist = [];
Thirdpartycustomfield = [];
var entityName;
/* ZOHO.embeddedApp.on("PageLoad",function(data)
{
    console.log(data);
})
ZOHO.embeddedApp.init(); */
// PageLoad listener that returns the entity details of the active page
ZOHO.embeddedApp.on("PageLoad", async function (data) {

  // ZOHO.embeddedApp.init().then(async function (data) {
  console.log("loaddata", data);
  //id = data.EntityId[0];
  entity = data.Entity;

  // Get the record details of the entity using the value returned by PageLoad listener
  if (entity == "constentcontact__list") {
    /* ZOHO.CRM.META.getRelatedList({"Entity":"constentcontact__list"}).then(function(getRelatedList){
      console.log("getRelatedList",getRelatedList);	
      });Query:"((Company:equals:Zoho)or(Company:equals:zylker))"
      await ZOHO.CRM.API.searchRecord({ Entity: "ConstantList_Vs_Leads", Type: "criteria", Query: "(Associate_List:equals:4493114000000124367)" })
      .then(async function (response) {

      })
      await ZOHO.CRM.API.getAllRecords({
                Entity: "ConstantList_Vs_Leads"
            }).then(function (custommoduledata) {
              console.log("custommoduledata", custommoduledata);
            })*/

  } else {
    window.apiUtil.GetInitiallistcontact_thirdparty(entity);
  }
})
ZOHO.embeddedApp.init();
async function PushInitiallistto_custommodule() {
  var data = [];
  console.log("thirdparty custom fields", contactlist);
  //const newArray = contactlist.map(contact => contact.custom_fields);
  //console.log("customfields",newArray);
  for (var i = 0; i < Totallist.length; i++) {
    //array1.findIndex(isLargeNumber)
    const listpresentedcontact = contactlist.filter(contact => contact.list_memberships.includes(Totallist[i].list_id));
    console.log("listpresentedcontact", listpresentedcontact, custommodulelist.length);
    if (custommodulelist.length > 0) {
      var newlistindex
      if (listpresentedcontact.length > 0) {
        if (listpresentedcontact[0].custom_fields.length > 0) {
          console.log("thirdpartymappingparameter", listpresentedcontact[0].custom_fields[1].value);
          newlistindex = custommodulelist.findIndex((list) => (list.Name === Totallist[i].name && list.Mapping_Parameter === listpresentedcontact[0].custom_fields[1].value));
          console.log("newlistindex", newlistindex, custommodulelist, Totallist[i].name, listpresentedcontact[0].custom_fields[1].value);
        }
      } else {
        newlistindex = custommodulelist.findIndex((list) => list.Name === Totallist[i].name)
      }
      if (newlistindex == -1) {
        console.log("not found");
        let my_object = {};
        my_object.Name = Totallist[i].name;
        if (listpresentedcontact.length > 0) {
          if (listpresentedcontact[0].custom_fields.length > 0) {
            my_object.Sync_Frequency = listpresentedcontact[0].custom_fields[0].value;
            my_object.Mapping_Parameter = listpresentedcontact[0].custom_fields[1].value;
          }
        }
        data.push(my_object);
      }

    } else {
      console.log("listpresentedcontact syncfreq", listpresentedcontact);
      let my_object = {};
      my_object.Name = Totallist[i].name;
      if (listpresentedcontact.length > 0) {
        my_object.Sync_Frequency = listpresentedcontact[0].custom_fields[0].value;
        my_object.Mapping_Parameter = listpresentedcontact[0].custom_fields[1].value;
      }
      data.push(my_object);
    }
  }
  console.log("pushdata", data);
  if (data.length > 0) {
    await ZOHO.CRM.API.insertRecord({ Entity: "constentcontact__list", APIData: data, Trigger: ["workflow"] }).
      then(async function (response) {
        console.log("inserted main record", response);
        var relateddata = [];
        for (var i = 0; i < contactlist.length; i++) {
          console.log("contactlist each", contactlist[i], moduledata);
          //let each_record = moduledata.filter(obj => obj.Email === contactlist[i].email_address.address);
          if (contactlist[i].custom_fields.length > 0) {
            if (contactlist[i].custom_fields[1].value == "All Leads") {
              if (moduledata.length > 0) {
                window.apiUtil.insertintolinkingmodule(i, moduledata);
              }
            } else {
              await ZOHO.CRM.META.getCustomViews({ "Entity": entity }).then(async function (allcustomview) {
                console.log(allcustomview);
                if (allcustomview.statusText != "nocontent") {
                  customview = allcustomview.custom_views;
                  let each_view = customview.filter(obj => obj.display_value === contactlist[i].custom_fields[1].value);
                  console.log("each_view", each_view);
                  if (each_view.length > 0) {
                    await ZOHO.CRM.API.getAllRecords({ "Entity": entity, "cvid": each_view[0].id }).then(function (specificviewdata) {
                      console.log("customview record", specificviewdata);
                      if (specificviewdata.statusText != "nocontent") {
                        customviewdata = specificviewdata.data;
                        window.apiUtil.insertintolinkingmodule(i, customviewdata);
                      }
                    });
                  }
                }
              });
            }

          } else {
            console.log("not found");
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
        console.log("relateddata", relateddata);
      });
  }
}

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
function Refreshlist() {
  var func_name = "custom_function4";
  var req_data = {
    "arguments": JSON.stringify({
      "mailid": "siprxx.xxx@xxxx.com"
    })
  };
  ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
    .then(function (data) {
      console.log(data)
    })

  ZOHO.CRM.UI.Popup.close()
    .then(function (data) {
      console.log("closedata", data);
    })
}



