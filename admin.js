const BASE_URL = "https://citysudhar-default-rtdb.asia-southeast1.firebasedatabase.app/";
const DB_URL = `${BASE_URL}issues.json`;

function authenticate() {
    const id = prompt("Authority ID:");
    const pass = prompt("Password:");
    if (id === "admin" && pass === "city123") {
        document.getElementById("adminPortalContent").style.display = "block";
        loadAdminData();
    } else {
        alert("Access Denied");
        window.location.href = "index.html";
    }
}

function loadAdminData() {
    const adminList = document.getElementById("adminIssueList");
    if (!adminList) return;

    fetch(DB_URL)
        .then(res => res.json())
        .then(data => {
            const issues = data ? Object.entries(data).map(([id, val]) => ({ ...val, id })).reverse() : [];
            adminList.innerHTML = "";
            
            issues.forEach(issue => {
                const isDeleted = issue.status === "Deleted";
                const div = document.createElement("div");
                div.className = "issue-card";
                div.innerHTML = `
                    <div class="issue-time">${new Date(issue.createdAt).toLocaleString()}</div>
                    <h3>${issue.title} ${isDeleted ? '<span style="color:red; font-weight:800;">[DELETED]</span>' : ''}</h3>
                    <p><b>Reporter:</b> ${issue.userName} | <b>Location:</b> ${issue.location}</p>
                    <p><b>Status:</b> ${issue.status}</p>
                    ${!isDeleted ? `
                    <div style="margin-top: 15px; display: flex; gap: 10px;">
                        <button onclick="updateIssueStatus('${issue.id}', 'In Progress')" style="background:#2563eb; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer;">Set In Progress</button>
                        <button onclick="updateIssueStatus('${issue.id}', 'Resolved')" style="background:#16a34a; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer;">Set Resolved</button>
                        <button onclick="updateIssueStatus('${issue.id}', 'Deleted')" style="background:#dc2626; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer; margin-left:auto;">Delete</button>
                    </div>` : '<p style="color:gray;">Removed from Citizen View</p>'}
                `;
                adminList.appendChild(div);
            });
        });
}

function updateIssueStatus(id, newStatus) {
    fetch(`${BASE_URL}issues/${id}.json`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
    }).then(() => {
        loadAdminData();
    });
}

authenticate();
