// Login
const loginBtn = document.getElementById("login-btn");
loginBtn &&
  loginBtn.addEventListener("click", () => {
    const userName = document.getElementById("input-username").value;
    const userPassword = document.getElementById("input-password").value;

    if (userName !== "admin" || userPassword !== "admin123") {
      alert("Invalid username or password");
      return;
    } else {
      window.location.assign("home.html");
    }
  });
// Common functions
// Manage Spinner
const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("issue-container").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("issue-container").classList.remove("hidden");
  }
};
// Active button
const addActive = (id) => {
  const activeBtn = document.getElementById(id);
  activeBtn.classList.add("btn", "btn-primary");
};
addActive("button-all");
// Remove Button
const removeActive = () => {
  const removeBtn = document.querySelectorAll(".remove-active");
  removeBtn.forEach((btn) => btn.classList.remove("btn", "btn-primary"));
};
//all issues are here
let allIssues = [];
// counter for issue count for all status
const issueCount = document.getElementById("issue-counter");
// Get all issues from API
const loadAllIssues = async () => {
  manageSpinner(true);
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
  const res = await fetch(url);
  const data = await res.json();
  allIssues = data.data;

  displayAllIssues(allIssues);
  manageSpinner(false);
  issueCount.innerText = allIssues.length;
};
// Rendering Issues
// mapping labels of issue
const getLabels = (arr) => {
  return arr && arr.length > 0
    ? arr
        .map((level) => {
          let bgClass, textClass, icon, label;

          if (level === "bug") {
            bgClass = "bg-red-100";
            textClass = "text-red-400";
            icon = "assets/bug.png";
            label = "BUG";
          } else if (level === "help wanted") {
            bgClass = "bg-amber-200";
            textClass = "text-amber-500";
            icon = "assets/Help.png";
            label = "help wanted";
          } else if (level === "enhancement") {
            bgClass = "bg-green-200";
            textClass = "text-green-600";
            icon = "assets/enhancement.png";
            label = "enhancement";
          } else {
            bgClass = "bg-blue-200";
            textClass = "text-blue-600";
            icon = "assets/good.png";
            label = "good first issue";
          }

          return `
          <div class="flex gap-1 items-center ${bgClass} px-4 py-1 rounded-full">
            <img src="${icon}" class="w-3 h-4" alt="" />
            <p class="${textClass}">${label}</p>
          </div>
          `;
        })
        .join(" ")
    : `<span class="bg-slate-200 px-4 py-2 rounded-lg">No levels found</span>`;
};

// Display all issues
const displayAllIssues = (issues) => {
  const issueContainer = document.getElementById("issue-container");
  issueContainer.innerHTML = "";
  for (let issue of issues) {
    console.log(issue);

    const borderTop =
      issue.status === "closed"
        ? "border-t-3 border-t-purple-600"
        : "border-t-3 border-t-green-600";
    const priorityColor =
      issue.priority === "high"
        ? "bg-red-300 text-red-600"
        : issue.priority === "medium"
          ? "bg-amber-100 text-amber-400"
          : "bg-purple-200 text-purple-600";
    const priorityImage =
      issue.priority === "low"
        ? "assets/Closed-Status.png"
        : "assets/Open-Status.png";

    const renderIssue = document.createElement("div");
    renderIssue.innerHTML = `
  <div onclick="getIssueDetails('${issue.id}')" class="bg-white p-4 space-y-4 rounded-lg h-[350px] ${borderTop}">
          <div class="flex justify-between items-center">
            <img src="${priorityImage}" alt="" />
            <h2 class="px-4 ${priorityColor} ">${issue.priority ? issue.priority : "Not defined"}</h2>
          </div>
          <h2 class="text-[#1F2937] font-semibold line-clamp-1">
         ${issue.title ? issue.title : "Not defined"}
          </h2>
          <p class="text-[#64748B] line-clamp-2">
          ${issue.description ? issue.description : "No description"}
          </p>
          <div class="flex gap-1 shadow-sm pb-8">
          
            ${issue.labels ? getLabels(issue.labels) : "No labels"}
          </div>
          
          <div class="text-[#64748B] flex justify-between items-center">
            <p>#${issue.id} by ${issue.author ? issue.author : "Author name not found"}</p>
            <p>${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString("en-US") : "No date"}</p>
          </div>
            <div class="text-[#64748B] flex justify-between items-center">
            <p>#${issue.id} by ${issue.assignee ? issue.assignee : "Not assigned"}</p>
            <p>Updated: ${issue.updatedAt ? new Date(issue.updatedAt).toLocaleDateString("en-US") : "No date"}</p>
          </div>
        </div>
    `;
    issueContainer.appendChild(renderIssue);
  }
};
// calling all issues
const allBtn = document.getElementById("button-all");
allBtn.addEventListener("click", () => {
  displayAllIssues(allIssues);
  issueCount.innerText = allIssues.length;
  removeActive();
  addActive("button-all");
});
// Display open issues
const displayOpenIssues = () => {
  const filterOpen = allIssues.filter((issue) => issue.status === "open");
  displayAllIssues(filterOpen);
  issueCount.innerText = filterOpen.length;
  removeActive();
  addActive("button-open");
};
// Display close issues
const displayCloseIssues = () => {
  const filterClose = allIssues.filter((issue) => issue.status === "closed");
  displayAllIssues(filterClose);
  issueCount.innerText = filterClose.length;
  removeActive();
  addActive("button-close");
};
// Render details of issue in modal window
//issue details modal
const modal = document.getElementById("issue-details-modal");
// loading data for single issue
const getIssueDetails = async (id) => {
  manageSpinner(true);
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
  const res = await fetch(url);
  const data = await res.json();

  displayModal(data.data);
  modal.showModal();
  manageSpinner(false);
};

