document.addEventListener("DOMContentLoaded", () => {
    // 1. Sidebar Toggle
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => sidebar.classList.add('active'));
    }
    if (sidebarCloseBtn && sidebar) {
        sidebarCloseBtn.addEventListener('click', () => sidebar.classList.remove('active'));
    }

    // 2. Process Navbar Avatars 
    document.querySelectorAll('.top-navbar .avatar-circle-lg').forEach(avatar => {
        // Keeping simple placeholder logic for the admin profile only
        if (!avatar.textContent.trim()) {
            avatar.textContent = 'AD';
        }
    });


    // 3. Live Search
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    function filterTable() {
        let filterText = searchInput ? searchInput.value.toLowerCase() : '';
        let filterStatus = statusFilter ? statusFilter.value.toLowerCase() : '';

        let rows = document.querySelectorAll('.table-custom tbody tr');
        rows.forEach(row => {
            let text = row.textContent.toLowerCase();
            let matchesSearch = text.includes(filterText);

            let statusCell = row.querySelector('.badge-status');
            let statusText = statusCell ? statusCell.textContent.toLowerCase() : '';
            let matchesStatus = (filterStatus === '') ? true : statusText.includes(filterStatus);

            row.style.display = (matchesSearch && matchesStatus) ? '' : 'none';
        });
    }

    if (searchInput) searchInput.addEventListener('keyup', filterTable);
    if (statusFilter) statusFilter.addEventListener('change', filterTable);

    // 4. Initialize Plugins
    if (typeof flatpickr !== 'undefined') {
        flatpickr(".date-time-picker", {
            enableTime: true,
            dateFormat: "Y-m-d h:i K",
        });
    }

    // 5. Dynamic Icons 
    const compTypeSelects = document.querySelectorAll('select[name="competition_type"]');
    compTypeSelects.forEach(select => {
        select.addEventListener('change', function () {
            const iconEl = this.parentElement.querySelector('.comp-type-icon i');
            if (iconEl) {
                const val = this.value.toLowerCase();
                if (val.includes('entrepreneurship')) iconEl.className = 'bi bi-briefcase text-secondary';
                else if (val.includes('technology')) iconEl.className = 'bi bi-cpu text-secondary';
                else if (val.includes('education')) iconEl.className = 'bi bi-book text-secondary';
                else if (val.includes('sustainability')) iconEl.className = 'bi bi-tree text-secondary';
                else iconEl.className = 'bi bi-trophy text-muted';
            }
        });
        select.dispatchEvent(new Event('change'));
    });

    // Dynamic Team Members 
    const addMemberBtn = document.getElementById("addMemberBtn");
    const teamMembersContainer = document.getElementById("teamMembersContainer");

    if (addMemberBtn && teamMembersContainer) {
        addMemberBtn.addEventListener("click", () => {
            const row = document.createElement("div");
            row.className = "team-member-row d-flex flex-column flex-md-row gap-3 align-items-md-center bg-white border rounded p-3 mb-3 shadow-sm animate-fade-up";
            row.innerHTML = `
                <div style="flex: 1;">
                    <input type="text" class="form-control bg-light border-0" placeholder="Enter full name">
                </div>
                <div style="flex: 1;">
                    <input type="email" class="form-control bg-light border-0" placeholder="Enter email address">
                </div>
                <div style="width: 100px;">
                    <button type="button" class="btn btn-outline-danger w-100 remove-member-btn" title="Remove Member"><i class="bi bi-trash"></i></button>
                </div>
            `;
            // Insert before the wrapper containing the add button
            teamMembersContainer.insertBefore(row, addMemberBtn.parentElement);
        });

        // Event delegation 
        teamMembersContainer.addEventListener("click", (e) => {
            const btn = e.target.closest(".remove-member-btn");
            if (btn) {
                const row = btn.closest(".team-member-row");
                if (row) row.remove();
            }
        });
    }

    // File Upload
    const fileInputs = document.querySelectorAll(".upload-dropzone input[type=file], .custom-file-upload input[type=file]");
    fileInputs.forEach(input => {
        input.addEventListener("change", function (e) {
            // Case 1: Dropzone Uploads
            const dropzone = this.closest(".upload-dropzone");
            if (dropzone) {
                const titleEl = dropzone.querySelector("h5");
                const iconEl = dropzone.querySelector("i");
                const descEl = dropzone.querySelector("p");

                if (this.files && this.files.length > 0) {
                    if (titleEl) titleEl.textContent = this.files[0].name;
                    if (iconEl) iconEl.className = "bi bi-check-circle-fill fs-3 text-success";
                    if (descEl) descEl.textContent = "File ready for upload";
                    dropzone.classList.add("border-success", "bg-success", "bg-opacity-10");
                } else {
                    if (titleEl) titleEl.textContent = "Click to upload or drag and drop";
                    if (iconEl) iconEl.className = "bi bi-cloud-arrow-up fs-3 text-secondary";
                    if (descEl) descEl.textContent = "SVG, PNG, JPG or GIF (Recommended size: 1200x600px)";
                    dropzone.classList.remove("border-success", "bg-success", "bg-opacity-10");
                }
            }

            // Case 2: Custom File Upload Buttons
            const customWrapper = this.closest(".custom-file-upload");
            if (customWrapper) {
                const placeholder = customWrapper.querySelector(".file-name-placeholder");
                if (placeholder) {
                    if (this.files && this.files.length > 0) {
                        const count = this.files.length;
                        placeholder.textContent = count === 1 ? this.files[0].name : `${count} files selected`;
                        placeholder.classList.remove("text-muted");
                        placeholder.classList.add("text-dark", "fw-medium");
                    } else {
                        placeholder.textContent = "No file chosen";
                        placeholder.classList.add("text-muted");
                        placeholder.classList.remove("text-dark", "fw-medium");
                    }
                }
            }
        });
    });

    // 7. Rich Text Editor Functionality
    const richTextWrappers = document.querySelectorAll('.rich-text-wrapper');
    richTextWrappers.forEach(wrapper => {
        const toolbar = wrapper.querySelector('.rich-text-toolbar');
        const editor = wrapper.querySelector('.rich-text-editor');
        const hiddenInput = wrapper.querySelector('textarea.d-none');

        if (toolbar && editor && hiddenInput) {
            // Handle toolbar buttons
            toolbar.addEventListener('click', (e) => {
                const btn = e.target.closest('button');
                if (!btn) return;

                e.preventDefault();
                const icon = btn.querySelector('i');
                if (!icon) return;

                if (icon.classList.contains('bi-type-bold')) {
                    document.execCommand('bold', false, null);
                } else if (icon.classList.contains('bi-type-italic')) {
                    document.execCommand('italic', false, null);
                } else if (icon.classList.contains('bi-list-ul')) {
                    document.execCommand('insertUnorderedList', false, null);
                } else if (icon.classList.contains('bi-link-45deg')) {
                    const url = prompt('Enter the link URL:');
                    if (url) document.execCommand('createLink', false, url);
                }

                // Keep focus on editor
                editor.focus();
                // Sync after command
                hiddenInput.value = editor.innerHTML;
            });

            // Sync content on typing
            editor.addEventListener('input', () => {
                hiddenInput.value = editor.innerHTML;
            });

            // Handle paste as plain text
            editor.addEventListener('paste', (e) => {
                e.preventDefault();
                const text = e.clipboardData.getData('text/plain');
                document.execCommand('insertHTML', false, text);
            });
        }
    });
});

