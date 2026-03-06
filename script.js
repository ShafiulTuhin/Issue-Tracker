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

//   Get all Issues
let allIssues = [];
const loadAllIssues = async () => {
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
  const res = await fetch(url);
  console.log(res);
  const data = await res.json();
  allIssues = data.data;
  displayIssues(allIssues);
  console.log(allIssues.length);
};

// Render Issues
const displayIssues = (issues) => {
  console.log(issues);
  const issueContainer = document.getElementById("issue-container");
  issueContainer.innerHTML = "";

  issues.forEach((issue) => {
    const borderTop =
      issue.priority === "low"
        ? "border-t-2 border-t-purple-600"
        : "border-t-2 border-t-green-600";
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
    console.log(issue);
    const renderIssue = document.createElement("div");

    renderIssue.innerHTML = `
  <div class="bg-white p-4 space-y-4 rounded-lg ${borderTop}">
          <div class="flex justify-between items-center">
            <img src="${priorityImage}" alt="" />
            <h2 class="px-4 ${priorityColor} ">${issue.priority}</h2>
          </div>
          <h2 class="text-[#1F2937] font-semibold">
         ${issue.title}
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
// Render in all button
const displayAllIssues = () => {
  displayIssues(allIssues);
};
// filter issues for open button
const displayOpenIssues = () => {
  const openIssues = allIssues.filter((issue) => issue.status === "open");
  displayIssues(openIssues);
};
// filter issues for close button
const displayCloseIssues = () => {
  const closedIssues = allIssues.filter((issue) => issue.status === "closed");
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

loadAllIssues();
