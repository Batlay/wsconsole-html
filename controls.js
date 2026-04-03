const TABLE_ROWS = [
  { id: "1", name: "Business 1", status: "Active" },
  { id: "2", name: "Business 2", status: "Waiting" },
  { id: "3", name: "Business 3", status: "Not deployed yet" },
];

function renderTableRows() {
  const tbody = document.getElementById("installations-table-body");
  if (!tbody) return;

  tbody.innerHTML = TABLE_ROWS.map((row) => {
    return `
      <tr>   
        <td>${row.id}</td>
        <td class="col-name">${row.name}</td>
        <td><span>${row.status}</span></td>

        <td class="col-actions">
          <button class="btn btn--table btn--icon btn--contained" type="button">
            <span class="btn__icon mdi mdi-plus" aria-hidden="true"></span>
            <span class="btn__text">Open installation</span>
            <div class="btn__overlay"></div>
          </button>
        </td>
      </tr>`;
  }).join("");
}

renderTableRows();

function getRowInfo(tr) {
  const cells = tr.querySelectorAll("td");

  return {
    id: cells[0]?.textContent,
    name: cells[1]?.textContent,
    status: cells[2]?.textContent,
  };
}

function tableRowActionClick() {
  const tbody = document.getElementById("installations-table-body");
  if (!tbody) return;

  tbody.addEventListener("click", (e) => {
    const actionButton = e.target.closest(
      ".col-actions .btn.btn--table.btn--contained"
    );
    if (!actionButton || !tbody.contains(actionButton)) return;

    const tr = actionButton.closest("tr");
    if (!tr) return;

    console.log("Row info:", getRowInfo(tr));
  });
}


tableRowActionClick();

// Text input + Action Menu
function initControls() {
  const input = document.getElementById("query");
  const btnDisabled = document.getElementById("save-btn-disabled");
  const btnContained = document.getElementById("save-btn-contained");

  if (!input || !btnDisabled || !btnContained) {
    return;
  }

  function syncSaveButtons() {
    const hasValue = input.value.trim().length > 0;
    btnDisabled.hidden = hasValue;
    btnContained.hidden = !hasValue;
  }

  input.addEventListener("input", syncSaveButtons);
  syncSaveButtons();

  btnContained.addEventListener("click", function () {
    console.log(input.value.trim());
    input.value = "";
    syncSaveButtons();
  });
}

initControls();