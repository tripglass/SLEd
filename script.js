// Lorebook Manager - Main Script

let lorebook = { entries: {} };
let openTabs = [];
let activeTabId = null;
let nextUid = 0;
let sideBySideView = false;
let selectedEntries = [];
let draggedEntries = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
});

// Event Listeners
function initializeEventListeners() {
    document.getElementById('importBtn').addEventListener('click', importLorebook);
    document.getElementById('exportBtn').addEventListener('click', exportLorebook);
    document.getElementById('newEntryBtn').addEventListener('click', createNewEntry);
    document.getElementById('newEntryBtnAlt').addEventListener('click', createNewEntry);
    document.getElementById('searchEntries').addEventListener('input', handleSearch);
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    document.getElementById('viewToggle').addEventListener('click', toggleView);
    document.getElementById('clearSelection').addEventListener('click', clearSelection);
}

// Import Lorebook
function importLorebook() {
    document.getElementById('fileInput').click();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            lorebook = data;
            
            // Find highest UID to set nextUid
            nextUid = 0;
            Object.values(lorebook.entries).forEach(entry => {
                if (entry.uid >= nextUid) {
                    nextUid = entry.uid + 1;
                }
            });
            
            renderEntryList();
            showNotification('Lorebook imported successfully!', 'success');
        } catch (error) {
            showNotification('Error importing lorebook: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Export Lorebook
function exportLorebook() {
    const dataStr = JSON.stringify(lorebook, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lorebook.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Lorebook exported successfully!', 'success');
}

// Create New Entry
function createNewEntry() {
    const uid = nextUid++;
    const newEntry = {
        uid: uid,
        key: [],
        keysecondary: [],
        comment: "New Entry",
        content: "",
        constant: false,
        vectorized: false,
        selective: true,
        selectiveLogic: 0,
        addMemo: true,
        order: uid,
        position: 0,
        disable: false,
        ignoreBudget: false,
        excludeRecursion: true,
        preventRecursion: true,
        matchPersonaDescription: false,
        matchCharacterDescription: false,
        matchCharacterPersonality: false,
        matchCharacterDepthPrompt: false,
        matchScenario: false,
        matchCreatorNotes: false,
        delayUntilRecursion: false,
        probability: 100,
        useProbability: true,
        depth: 4,
        outletName: "",
        group: "",
        groupOverride: false,
        groupWeight: 100,
        scanDepth: null,
        caseSensitive: null,
        matchWholeWords: null,
        useGroupScoring: null,
        automationId: "",
        role: null,
        sticky: 0,
        cooldown: 0,
        delay: 0,
        triggers: [],
        displayIndex: Object.keys(lorebook.entries).length,
        characterFilter: {
            isExclude: false,
            names: [],
            tags: []
        }
    };
    
    lorebook.entries[uid] = newEntry;
    renderEntryList();
    openEntryInTab(uid);
    showNotification('New entry created!', 'success');
}

// Render Entry List
function renderEntryList() {
    const entryList = document.getElementById('entryList');
    const entryCount = document.getElementById('entryCount');
    const clearSelectionBtn = document.getElementById('clearSelection');
    
    // Show/hide clear selection button
    if (selectedEntries.length > 0) {
        clearSelectionBtn.style.display = 'block';
        clearSelectionBtn.querySelector('span').textContent = `☑️ Clear (${selectedEntries.length})`;
    } else {
        clearSelectionBtn.style.display = 'none';
    }
    
    // Sort entries by UID
    const entries = Object.values(lorebook.entries).sort((a, b) => a.uid - b.uid);
    entryCount.textContent = `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`;
    
    entryList.innerHTML = '';
    
    entries.forEach(entry => {
        const li = document.createElement('li');
        li.className = 'entry-item';
        li.dataset.uid = entry.uid;
        li.draggable = true;
        
        if (openTabs.includes(entry.uid)) {
            li.classList.add('active');
        }
        
        if (selectedEntries.includes(entry.uid)) {
            li.classList.add('selected');
        }
        
        // Drag and drop handlers
        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragend', handleDragEnd);
        
        // Header with checkbox, number input and title
        const header = document.createElement('div');
        header.className = 'entry-item-header';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'entry-checkbox';
        checkbox.checked = selectedEntries.includes(entry.uid);
        checkbox.addEventListener('click', (e) => e.stopPropagation());
        checkbox.addEventListener('change', (e) => {
            e.stopPropagation();
            toggleEntrySelection(entry.uid);
        });
        
        const numberInput = document.createElement('input');
        numberInput.type = 'number';
        numberInput.className = 'entry-number-input';
        numberInput.value = entry.uid;
        numberInput.min = 0;
        numberInput.addEventListener('click', (e) => e.stopPropagation());
        numberInput.addEventListener('change', (e) => {
            e.stopPropagation();
            reorderEntry(entry.uid, parseInt(e.target.value));
        });
        
        const title = document.createElement('div');
        title.className = 'entry-item-title';
        title.textContent = entry.comment || 'Untitled Entry';
        
        header.appendChild(checkbox);
        header.appendChild(numberInput);
        header.appendChild(title);
        
        const keywords = document.createElement('div');
        keywords.className = 'entry-item-keywords';
        if (entry.key && entry.key.length > 0) {
            entry.key.slice(0, 3).forEach(keyword => {
                const tag = document.createElement('span');
                tag.className = 'keyword-tag';
                tag.textContent = keyword;
                keywords.appendChild(tag);
            });
            if (entry.key.length > 3) {
                const more = document.createElement('span');
                more.className = 'keyword-tag';
                more.textContent = `+${entry.key.length - 3} more`;
                keywords.appendChild(more);
            }
        }
        
        const status = document.createElement('div');
        status.className = 'entry-item-status';
        if (entry.constant) {
            const badge = document.createElement('span');
            badge.className = 'status-badge status-constant';
            badge.textContent = 'Constant';
            status.appendChild(badge);
        }
        if (entry.disable) {
            const badge = document.createElement('span');
            badge.className = 'status-badge status-disabled';
            badge.textContent = 'Disabled';
            status.appendChild(badge);
        }
        
        li.appendChild(header);
        li.appendChild(keywords);
        li.appendChild(status);
        
        li.addEventListener('click', () => openEntryInTab(entry.uid));
        
        entryList.appendChild(li);
    });
}

// Toggle View Mode
function toggleView() {
    sideBySideView = !sideBySideView;
    const viewIcon = document.getElementById('viewIcon');
    viewIcon.textContent = sideBySideView ? 'âŠŸ' : 'âŠž';
    renderEditor();
}

// Multi-select functions
function toggleEntrySelection(uid) {
    const index = selectedEntries.indexOf(uid);
    if (index > -1) {
        selectedEntries.splice(index, 1);
    } else {
        selectedEntries.push(uid);
    }
    renderEntryList();
}

function clearSelection() {
    selectedEntries = [];
    renderEntryList();
}

// Drag and drop handlers
function handleDragStart(e) {
    const uid = parseInt(e.currentTarget.dataset.uid);
    
    // If dragging a selected item, drag all selected items
    if (selectedEntries.includes(uid)) {
        draggedEntries = [...selectedEntries].sort((a, b) => a - b);
    } else {
        draggedEntries = [uid];
    }
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    e.currentTarget.style.opacity = '0.4';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    
    const item = e.currentTarget;
    if (item.classList.contains('entry-item')) {
        item.style.borderTop = '3px solid var(--primary-color)';
    }
    
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    const dropTargetUid = parseInt(e.currentTarget.dataset.uid);
    
    if (draggedEntries.length > 0 && !draggedEntries.includes(dropTargetUid)) {
        moveMultipleEntries(draggedEntries, dropTargetUid);
    }
    
    return false;
}

function handleDragEnd(e) {
    e.currentTarget.style.opacity = '1';
    
    // Remove all border highlights
    document.querySelectorAll('.entry-item').forEach(item => {
        item.style.borderTop = '';
    });
    
    draggedEntries = [];
}

// Move multiple entries to a new position
function moveMultipleEntries(uidsToMove, targetUid) {
    // Get all entries sorted by UID
    const entriesArray = Object.values(lorebook.entries).sort((a, b) => a.uid - b.uid);
    
    // Separate entries to move from others
    const movingEntries = entriesArray.filter(e => uidsToMove.includes(e.uid));
    const remainingEntries = entriesArray.filter(e => !uidsToMove.includes(e.uid));
    
    // Find the target position in the remaining entries
    const targetIndex = remainingEntries.findIndex(e => e.uid === targetUid);
    
    if (targetIndex === -1) return;
    
    // Insert moving entries at target position
    remainingEntries.splice(targetIndex, 0, ...movingEntries);
    
    // Clear old entries and rebuild with sequential UIDs
    lorebook.entries = {};
    const uidMapping = new Map(); // Track old UID to new UID
    
    remainingEntries.forEach((entry, index) => {
        const oldUid = entry.uid;
        entry.uid = index;
        lorebook.entries[index] = entry;
        uidMapping.set(oldUid, index);
    });
    
    // Update open tabs
    openTabs = openTabs.map(uid => uidMapping.get(uid) ?? uid);
    if (activeTabId !== null && uidMapping.has(activeTabId)) {
        activeTabId = uidMapping.get(activeTabId);
    }
    
    // Update selected entries
    selectedEntries = selectedEntries.map(uid => uidMapping.get(uid) ?? uid);
    
    // Update nextUid
    nextUid = Math.max(...Object.keys(lorebook.entries).map(k => parseInt(k))) + 1;
    
    renderEntryList();
    renderTabs();
    renderEditor();
}

// Reorder Entry by changing UID
function reorderEntry(oldUid, newUid) {
    if (oldUid === newUid) return;
    if (newUid < 0) {
        showNotification('UID cannot be negative', 'error');
        renderEntryList();
        return;
    }
    
    // Get the entry we're moving
    const movingEntry = lorebook.entries[oldUid];
    if (!movingEntry) return;
    
    // Build array of all entries sorted by current UID
    const entriesArray = Object.values(lorebook.entries).sort((a, b) => a.uid - b.uid);
    
    // Remove the moving entry from the array
    const filteredEntries = entriesArray.filter(e => e.uid !== oldUid);
    
    // If target position is beyond the end, just append
    if (newUid >= filteredEntries.length) {
        movingEntry.uid = newUid;
        delete lorebook.entries[oldUid];
        lorebook.entries[newUid] = movingEntry;
        
        // Update open tabs
        updateOpenTabsAfterReorder(oldUid, newUid);
        
        renderEntryList();
        renderTabs();
        renderEditor();
        return;
    }
    
    // Insert at new position and rebuild UIDs sequentially
    filteredEntries.splice(newUid, 0, movingEntry);
    
    // Clear old entries object
    lorebook.entries = {};
    
    // Rebuild with new UIDs
    filteredEntries.forEach((entry, index) => {
        const oldEntryUid = entry.uid;
        entry.uid = index;
        lorebook.entries[index] = entry;
        
        // Update open tabs if this entry was open
        if (oldEntryUid !== index) {
            updateOpenTabsAfterReorder(oldEntryUid, index);
        }
    });
    
    // Update nextUid to be one more than the highest UID
    nextUid = Math.max(...Object.keys(lorebook.entries).map(k => parseInt(k))) + 1;
    
    renderEntryList();
    renderTabs();
    renderEditor();
}

// Update open tabs after UID changes
function updateOpenTabsAfterReorder(oldUid, newUid) {
    const tabIndex = openTabs.indexOf(oldUid);
    if (tabIndex > -1) {
        openTabs[tabIndex] = newUid;
    }
    if (activeTabId === oldUid) {
        activeTabId = newUid;
    }
}

// Search Entries
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const entries = document.querySelectorAll('.entry-item');
    
    entries.forEach(entry => {
        const title = entry.querySelector('.entry-item-title').textContent.toLowerCase();
        const keywords = Array.from(entry.querySelectorAll('.keyword-tag'))
            .map(tag => tag.textContent.toLowerCase());
        
        const matches = title.includes(query) || keywords.some(k => k.includes(query));
        entry.style.display = matches ? 'block' : 'none';
    });
}

// Tab Management
function openEntryInTab(uid) {
    if (!openTabs.includes(uid)) {
        openTabs.push(uid);
    }
    activeTabId = uid;
    renderTabs();
    renderEditor();
}

function closeTab(uid) {
    const index = openTabs.indexOf(uid);
    if (index > -1) {
        openTabs.splice(index, 1);
    }
    
    if (activeTabId === uid) {
        activeTabId = openTabs.length > 0 ? openTabs[openTabs.length - 1] : null;
    }
    
    renderTabs();
    renderEditor();
}

function renderTabs() {
    const tabBar = document.getElementById('tabBar');
    tabBar.innerHTML = '';
    
    openTabs.forEach(uid => {
        const entry = lorebook.entries[uid];
        if (!entry) return;
        
        const tab = document.createElement('button');
        tab.className = 'tab';
        if (uid === activeTabId) {
            tab.classList.add('active');
        }
        
        const tabText = document.createElement('span');
        tabText.textContent = entry.comment || 'Untitled';
        
        const closeBtn = document.createElement('span');
        closeBtn.className = 'tab-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeTab(uid);
        });
        
        tab.appendChild(tabText);
        tab.appendChild(closeBtn);
        tab.addEventListener('click', () => {
            activeTabId = uid;
            renderTabs();
            renderEditor();
        });
        
        tabBar.appendChild(tab);
    });
}