// Render details of issue in modal window
const displayModal = (issue) => {
  const statusColor =
    issue.status === "open"
      ? "bg-green-600"
      : issue.status === "closed"
        ? "bg-red-600"
        : "bg-gray-400";
  const priorityBg =
    issue.priority === "high"
      ? "bg-red-300 text-red-600"
      : issue.priority === "medium"
        ? "bg-amber-100 text-amber-400"
        : "bg-purple-200 text-purple-600";

  const modalDetails = document.getElementById("modal-details");

  modalDetails.innerHTML = `
   <h2 class="font-bold text-2xl text-[#1F2937] mb-4 ">
              ${issue.title ? issue.title : "No title"}
            </h2>
            <div class="flex justify-between items-center my-6">
               <p class=" ${statusColor} px-3 text-center rounded-full text-white font-medium">
                ${issue.status === "open" ? "Opened" : issue.status === "closed" ? "Closed" : "No Status"}
            </p>   
            <span class="text-[#64748B] text-2xl">•</span>       
            <p class="text-[#64748B]">Opened by: <span class="font-bold">${issue.author ? issue.author : "Author name not found"}</span> </p>    
            <span class="text-[#64748B] text-2xl">•</span>
            <p class="text-[#64748B]">${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString("en-US") : "Date is not issued"}</p>
            </div>

            <div class="flex gap-4 pb-8">
             ${issue.labels ? getLabels(issue.labels) : "No labels"}
            </div>
            <p class="text-[#64748B] mb-7">
             ${issue.description}
            </p>
            <div class="flex gap-[100px] items-center">
              <div>
                <p class="text-[#64748B] mb-1">Assignee:</p>
                <p class="text-[#1F2937] font-bold">${issue.assignee ? issue.assignee : "Not assigned"}</p>
              </div>
              <div class="">
                <p class="text-[#64748B] mb-1 md:ml-2 ml-1">Priority:</p>
                <p class="${priorityBg}  px-3 rounded-full">${issue.priority ? issue.priority : "No priority"}</p>
              </div>
            </div>
`;
};
// Filtering search
const searchInput = document.getElementById("input-search");
searchInput &&
  searchInput.addEventListener("input", async () => {
    removeActive();
    const searchText = document.getElementById("input-search").value.trim();
    manageSpinner(true);
    const url = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`;
    const res = await fetch(url);
    const data = await res.json();

    // Count search result
    const searchCount = data.data;

    if (searchText !== "") {
      displayAllIssues(searchCount);
      issueCount.textContent = searchCount.length;
    } else {
      displayAllIssues(allIssues);
      issueCount.textContent = allIssues.length;
    }

    manageSpinner(false);
  });

loadAllIssues();
