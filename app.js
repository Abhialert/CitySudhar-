// Data Initialization
let issues = JSON.parse(localStorage.getItem("issues")) || [];

// 1. Function to display issues on the Main Page (Grid Layout)
function displayIssues() {
    const issueListDiv = document.getElementById("issueList");
    updateSummaryBar(issues);
    
    if(!issueListDiv) return;

    issueListDiv.innerHTML = "";

    if (issues.length === 0) {
        issueListDiv.innerHTML = "<p style='width:100%; text-align:center; padding: 40px; color: #64748b;'>No issues reported yet.</p>";
        return;
    }

    issues.forEach(issue => {
        const div = document.createElement("div");
        div.className = "issue-card";
        div.innerHTML = `
            <div class="issue-time">${new Date(issue.createdAt).toLocaleDateString()}</div>
            <h3 style="margin-top: 0; color: #1e293b;">${issue.title}</h3>
            <p style="font-size: 0.9rem;"><b>Category:</b> ${issue.category}</p>
            <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 15px;">${issue.description}</p>
            <p class="status ${issue.status.replace(/\s/g, '')}">Status: ${issue.status}</p>
        `;
        issueListDiv.appendChild(div);
    });
}

// 2. Function to update the colored summary boxes
function updateSummaryBar(issues) {
    const totalEl = document.getElementById("totalCount");
    const pendingEl = document.getElementById("pendingCount");
    const progressEl = document.getElementById("progressCount");
    const resolvedEl = document.getElementById("resolvedCount");

    if (totalEl) totalEl.textContent = issues.length;
    if (pendingEl) pendingEl.textContent = issues.filter(i => i.status === "Pending").length;
    if (progressEl) progressEl.textContent = issues.filter(i => i.status === "In Progress").length;
    if (resolvedEl) resolvedEl.textContent = issues.filter(i => i.status === "Resolved").length;
}

// 3. Form Submission Logic for report.html
const form = document.getElementById("issueForm");
const formContent = document.getElementById("formContent");
const successMessage = document.getElementById("successMessage");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Create the new report object
        const newIssue = {
            id: Date.now(),
            title: document.getElementById("title").value,
            category: document.getElementById("category").value,
            location: document.getElementById("location").value,
            description: document.getElementById("description").value,
            status: "Pending",
            createdAt: Date.now()
        };

        // Save to Local Storage
        issues.unshift(newIssue);
        localStorage.setItem("issues", JSON.stringify(issues));

        // Show Success UI
        formContent.style.display = "none";
        successMessage.style.display = "block";

        // Auto Redirect after 3 seconds
        setTimeout(() => {
            window.location.href = "index.html";
        }, 3000);
    });
}

// Initialize display on page load
displayIssues();