// Render Editor
function renderEditor() {
    const editorContent = document.getElementById('editorContent');
    
    if (openTabs.length === 0) {
        editorContent.className = 'editor-content';
        editorContent.innerHTML = `
            <div class="empty-state">
                <p>👈 Select an entry from the sidebar to start editing</p>
                <p>or</p>
                <button id="newEntryBtnAlt2" class="btn btn-success">+ Create New Entry</button>
            </div>
        `;
        document.getElementById('newEntryBtnAlt2').addEventListener('click', createNewEntry);
        return;
    }
    
    // Side-by-side view: show all open tabs
    if (sideBySideView && openTabs.length > 1) {
        editorContent.className = 'editor-content editor-grid';
        editorContent.innerHTML = '';
        
        openTabs.forEach(uid => {
            const entry = lorebook.entries[uid];
            if (!entry) return;
            
            const panel = document.createElement('div');
            panel.className = 'editor-panel';
            panel.innerHTML = generateEditorHTML(entry, uid);
            editorContent.appendChild(panel);
            
            // Attach event listeners for this panel
            attachEditorListeners(panel, uid);
        });
    } else {
        // Single view: show only active tab
        editorContent.className = 'editor-content';
        
        if (activeTabId === null || activeTabId === undefined || !lorebook.entries[activeTabId]) {
            editorContent.innerHTML = `
                <div class="empty-state">
                    <p>👈 Select an entry from the sidebar to start editing</p>
                    <p>or</p>
                    <button id="newEntryBtnAlt2" class="btn btn-success">+ Create New Entry</button>
                </div>
            `;
            document.getElementById('newEntryBtnAlt2').addEventListener('click', createNewEntry);
            return;
        }
        
        const entry = lorebook.entries[activeTabId];
        editorContent.innerHTML = generateEditorHTML(entry, activeTabId);
        attachEditorListeners(editorContent, activeTabId);
    }
}

