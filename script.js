// Login
const loginBtn = document.getElementById("login-btn");
loginBtn &&
  loginBtn.addEventListener("click", () => {
    const inputName = document.getElementById("input-username");
    const nameValue = inputName.value;
    const inputPassword = document.getElementById("input-password");
    const passwordValue = inputPassword.value;

    if (nameValue !== "admin" || passwordValue !== "admin123") {
      alert("Invalid username or password");
      return;
    } else {
      window.location.assign("home.html");
    }
  });
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
//   Get all Issues
let allIssues = [];
const loadAllIssues = async () => {
  manageSpinner(true);
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
  const res = await fetch(url);
  const data = await res.json();
  allIssues = data.data;
  displayAllIssues(allIssues);
  countAllIssues();
  manageSpinner(false);
};

// Render Issues
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
// render function
const displayIssues = (issues) => {
  const issueContainer = document.getElementById("issue-container");
  issueContainer.innerHTML = "";

  issues.forEach((issue) => {
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
  <div onclick="getIssueDetails('${issue.id}')" class="bg-white p-4 space-y-4 rounded-lg h-[300px] ${borderTop}">
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
          <div class="text-[#64748B]">
            <p>#1 by ${issue.author}</p>
            <p>${issue.createdAt ? new Date(issue.createdAt).toLocaleDateString("en-US") : "No date"}</p>
          </div>
        </div>
    `;
    issueContainer.appendChild(renderIssue);
  });
};
// Add active
const addActive = (id) => {
  const activebtn = document.getElementById(id);
  activebtn.classList.add("btn", "btn-primary");
};
// Remove active
const removeActive = () => {
  const allBtn = document.querySelectorAll(".remove-active");
  allBtn.forEach((btn) => btn.classList.remove("btn", "btn-primary"));
};
// Render in all button
const displayAllIssues = () => {
  removeActive();
  addActive("button-all");
  displayIssues(allIssues);
};
// filter issues for open button
const displayOpenIssues = () => {
  const openIssues = allIssues.filter((issue) => issue.status === "open");
  removeActive();
  addActive("button-open");
  displayIssues(openIssues);
};
// filter issues for close button
const displayCloseIssues = () => {
  removeActive();
  const closedIssues = allIssues.filter((issue) => issue.status === "closed");
  addActive("button-close");
  displayIssues(closedIssues);
};
// Update count
const countAllIssues = () => {
  document.getElementById("issue-counter").textContent = allIssues.length;
};
const countOpenIssues = () => {
  const openCount = allIssues.filter((issue) => issue.status === "open").length;
  document.getElementById("issue-counter").textContent = openCount;
};
const countClosedIssues = () => {
  const closeCount = allIssues.filter(
    (issue) => issue.status === "closed",
  ).length;
  document.getElementById("issue-counter").textContent = closeCount;
};

//issue details modal
const modal = document.getElementById("issue-details-modal");
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
            <div class="flex justify-between items-center my-6 gap-2">
               <p class=" ${statusColor} px-3 text-center rounded-full text-white font-medium">
                ${issue.status === "open" ? "Opened" : issue.status === "closed" ? "Closed" : "No Status"}
            </p>   
            <span class="text-[#64748B] text-2xl">•</span>       
            <p class="text-[#64748B] ">Opened by: ${issue.assignee ? issue.assignee : "Not Mentioned"} </p>    
            <span class="text-[#64748B] text-2xl">•</span>
            <p class="text-[#64748B]">${issue.updatedAt ? new Date(issue.updatedAt).toLocaleDateString("en-US") : "Date is not issued"}</p>
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
                <p class="text-[#1F2937] font-bold">${issue.assignee ? issue.assignee : "Not Mentioned"}</p>
              </div>
              <div class="">
                <p class="text-[#64748B] mb-1 md:ml-2 ml-1">Priority:</p>
                <p class="${priorityBg}  px-3 rounded-full">${issue.priority}</p>
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
    displayIssues(searchCount);
    document.getElementById("issue-counter").textContent = searchCount.length;
    if (searchText !== "") {
      displayIssues(data.data);
    } else {
      displayAllIssues();
      document.getElementById("issue-counter").textContent = allIssues.length;
    }

    manageSpinner(false);
  });

loadAllIssues();
