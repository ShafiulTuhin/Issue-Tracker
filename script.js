// Login
const loginBtn = document.getElementById("login-btn");
loginBtn &&
  loginBtn.addEventListener("click", () => {
    console.log("clicked");
    const inputName = document.getElementById("input-username");
    const nameValue = inputName.value;
    const inputPassword = document.getElementById("input-password");
    const passwordValue = inputPassword.value;
    console.log(nameValue, passwordValue);

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
  <div onclick="displayModal('${issue.id}')" class="bg-white p-4 space-y-4 rounded-lg ${borderTop}">
          <div class="flex justify-between items-center">
            <img src="${priorityImage}" alt="" />
            <h2 class="px-4 ${priorityColor} ">${issue.priority ? issue.priority : "Not defined"}</h2>
          </div>
          <h2 class="text-[#1F2937] font-semibold">
         ${issue.title ? issue.title : "Not defined"}
          </h2>
          <p class="text-[#64748B] line-clamp-2">
            ${issue.description}
          </p>
          <div class="flex gap-4 shadow-sm pb-8">
            <div
              class="flex gap-1 items-center bg-red-100 px-4 py-1 rounded-full"
            >
              <img src="assets/bug.png" class="w-3 h-4" alt="" />
              <p class="text-red-400">BUG</p>
            </div>
            <div
              class="flex gap-1 items-center bg-amber-200 px-4 py-1 rounded-full"
            >
              <img src="assets/Help.png" class="w-3 h-4" alt="" />
              <p class="text-amber-500">HELP WANTED</p>
            </div>
          </div>
          <div class="text-[#64748B]">
            <p>#1 by ${issue.author}</p>
            <p>${issue.createdAt}</p>
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

const displayModal = async (id) => {
  manageSpinner(true);
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data.data);

  getIssueDetails(data.data);
  modal.showModal();
  manageSpinner(false);
};

const getIssueDetails = (issue) => {
  const statusColor = issue.status === "open" ? "bg-green-600" : "bg-red-600";
  const priorityBg =
    issue.priority === "high"
      ? "bg-red-300 text-red-600"
      : issue.priority === "medium"
        ? "bg-amber-100 text-amber-400"
        : "bg-purple-200 text-purple-600";

  const modalDetails = document.getElementById("modal-details");

  modalDetails.innerHTML = `
   <h2 class="font-bold text-2xl text-[#1F2937] mb-4">
              ${issue.title}
            </h2>
            <div class="flex gap-4 my-6">
              <p class="${statusColor} py-2 text-white font-medium rounded-full px-5">
                ${issue.status === "open" ? "Opened" : "Closed"}
              </p>
              <p class="text-[#64748B]">Opened by ${issue.assignee}</p>
              <p class="text-[#64748B]">${issue.createdAt}</p>
            </div>
            <div class="flex gap-4 shadow-sm pb-8">
              <div
                class="flex gap-1 items-center bg-red-100 px-4 py-1 rounded-full"
              >
                <img src="assets/bug.png" class="w-3 h-4" alt="" />
                <p class="text-red-400 text-[12px]">BUG</p>
              </div>
              <div
                class="flex gap-1 items-center bg-amber-200 px-4 py-1 rounded-full"
              >
                <img src="assets/Help.png" class="w-3 h-4" alt="" />
                <p class="text-amber-500 text-[12px]">HELP WANTED</p>
              </div>
            </div>
            <p class="text-[#64748B] mb-7">
             ${issue.description}
            </p>
            <div class="flex justify-between items-center">
              <div>
                <p class="text-[#64748B]">Assignee:</p>
                <p class="text-[#1F2937] font-bold">${issue.assignee ? issue.assignee : "Not Mentioned"}</p>
              </div>
              <div class="">
                <p class="text-[#64748B]">Priority:</p>
                <p class="${priorityBg}  px-3 rounded-full">${issue.priority}</p>
              </div>
            </div>

`;
};

// Filtering search
const searchBtn = document.getElementById("search-button");
searchBtn &&
  searchBtn.addEventListener("click", async () => {
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
      document.getElementById("issue-container").innerHTML =
        ` <div class="text-center py-20 bg-slate-200 col-span-full">
              <h2 class="text-2xl">Please search by any issue name</h2>
            </div>`;
    }
    manageSpinner(false);
  });

loadAllIssues();