// Generate HTML for an entry editor
function generateEditorHTML(entry, uid) {
    return `
        <div class="entry-editor" data-uid="${uid}">
            <!-- Basic Fields -->
            <div class="form-group">
                <label class="form-label" for="entryName-${uid}">Name / Title</label>
                <input type="text" id="entryName-${uid}" class="form-input entry-name" value="${escapeHtml(entry.comment || '')}" placeholder="Enter entry name...">
            </div>
            
            <div class="form-group">
                <label class="form-label" for="entryKeywords-${uid}">Keywords</label>
                <div class="keywords-row">
                    <div class="keyword-field">
                        <label class="form-label-small">Primary</label>
                        <input type="text" id="entryKeywords-${uid}" class="form-input entry-keywords" value="${escapeHtml(entry.key.join(', '))}" placeholder="sword, magic, fire">
                    </div>
                    <div class="keyword-logic">
                        <label class="form-label-small">Logic</label>
                        <select id="entrySelectiveLogic-${uid}" class="form-input entry-selective-logic">
                            <option value="0" ${entry.selectiveLogic === 0 ? 'selected' : ''}>AND ANY</option>
                            <option value="1" ${entry.selectiveLogic === 1 ? 'selected' : ''}>NOT ANY</option>
                            <option value="2" ${entry.selectiveLogic === 2 ? 'selected' : ''}>NOT ALL</option>
                            <option value="3" ${entry.selectiveLogic === 3 ? 'selected' : ''}>AND ALL</option>
                        </select>
                    </div>
                    <div class="keyword-field">
                        <label class="form-label-small">Secondary</label>
                        <input type="text" id="entryKeywordsSecondary-${uid}" class="form-input entry-keywords-secondary" value="${escapeHtml(entry.keysecondary.join(', '))}" placeholder="holy, blessed">
                    </div>
                </div>
                <small style="color: var(--text-secondary); margin-top: 0.5rem; display: block;">Comma-separated keywords. Secondary keywords are optional filters.</small>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="entryContent-${uid}">Content</label>
                <textarea id="entryContent-${uid}" class="form-textarea entry-content" placeholder="Enter entry content...">${escapeHtml(entry.content || '')}</textarea>
            </div>
            
            <!-- Advanced Settings -->
            <div class="advanced-settings">
                <div class="advanced-settings-header" data-uid="${uid}">
                    <span class="advanced-settings-title">⚙️ Advanced Settings</span>
                    <span class="advanced-settings-toggle" id="advancedToggle-${uid}">▼</span>
                </div>
                <div class="advanced-settings-content" id="advancedContent-${uid}">
                    <div class="advanced-grid">
                        <!-- Activation Settings -->
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryDisable-${uid}" class="entry-disable" ${entry.disable ? 'checked' : ''}>
                                <label class="form-label-small" for="entryDisable-${uid}">Disable Entry</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryConstant-${uid}" class="entry-constant" ${entry.constant ? 'checked' : ''}>
                                <label class="form-label-small" for="entryConstant-${uid}">Constant (Always Active)</label>
                            </div>
                        </div>
                        
                        <!-- Order & Position -->
                        <div class="form-group">
                            <label class="form-label-small" for="entryOrder-${uid}">Order</label>
                            <input type="number" id="entryOrder-${uid}" class="form-input-number entry-order" value="${entry.order}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryPosition-${uid}">Insertion Position</label>
                            <select id="entryPosition-${uid}" class="form-input entry-position">
                                <option value="0" ${entry.position === 0 ? 'selected' : ''}>↑Char (Before Char)</option>
                                <option value="1" ${entry.position === 1 ? 'selected' : ''}>↓Char (After Char)</option>
                                <option value="2" ${entry.position === 2 ? 'selected' : ''}>↑AN (Before AN)</option>
                                <option value="3" ${entry.position === 3 ? 'selected' : ''}>↓AN (After AN)</option>
                                <option value="4" ${entry.position === 4 ? 'selected' : ''}>@D (At Depth)</option>
                                <option value="5" ${entry.position === 5 ? 'selected' : ''}>↑EM (Before Examples)</option>
                                <option value="6" ${entry.position === 6 ? 'selected' : ''}>↓EM (After Examples)</option>
                                <option value="7" ${entry.position === 7 ? 'selected' : ''}>Outlet</option>
                            </select>
                        </div>
                        
                        ${entry.position === 4 ? `
                        <div class="form-group">
                            <label class="form-label-small" for="entryDepth-${uid}">Insertion Depth (0 = bottom of prompt)</label>
                            <input type="number" id="entryDepth-${uid}" class="form-input-number entry-depth" value="${entry.depth}" min="0">
                        </div>
                        <div class="form-group">
                            <label class="form-label-small" for="entryRole-${uid}">Role</label>
                            <select id="entryRole-${uid}" class="form-input entry-role">
                                <option value="null" ${entry.role === null ? 'selected' : ''}>None</option>
                                <option value="0" ${entry.role === 0 ? 'selected' : ''}>⚙️ System</option>
                                <option value="1" ${entry.role === 1 ? 'selected' : ''}>👤 User</option>
                                <option value="2" ${entry.role === 2 ? 'selected' : ''}>🤖 Assistant</option>
                            </select>
                        </div>
                        ` : `
                        <div class="form-group">
                            <label class="form-label-small" for="entryDepth-${uid}">Depth</label>
                            <input type="number" id="entryDepth-${uid}" class="form-input-number entry-depth" value="${entry.depth}" min="0">
                            <small style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">Used for position-specific behavior</small>
                        </div>
                        `}
                        
                        <!-- Scan Depth (optional override) -->
                        <div class="form-group">
                            <label class="form-label-small" for="entryScanDepth-${uid}">Scan Depth Override (leave empty for global)</label>
                            <input type="number" id="entryScanDepth-${uid}" class="form-input-number entry-scan-depth" value="${entry.scanDepth !== null ? entry.scanDepth : ''}" min="0" placeholder="Use global">
                            <small style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">How many messages back to scan for keywords</small>
                        </div>
                        
                        ${entry.position === 7 ? `
                        <div class="form-group">
                            <label class="form-label-small" for="entryOutletName-${uid}">Outlet Name</label>
                            <input type="text" id="entryOutletName-${uid}" class="form-input entry-outlet-name" value="${escapeHtml(entry.outletName || '')}" placeholder="Outlet name...">
                        </div>
                        ` : ''}
                        
                        <!-- Probability -->
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryUseProbability-${uid}" class="entry-use-probability" ${entry.useProbability ? 'checked' : ''}>
                                <label class="form-label-small" for="entryUseProbability-${uid}">Use Probability</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryProbability-${uid}">Probability %</label>
                            <input type="number" id="entryProbability-${uid}" class="form-input-number entry-probability" value="${entry.probability}" min="0" max="100">
                        </div>
                        
                        <!-- Recursion Settings -->
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryExcludeRecursion-${uid}" class="entry-exclude-recursion" ${entry.excludeRecursion ? 'checked' : ''}>
                                <label class="form-label-small" for="entryExcludeRecursion-${uid}">Exclude Recursion</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryPreventRecursion-${uid}" class="entry-prevent-recursion" ${entry.preventRecursion ? 'checked' : ''}>
                                <label class="form-label-small" for="entryPreventRecursion-${uid}">Prevent Recursion</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryDelayUntilRecursion-${uid}" class="entry-delay-recursion" ${entry.delayUntilRecursion ? 'checked' : ''}>
                                <label class="form-label-small" for="entryDelayUntilRecursion-${uid}">Delay Until Recursion</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryIgnoreBudget-${uid}" class="entry-ignore-budget" ${entry.ignoreBudget ? 'checked' : ''}>
                                <label class="form-label-small" for="entryIgnoreBudget-${uid}">Ignore Budget</label>
                            </div>
                        </div>
                        
                        <!-- Sticky & Cooldown -->
                        <div class="form-group">
                            <label class="form-label-small" for="entrySticky-${uid}">Sticky</label>
                            <input type="number" id="entrySticky-${uid}" class="form-input-number entry-sticky" value="${entry.sticky}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryCooldown-${uid}">Cooldown</label>
                            <input type="number" id="entryCooldown-${uid}" class="form-input-number entry-cooldown" value="${entry.cooldown}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryDelay-${uid}">Delay</label>
                            <input type="number" id="entryDelay-${uid}" class="form-input-number entry-delay" value="${entry.delay}" min="0">
                        </div>
                        
                        <!-- Group Settings -->
                        <div class="form-group">
                            <label class="form-label-small" for="entryGroup-${uid}">Group</label>
                            <input type="text" id="entryGroup-${uid}" class="form-input entry-group" value="${escapeHtml(entry.group || '')}" placeholder="Group name...">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryGroupWeight-${uid}">Group Weight</label>
                            <input type="number" id="entryGroupWeight-${uid}" class="form-input-number entry-group-weight" value="${entry.groupWeight}" min="0">
                        </div>
                        
                        <!-- Automation ID -->
                        <div class="form-group">
                            <label class="form-label-small" for="entryAutomationId-${uid}">Automation ID</label>
                            <input type="text" id="entryAutomationId-${uid}" class="form-input entry-automation-id" value="${escapeHtml(entry.automationId || '')}" placeholder="Automation ID...">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Actions -->
            <div class="editor-actions">
                <button class="btn btn-primary save-btn" data-uid="${uid}">Save Changes</button>
                <button class="btn btn-danger delete-btn" data-uid="${uid}">Delete Entry</button>
            </div>
        </div>
    `;
}

