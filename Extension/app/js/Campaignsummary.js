async function CampaignSummary(data) {
    console.log("campaignmoduledata", data.EntityId);
    await ZOHO.CRM.API.getRecord({ Entity: "Campaigns", RecordID: data.EntityId })
        .then(async function (campaignrecord) {
            console.log("campaignrecord", campaignrecord);
            var currentTime = zoho.currenttime.toString("YYYY-MM-dd'T'hh:mm:ss.s'Z'", "Universal");
            var dataobj = {
                "before_date": currentTime,
                "after_date": campaignrecord.data[0].constentcontact__Campaign_Created_On
            }
            console.log("dataobj", dataobj);
            await ZOHO.CRM.CONNECTOR.invokeAPI("constentcontact.constantcontact.getcollectionofemailcampaigns", dataobj).
                then(async function (getcampaign) {
                    console.log("getcampaign", getcampaign);
                    var campaigns = JSON.parse(getcampaign.response);
                    external_campaignname = campaigns.name;
                    if (external_campaignname == campaignrecord.data[0].Campaign_Name) {

                    }
                })
            let rootElement = document.getElementById("campaignsummary"), _template;
            _template = '<div class="lyteTableScroll lyteScrollBar"><div class="yield">' +
                '<table style="width: 100%; height: 100%;">' +
                '<tbody>' +
                '<tr>' +
                '<td class="zCampSumDet_Subject" >Subject</td>' +
                '<td data-zcqa="zCampSumDetTable_Subject_Value" class="zCampSumDetTable">' + campaignrecord.data[0].constentcontact__Campaign_Subject + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td data-zcqa="zCampSumDet_Sender Name">Sender Name</td>' +
                '<td data-zcqa="zCampSumDetTable_Sender Name_Value" class="zCampSumDetTable">' + campaignrecord.data[0].constentcontact__CC_Sender_Name + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td data-zcqa="zCampSumDet_Sender Address">Sender Address</td>' +
                '<td data-zcqa="zCampSumDetTable_Sender Address_Value" class="zCampSumDetTable">' + campaignrecord.data[0].constentcontact__Sender_Email_Address + '</td>' +
                '</tr>' +
                '<tr> <td data-zcqa="zCampSumDet_Reply-to Address">Reply-to Address</td>' +
                '<td data-zcqa="zCampSumDetTable_Reply-to Address_Value" class="zCampSumDetTable">' + campaignrecord.data[0].constentcontact__Reply_to_Address + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="vat">List Associated</td><td class="vat" data-zcqa="zCampAssociatedList"> <div>  <span class="vam">' + campaignrecord.data[0].constentcontact__List_Associated + '</span></div></td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</div></div>';
            rootElement.innerHTML += _template;
        })
}