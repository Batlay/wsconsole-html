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

const INSTALLATION_ROWS = [
  { id: "1", name: "Business 1", status: "Active" },
  { id: "2", name: "Business 2", status: "Waiting" },
  { id: "3", name: "Business 3", status: "Not deployed yet" },
];

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderInstallationTableBody() {
  const tbody = document.getElementById("installations-table-body");
  if (!tbody) return;

  tbody.innerHTML = INSTALLATION_ROWS.map((row, index) => {
    const checkboxId = `row-select-${index + 1}`;
    return `
      <tr>
        <td class="col-select">
          <label class="checkbox-mdi">
            <input class="sr-only row-checkbox" type="checkbox" id="${checkboxId}" />
            <span class="checkbox-mdi__icon mdi mdi-checkbox-blank-outline" aria-hidden="true"></span>
            <span class="checkbox-mdi__icon mdi mdi-checkbox-marked checkbox-mdi__icon--checked" aria-hidden="true"></span>
          </label>
        </td>
        <td>${escapeHtml(row.id)}</td>
        <td class="col-name">${escapeHtml(row.name)}</td>
        <td><span>${escapeHtml(row.status)}</span></td>
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


function initTableRowSelection() {
  const tbody = document.querySelector(".table tbody");
  const selectAll = document.getElementById("select-all");
  
  if (!tbody) return;

  const rowCheckboxes = () =>
    Array.from(tbody.querySelectorAll(".row-checkbox"));

  function syncRowCheckbox(checkbox) {
    const tr = checkbox.closest("tr");
    if (!tr) return;
    tr.classList.toggle("is-selected", checkbox.checked);
  }

  function syncSelectAllState() {
    const boxes = rowCheckboxes();
    if (!selectAll || boxes.length === 0) return;
    const checked = boxes.filter((b) => b.checked).length;
    selectAll.checked = checked === boxes.length;
    selectAll.indeterminate = checked > 0 && checked < boxes.length;
  }

  rowCheckboxes().forEach((cb) => {
    cb.addEventListener("change", () => {
      syncRowCheckbox(cb);
      syncSelectAllState();
    });
  });

  if (selectAll) {
    let pendingClearPartial = false;
    const selectAllLabel = selectAll.closest("label");
    const markPartialClick = () => {
      pendingClearPartial = selectAll.indeterminate;
    };
    selectAll.addEventListener("pointerdown", markPartialClick, true);
    selectAllLabel?.addEventListener("pointerdown", markPartialClick, true);
  
    selectAll.addEventListener("change", () => {
      if (pendingClearPartial) {
        pendingClearPartial = false;
        selectAll.checked = false;
        selectAll.indeterminate = false;
        rowCheckboxes().forEach((cb) => {
          cb.checked = false;
          syncRowCheckbox(cb);
        });
        return;
      }
      rowCheckboxes().forEach((cb) => {
        cb.checked = selectAll.checked;
        syncRowCheckbox(cb);
      });
      selectAll.indeterminate = false;
    });
  }
}

function getRowPayloadFromTr(tr) {
  const cells = tr.querySelectorAll("td");
  return {
    id: cells[1]?.textContent?.trim(),
    name: tr.querySelector(".col-name")?.textContent?.trim(),
    status: cells[3]?.querySelector("span")?.textContent?.trim(),
  };
}

function getSelectedRowsPayload() {
  return Array.from(
    document.querySelectorAll(".table tbody tr.is-selected")
  ).map((tr) => getRowPayloadFromTr(tr));
}

function initOpenInstallationRowButtons() {
  const tbody = document.getElementById("installations-table-body");
  if (!tbody) return;

  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest(
      ".col-actions .btn.btn--table.btn--contained"
    );
    if (!btn || !tbody.contains(btn)) return;

    const tr = btn.closest("tr");
    if (!tr) return;

    console.log("Open installation — row:", getRowPayloadFromTr(tr));
  });
}

function initInstallationButton() {
  const btn = document.getElementById("btn-installation");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const rows = getSelectedRowsPayload();
    console.log("Selected rows:", rows);
  });
}

renderInstallationTableBody();
initTableRowSelection();
initOpenInstallationRowButtons();
initInstallationButton();