// Attach event listeners to editor elements
function attachEditorListeners(container, uid) {
    // Save and Delete buttons
    const saveBtn = container.querySelector(`.save-btn[data-uid="${uid}"]`);
    const deleteBtn = container.querySelector(`.delete-btn[data-uid="${uid}"]`);
    
    if (saveBtn) saveBtn.addEventListener('click', () => saveEntryByUid(uid));
    if (deleteBtn) deleteBtn.addEventListener('click', () => deleteEntryByUid(uid));
    
    // Position change listener - re-render to show/hide conditional fields
    const positionSelect = container.querySelector(`#entryPosition-${uid}`);
    if (positionSelect) {
        positionSelect.addEventListener('change', () => {
            // Save current values first
            saveEntryByUid(uid);
            // Re-render to show/hide role and outlet fields
            renderEditor();
        });
    }
    
    // Advanced settings toggle
    const advancedHeader = container.querySelector(`.advanced-settings-header[data-uid="${uid}"]`);
    if (advancedHeader) {
        advancedHeader.addEventListener('click', () => toggleAdvancedSettingsByUid(uid));
    }
}

// Save Entry by UID
function saveEntryByUid(uid) {
    const entry = lorebook.entries[uid];
    if (!entry) return;
    
    entry.comment = document.getElementById(`entryName-${uid}`).value;
    entry.content = document.getElementById(`entryContent-${uid}`).value;
    entry.disable = document.getElementById(`entryDisable-${uid}`).checked;
    entry.constant = document.getElementById(`entryConstant-${uid}`).checked;
    
    // Parse comma-separated keywords
    const primaryKeywordsRaw = document.getElementById(`entryKeywords-${uid}`).value;
    entry.key = primaryKeywordsRaw
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
    
    const secondaryKeywordsRaw = document.getElementById(`entryKeywordsSecondary-${uid}`).value;
    entry.keysecondary = secondaryKeywordsRaw
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
    
    // Automatically set selective based on whether secondary keywords exist
    entry.selective = entry.keysecondary.length > 0;
    
    // Handle depth field (always present)
    entry.depth = parseInt(document.getElementById(`entryDepth-${uid}`).value);
    
    // Handle scanDepth (optional override - null means use global)
    const scanDepthValue = document.getElementById(`entryScanDepth-${uid}`).value;
    entry.scanDepth = scanDepthValue === '' ? null : parseInt(scanDepthValue);
    
    entry.order = parseInt(document.getElementById(`entryOrder-${uid}`).value);
    entry.position = parseInt(document.getElementById(`entryPosition-${uid}`).value);
    entry.useProbability = document.getElementById(`entryUseProbability-${uid}`).checked;
    entry.probability = parseInt(document.getElementById(`entryProbability-${uid}`).value);
    entry.excludeRecursion = document.getElementById(`entryExcludeRecursion-${uid}`).checked;
    entry.preventRecursion = document.getElementById(`entryPreventRecursion-${uid}`).checked;
    entry.delayUntilRecursion = document.getElementById(`entryDelayUntilRecursion-${uid}`).checked;
    entry.ignoreBudget = document.getElementById(`entryIgnoreBudget-${uid}`).checked;
    entry.sticky = parseInt(document.getElementById(`entrySticky-${uid}`).value);
    entry.cooldown = parseInt(document.getElementById(`entryCooldown-${uid}`).value);
    entry.delay = parseInt(document.getElementById(`entryDelay-${uid}`).value);
    entry.group = document.getElementById(`entryGroup-${uid}`).value;
    entry.groupWeight = parseInt(document.getElementById(`entryGroupWeight-${uid}`).value);
    entry.automationId = document.getElementById(`entryAutomationId-${uid}`).value;
    
    // Handle selectiveLogic
    entry.selectiveLogic = parseInt(document.getElementById(`entrySelectiveLogic-${uid}`).value);
    
    // Handle role (only exists when position is @D/4)
    const roleElement = document.getElementById(`entryRole-${uid}`);
    if (roleElement) {
        const roleValue = roleElement.value;
        entry.role = roleValue === 'null' ? null : parseInt(roleValue);
    } else {
        // Reset role to null if position changed away from @D
        if (entry.position !== 4) {
            entry.role = null;
        }
    }
    
    // Handle outlet name (only exists when position is Outlet/7)
    const outletElement = document.getElementById(`entryOutletName-${uid}`);
    if (outletElement) {
        entry.outletName = outletElement.value;
    } else {
        // Reset outlet name if position changed away from Outlet
        if (entry.position !== 7) {
            entry.outletName = "";
        }
    }
    
    renderEntryList();
    renderTabs();
    showNotification('Entry saved!', 'success');
}

