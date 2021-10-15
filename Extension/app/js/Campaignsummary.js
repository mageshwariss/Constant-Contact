var pageloaddata;
var External_campaign_id;
var initial_campaigndetails = false;
var initial_campaignreport = false;
var internal_campaignrecord;
var External_campaignreport;
$(document).ready(function () {
    $(document).on("click", function (event) {
        if (event.target.hash == "#details") {
            if (initial_campaigndetails == false) {
                GetCampaignSummary(pageloaddata);
                // ViewCampaignSummary();
            } else if (initial_campaigndetails == true) {
                ViewCampaignSummary();
            }
        } else if (event.target.hash == "#report") {
            console.log("report");
            if (initial_campaignreport == false) {
                GetCampaignReport();
            } else if (initial_campaignreport == true) {
                ViewCampaignReport();
            }
        }
    })
})
function activetab() {
    document.getElementById('details').setAttribute("class", "tab-pane fade in active");
    document.getElementById('report').setAttribute("class", "tab-pane fade");
    document.getElementById('campaigndetails').setAttribute("class", "active");
    document.getElementById('campaignreport').setAttribute("class", "");
}
async function GetCampaignSummary(data) {
    /* await ZOHO.CRM.API.getUser({ ID: "4493114000000070001" })
        .then(function (data) {
            console.log(data)
        }) */
    initial_campaigndetails = true;
    console.log("campaignmoduledata", data);
    await ZOHO.CRM.API.getRecord({ Entity: "Campaigns", RecordID: data.EntityId })
        .then(async function (campaignrecord) {
            console.log("campaignrecord", campaignrecord);
            internal_campaignrecord = campaignrecord;
            var internal_campaignStatus = campaignrecord.data[0].Status;
            document.getElementById("campaignsummary").style.display = "block";
            activetab();
            document.getElementById("tab-cont").style.display = "block";
            if (internal_campaignStatus != "Planning") {

                console.log("activate report tab");
                $('#views li > a[data_id=reportid]').parent().removeClass('active').css('display', 'inline-block');
                // activetab();
                // var currentTime = new Date();
                //console.log(currentTime.toString("YYYY-MM-dd'T'hh:mm:ss.s'Z'", "Universal"));
                var internal_Campaigncreatedon = campaignrecord.data[0].constentcontact__Campaign_Created_On.substring(0, 19) + ".000Z";
                var internal_Campaignupdatedon = campaignrecord.data[0].constentcontact__Campaign_Updated_On.substring(0, 19) + ".000Z";
                console.log("internal_Campaigncreatedon", internal_Campaigncreatedon, internal_Campaignupdatedon)
                var dataobj = {
                    "before_date": internal_Campaignupdatedon,
                    "after_date": internal_Campaigncreatedon
                }
                console.log("dataobj", dataobj);
                await ZOHO.CRM.CONNECTOR.invokeAPI("constentcontact.constantcontact.getcollectionofemailcampaigns", dataobj).
                    then(async function (getcampaign) {
                        if (getcampaign.status_code == 200) {
                            console.log("getcampaign", getcampaign);
                            //removestr = getcampaign.response.replace(/\\/g, '');
                            convertjson = JSON.parse(getcampaign.response);
                            console.log("campaigns", convertjson.campaigns[0].campaign_id);
                            external_campaignname = convertjson.campaigns[0].name;
                            if (external_campaignname == campaignrecord.data[0].Campaign_Name) {
                                External_campaign_id = convertjson.campaigns[0].campaign_id;
                            }
                        }
                    })
            } else if (internal_campaignStatus == "Planning") {
                $('#views li > a[data_id=reportid]').parent().removeClass('active').css('display', 'none');
            }
            ViewCampaignSummary();
        })
}
function ViewCampaignSummary() {
    const campaigncreatedat = new Date(internal_campaignrecord.data[0].constentcontact__Campaign_Created_On).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
                                console.log("convertedtime", campaigncreatedat);
    document.getElementById("viewdetails").innerHTML = "";
    let rootElement = document.getElementById("viewdetails"), _template;
    _template = '<div class="lyteTableScroll lyteScrollBar"><div class="yield">' +
        '<table style="width: 100%; height: 100%;">' +
        '<tbody>' +
        '<tr>' +
        '<td class="zCampSumDet_Subject" >Subject</td>' +
        '<td data-zcqa="zCampSumDetTable_Subject_Value" class="zCampSumDetTable">' + internal_campaignrecord.data[0].constentcontact__Campaign_Subject + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td data-zcqa="zCampSumDet_Sender Name">Sender Name</td>' +
        '<td data-zcqa="zCampSumDetTable_Sender Name_Value" class="zCampSumDetTable">' + internal_campaignrecord.data[0].constentcontact__CC_Sender_Name + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td data-zcqa="zCampSumDet_Sender Address">Sender Address</td>' +
        '<td data-zcqa="zCampSumDetTable_Sender Address_Value" class="zCampSumDetTable">' + internal_campaignrecord.data[0].constentcontact__Sender_Email_Address + '</td>' +
        '</tr>' +
        '<tr> <td data-zcqa="zCampSumDet_Reply-to Address">Reply-to Address</td>' +
        '<td data-zcqa="zCampSumDetTable_Reply-to Address_Value" class="zCampSumDetTable">' + internal_campaignrecord.data[0].constentcontact__Reply_to_Address + '</td>' +
        '</tr>' +
        '<tr> <td data-zcqa="zCampSumDet_Reply-to Address">Created On</td>' +
        '<td data-zcqa="zCampSumDetTable_Reply-to Address_Value" class="zCampSumDetTable">' + campaigncreatedat + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td class="vat">List Associated</td><td class="vat" data-zcqa="zCampAssociatedList"> <div>  <span class="vam">' + internal_campaignrecord.data[0].constentcontact__List_Associated + '</span></div></td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div></div>';
    rootElement.innerHTML += _template;
}
function GetCampaignReport() {
    initial_campaignreport = true;
    var dataobj = {};
    ZOHO.CRM.CONNECTOR.invokeAPI("constentcontact.constantcontact.bulkemailcampaignssummaryreport", dataobj).then(async function (Allcampaignsummary) {
        console.log("Allcampaignsummary", Allcampaignsummary);
        if (Allcampaignsummary.status_code == 200) {
            //removestr = Allcampaignsummary.response.replace(/\\/g, '');
            convertjson = JSON.parse(Allcampaignsummary.response);
            console.log("campaigns", convertjson.bulk_email_campaign_summaries[0].campaign_id);
            for (var i = 0; i < convertjson.bulk_email_campaign_summaries.length; i++) {
                if (convertjson.bulk_email_campaign_summaries[i].campaign_id == External_campaign_id) {
                    External_campaignreport = convertjson.bulk_email_campaign_summaries[i].unique_counts;
                }
            }
        }
        ViewCampaignReport();
    })
}
function ViewCampaignReport() {
    console.log("External_campaignreport", External_campaignreport);
    document.getElementById("trackingreport").innerHTML = "";
    let rootElement = document.getElementById("trackingreport"), _template;
    _template = '<div class="email-performance-metric row">' +
        '<div class="col"><div class="metric" data-qe-id="email-performance-opened">' +
        '<div class="metric-term" data-qe-id="email-performance-opened-term">Opens</div>' +
        '<div class="metric-figure" data-qe-id="email-performance-opened-figure">' + External_campaignreport.opens + '</div></div>' +
        '<div class="metric" data-qe-id="email-performance-sent"><div class="metric-term" data-qe-id="email-performance-sent-term">Sent</div><div class="metric-figure" data-qe-id="email-performance-sent-figure">' + External_campaignreport.sends + '</div></div>' +
        '<div class="metric" data-qe-id="email-performance-bounced"><div class="metric-term" data-qe-id="email-performance-bounced-term">Bounces</div><div class="metric-figure" data-qe-id="email-performance-bounced-figure">' + External_campaignreport.bounces + '</div></div>' +
        '<div class="metric" data-qe-id="email-performance-forward"><div class="metric-term" data-qe-id="email-performance-forward-term">Forwards</div><div class="metric-figure" data-qe-id="email-performance-forward-figure">' + External_campaignreport.forwards + '</div></div>' +
        '</div>' +
        '<div class="col"><div class="metric" data-qe-id="email-performance-clicked">' +
        '<div class="metric-term" data-qe-id="email-performance-clicked-term">Clicks</div>' +
        '<div class="metric-figure" data-qe-id="email-performance-clicked-figure">' + External_campaignreport.clicks + '</div></div>' +
        '<div class="metric" data-qe-id="email-performance-unopened"><div class="metric-term" data-qe-id="email-performance-unopened-term">Did Not Open</div><div class="metric-figure" data-qe-id="email-performance-unopened-figure">' + External_campaignreport.not_opened + '</div></div>' +
        '<div class="metric" data-qe-id="email-performance-unsubscribed"><div class="metric-term" data-qe-id="email-performance-unsubscribed-term">Unsubscribed</div><div class="metric-figure" data-qe-id="email-performance-unsubscribed-figure">' + External_campaignreport.optouts + '</div></div>' +
        '<div class="metric" data-qe-id="email-performance-spam-reports"><div class="metric-term" data-qe-id="email-performance-spam-reports-term">Spam Reports</div><div class="metric-figure" data-qe-id="email-performance-spam-reports-figure">' + External_campaignreport.abuse + '</div></div>' +
        '</div></div>';
    rootElement.innerHTML += _template;
}