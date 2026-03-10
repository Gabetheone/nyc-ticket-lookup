async function searchTickets(){

        const plate = document.getElementById("plate").value.toUpperCase().trim();
        const state = document.getElementById("state").value;

    if(!plate){
        alert("Enter a license plate.");
        return;
    }

    const response = await fetch(`/tickets?plate=${plate}&state=${state}`);

    let tickets = await response.json();

    /* remove very old tickets */

    const currentYear = new Date().getFullYear();

    tickets = tickets.filter(ticket => {

        if(!ticket.issue_date) return false;

        const year = new Date(ticket.issue_date).getFullYear();

        return year >= currentYear - 5;

    });

    /* remove duplicate tickets */

    tickets = tickets.filter(
        (ticket,index,self)=>
            index === self.findIndex(t=>t.summons_number===ticket.summons_number)
    );

    /* sort newest first */

    tickets.sort((a,b)=>{
        return new Date(b.issue_date) - new Date(a.issue_date);
    });

    /* NYC fine estimates

    const fines = {
        14:115,
        21:65,
        38:50,
        40:115,
        46:115,
        50:115,
        71:65
    };

    let total = 0;*/

    let html = `
<table>
<tr>
<th>Ticket</th>
<th>Date</th>
<th>Violation</th>
<th>Location</th>
</tr>
`;

    /* build table */

    tickets.forEach(ticket => {

        if(!ticket.summons_number || !ticket.issue_date){
            return;
        }

        /* estimate fine

        let fine = fines[ticket.violation_code] || 115;

        /* school zone speed cameras

        if(ticket.violation_description && ticket.violation_description.includes("SCHOOL")){
            fine = 75;
        }

        /* MTA bus camera stop violations

        if(ticket.violation_description && ticket.violation_description.includes("BUS")){
            fine = 50;
        }
        /* penalty after 30 days

        let issueDate = new Date(ticket.issue_date);
        let today = new Date();

        let daysOld = (today - issueDate) / (1000 * 60 * 60 * 24);

        /* add penalty only if no hearing happened

        if(daysOld > 30 && !ticket.hearing_date){
            fine += 25;
        }

        total += fine;*/

        html += `
<tr>
<td>${ticket.summons_number}</td>
<td>${new Date(ticket.issue_date).toLocaleDateString()}</td>
<td>${ticket.violation_description || ticket.violation_code}</td>
<td>${ticket.street_name || "N/A"}</td>
</tr>
`;

    });

    html += `</table>`;

  /*  html += `
</table>
<h3>Total Estimated Balance: $${total}</h3>
`;
*/
    document.getElementById("results").innerHTML = html;

}