// Delete Entry by UID
function deleteEntryByUid(uid) {
    if (confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
        delete lorebook.entries[uid];
        closeTab(uid);
        renderEntryList();
        showNotification('Entry deleted', 'success');
    }
}

// Keyword Management by UID
function addKeywordByUid(uid, keyword) {
    const entry = lorebook.entries[uid];
    if (!entry.key.includes(keyword)) {
        entry.key.push(keyword);
        renderEditor();
    }
}

function removeKeywordByUid(uid, keyword) {
    const entry = lorebook.entries[uid];
    entry.key = entry.key.filter(k => k !== keyword);
    renderEditor();
}

function addKeywordSecondaryByUid(uid, keyword) {
    const entry = lorebook.entries[uid];
    if (!entry.keysecondary.includes(keyword)) {
        entry.keysecondary.push(keyword);
        renderEditor();
    }
}

function removeKeywordSecondaryByUid(uid, keyword) {
    const entry = lorebook.entries[uid];
    entry.keysecondary = entry.keysecondary.filter(k => k !== keyword);
    renderEditor();
}

// Toggle Advanced Settings by UID
function toggleAdvancedSettingsByUid(uid) {
    const content = document.getElementById(`advancedContent-${uid}`);
    const toggle = document.getElementById(`advancedToggle-${uid}`);
    
    if (content && toggle) {
        content.classList.toggle('open');
        toggle.classList.toggle('open');
    }
}

// Legacy functions for backward compatibility
function saveEntry() {
    if (activeTabId !== null) saveEntryByUid(activeTabId);
}

function deleteEntry() {
    if (activeTabId !== null) deleteEntryByUid(activeTabId);
}

function addKeyword(keyword) {
    if (activeTabId !== null) addKeywordByUid(activeTabId, keyword);
}

function removeKeyword(keyword) {
    if (activeTabId !== null) removeKeywordByUid(activeTabId, keyword);
}

function addKeywordSecondary(keyword) {
    if (activeTabId !== null) addKeywordSecondaryByUid(activeTabId, keyword);
}

function removeKeywordSecondary(keyword) {
    if (activeTabId !== null) removeKeywordSecondaryByUid(activeTabId, keyword);
}

function toggleAdvancedSettings() {
    if (activeTabId !== null) toggleAdvancedSettingsByUid(activeTabId);
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Simple notification - could be enhanced with a toast library
    console.log(`[${type.toUpperCase()}] ${message}`);
    alert(message);
}
