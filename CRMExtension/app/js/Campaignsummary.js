var pageloaddata;
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
    var dataobj = {
        "campaign_id": internal_campaignrecord.data[0].constentcontact__Campaign_ID
    };
    ZOHO.CRM.CONNECTOR.invokeAPI("constentcontact.constantcontact.getanemailcampaignstatsreport", dataobj).then(async function (Allcampaignsummary) {
        console.log("Allcampaignsummary", Allcampaignsummary);
        if (Allcampaignsummary.status_code == 200) {
            convertjson = JSON.parse(Allcampaignsummary.response);
            console.log(convertjson.results);
            External_campaignreport = convertjson.results;
        }
        ViewCampaignReport();
    }).catch(function (error) {
        console.log("error", error);
        document.getElementById("trackingreport").innerHTML = "";
        let rootElement = document.getElementById("trackingreport"), _template;
        _template = '<div style="text-align: center;">' + error.message + '</div>';
        rootElement.innerHTML += _template;
    });
}
function ViewCampaignReport() {
    console.log("External_campaignreport", External_campaignreport);
    document.getElementById("trackingreport").innerHTML = "";
    let rootElement = document.getElementById("trackingreport"), _template;
    _template = '<div class="clearfix">' +
        '<div class="box">' +
        '<div class="box-header">' +
        '<div class="card-header-heading"><span class="truncate" title="Sent"><span>Sent</span><span></span></span></div>' +
        '</div>' +
        '<div class="metric-card-body"><div class="metric-box"><span class="metric-box-figure" data-qe-id="email-performance-sent-card-metric-box-figure"><span class="metric-box-figure-text">' + External_campaignreport[0].stats.em_sends + '</span></span></div></div>' +
        '</div>' +
        '<div class="box">' +
        '<div class="box-header">' +
        '<div class="card-header-heading"><span class="truncate" title="Open Rate"><span>Open Rate</span><span></span></span></div>' +
        '</div>' +
        '<div class="metric-card-body"><div class="metric-box"><span class="metric-box-figure" data-qe-id="email-performance-Open-card-metric-box-figure"><span class="metric-box-figure-text">' + External_campaignreport[0].percents.open + "%" + '</span></span></div></div>' +
        '</div>' +
        '<div class="box">' +
        '<div class="box-header">' +
        '<div class="card-header-heading"><span class="truncate" title="Click Rate"><span>Click Rate</span><span></span></span></div>' +
        '</div>' +
        '<div class="metric-card-body"><div class="metric-box"><span class="metric-box-figure" data-qe-id="email-performance-click-card-metric-box-figure"><span class="metric-box-figure-text">' + External_campaignreport[0].percents.click + "%" + '</span></span></div></div>' +
        '</div></div>' +
        '<div class="email-performance-metric row">' +
        '<div class="col"><div class="metric" data-qe-id="email-performance-opened">' +
        '<div class="metric-term" data-qe-id="email-performance-opened-term">Opens</div>' +
        '<div class="metric-figure" data-qe-id="email-performance-opened-figure">' + External_campaignreport[0].stats.em_opens + '</div></div>' +
        /* '<div class="metric" data-qe-id="email-performance-sent"><div class="metric-term" data-qe-id="email-performance-sent-term">Sent</div><div class="metric-figure" data-qe-id="email-performance-sent-figure">' + External_campaignreport[0].stats.em_sends + '</div></div>' + */
        '<div class="metric" data-qe-id="email-performance-bounced"><div class="metric-term" data-qe-id="email-performance-bounced-term">Bounces</div><div class="metric-figure" data-qe-id="email-performance-bounced-figure">' + External_campaignreport[0].stats.em_bounces + '</div></div>' +
        '<div class="metric" data-qe-id="email-performance-forward"><div class="metric-term" data-qe-id="email-performance-forward-term">Forwards</div><div class="metric-figure" data-qe-id="email-performance-forward-figure">' + External_campaignreport[0].stats.em_forwards + '</div></div>' +
        '<div class="metric" data-qe-id="email-performance-desktop-open-reports"><div class="metric-term" data-qe-id="email-performance-desktop-open-term">Desktop Open Percentage</div><div class="metric-figure" data-qe-id="email-performance-desktop-open-figure">' + External_campaignreport[0].percents.desktop_open + "%" + '</div></div>' +
        /* '<div class="metric" data-qe-id="email-performance-desktop-click-reports"><div class="metric-term" data-qe-id="email-performance-desktop-click-term">Desktop Click Percentage</div><div class="metric-figure" data-qe-id="email-performance-desktop-click-figure">' + External_campaignreport[0].percents.desktop_click + "%" + '</div></div>' + */
        '</div>' +
        '<div class="col"><div class="metric" data-qe-id="email-performance-clicked">' +
        '<div class="metric-term" data-qe-id="email-performance-clicked-term">Clicks</div>' +
        '<div class="metric-figure" data-qe-id="email-performance-clicked-figure">' + External_campaignreport[0].stats.em_clicks + '</div></div>' +
        '<div class="metric" data-qe-id="email-performance-unopened"><div class="metric-term" data-qe-id="email-performance-unopened-term">Did Not Open</div><div class="metric-figure" data-qe-id="email-performance-unopened-figure">' + External_campaignreport[0].stats.em_not_opened + '</div></div>' +
        '<div class="metric" data-qe-id="email-performance-unsubscribed"><div class="metric-term" data-qe-id="email-performance-unsubscribed-term">Unsubscribed</div><div class="metric-figure" data-qe-id="email-performance-unsubscribed-figure">' + External_campaignreport[0].stats.em_optouts + '</div></div>' +
        /* '<div class="metric" data-qe-id="email-performance-spam-reports"><div class="metric-term" data-qe-id="email-performance-spam-reports-term">Spam Reports</div><div class="metric-figure" data-qe-id="email-performance-spam-reports-figure">' + External_campaignreport.abuse + '</div></div>' + */

        '<div class="metric" data-qe-id="email-performance-mobile-open-reports"><div class="metric-term" data-qe-id="email-performance-mobile-open-term">Mobile Open Percentage</div><div class="metric-figure" data-qe-id="email-performance-mobile-open-figure">' + External_campaignreport[0].percents.mobile_open + "%" + '</div></div>' +

        /* '<div class="metric" data-qe-id="email-performance-mobile-click-reports"><div class="metric-term" data-qe-id="email-performance-mobile-click-term">Mobile Click Percentage</div><div class="metric-figure" data-qe-id="email-performance-mobile-click-figure">' + External_campaignreport[0].percents.mobile_click + "%" + '</div></div>' + */
        '</div></div>';
    rootElement.innerHTML += _template;
}