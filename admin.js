function timeAgo(timestamp) {
    if (!timestamp) return "";
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

const adminIssueList = document.getElementById("adminIssueList");
let issues = JSON.parse(localStorage.getItem("issues")) || [];

function checkAuth() {
    const id = prompt("Enter Admin ID:");
    const pass = prompt("Enter Password:");

    if (id === "admin123" && pass === "12345") {
        renderAdminIssues();
    } else {
        alert("Wrong ID or Password! Returning to home.");
        window.location.href = "index.html";
    }
}

function renderAdminIssues() {
    adminIssueList.innerHTML = "";
    if (issues.length === 0) {
        adminIssueList.innerHTML = "<p style='text-align:center;'>No issues available.</p>";
        return;
    }
    issues.forEach((issue, index) => {
        const div = document.createElement("div");
        div.className = "issue-card";
        let buttons = "";
        if (issue.status === "Pending") {
            buttons = `<button onclick="updateStatus(${index}, 'In Progress')">Start Work</button>`;
        } else if (issue.status === "In Progress") {
            buttons = `<button onclick="updateStatus(${index}, 'Resolved')">Mark Resolved</button>`;
        }

        div.innerHTML = `
            <div class="issue-time">${timeAgo(issue.createdAt)}</div>
            <h3>${issue.title}</h3>
            <p><b>Category:</b> ${issue.category} | <b>Location:</b> ${issue.location}</p>
            <p>${issue.description}</p>
            <p class="status ${issue.status.replace(/\s/g, '')}">Status: ${issue.status}</p>
            ${buttons}`;
        adminIssueList.appendChild(div);
    });
}

function updateStatus(index, newStatus) {
    issues[index].status = newStatus;
    localStorage.setItem("issues", JSON.stringify(issues));
    renderAdminIssues();
}

checkAuth();