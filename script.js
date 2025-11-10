// Lorebook Manager - Main Script

let currentZoomLevel = 1; // 0: zoomed out, 1: normal, 2: zoomed in
let lorebook = { entries: {} };
let openTabs = [];
let activeTabId = null;
let nextUid = 0;
let sideBySideView = false;
let selectedEntries = [];
let draggedEntries = [];
let unsavedChanges = new Set(); // Track which entries have unsaved changes
let formState = {}; // Store form data for entries with unsaved changes
let mergeStaging = null; // Lorebook staged for merging
let mergeSelectedEntries = []; // Entries selected for merge

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
});

// Event Listeners
function initializeEventListeners() {
    document.getElementById('importBtn').addEventListener('click', importLorebook);
    document.getElementById('importMergeBtn').addEventListener('click', importLorebookForMerge);
    document.getElementById('exportBtn').addEventListener('click', exportLorebook);
    document.getElementById('newEntryBtn').addEventListener('click', createNewEntry);
    document.getElementById('newEntryBtnAlt').addEventListener('click', createNewEntry);
    document.getElementById('searchEntries').addEventListener('input', handleSearch);
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
    document.getElementById('fileMergeInput').addEventListener('change', handleMergeFileSelect);
    document.getElementById('viewToggle').addEventListener('click', toggleView);
    document.getElementById('clearSelection').addEventListener('click', clearSelection);
    document.getElementById('lorebookName').addEventListener('input', handleLorebookNameChange);
    document.getElementById('helpBtn').addEventListener('click', showHelp);
    document.getElementById('closeHelp').addEventListener('click', hideHelp);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('fontToggle').addEventListener('click', toggleDyslexiaFont);
    document.getElementById('zoomOut').addEventListener('click', () => changeZoomLevel(-1));
    document.getElementById('zoomIn').addEventListener('click', () => changeZoomLevel(1));
    
    // Merge modal controls
    document.getElementById('closeMerge').addEventListener('click', closeMergeModal);
    document.getElementById('cancelMerge').addEventListener('click', closeMergeModal);
    document.getElementById('selectAllMerge').addEventListener('click', selectAllMergeEntries);
    document.getElementById('deselectAllMerge').addEventListener('click', deselectAllMergeEntries);
    document.getElementById('confirmMerge').addEventListener('click', executeMerge);
    
    // Close modal when clicking outside
    document.getElementById('helpModal').addEventListener('click', (e) => {
        if (e.target.id === 'helpModal') hideHelp();
    });
    
    document.getElementById('mergeModal').addEventListener('click', (e) => {
        if (e.target.id === 'mergeModal') closeMergeModal();
    });
    
    // Load saved preferences
    loadPreferences();
}

// Handle lorebook name changes
function handleLorebookNameChange(event) {
    lorebook.name = event.target.value.trim();
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
            
            // Set lorebook name from filename (remove .json extension)
            const fileName = file.name.replace(/\.json$/i, '');
            if (!lorebook.name) {
                lorebook.name = fileName;
            }
            document.getElementById('lorebookName').value = lorebook.name || fileName;
            
            // Find highest UID to set nextUid
            nextUid = 0;
            Object.values(lorebook.entries).forEach(entry => {
                if (entry.uid >= nextUid) {
                    nextUid = entry.uid + 1;
                }
                
                // Add missing fields for backward compatibility
                if (!entry.characterFilter) {
                    entry.characterFilter = { isExclude: false, names: [], tags: [] };
                }
                if (!entry.triggers) {
                    entry.triggers = [];
                }
                if (entry.matchPersonaDescription === undefined) entry.matchPersonaDescription = false;
                if (entry.matchCharacterDescription === undefined) entry.matchCharacterDescription = false;
                if (entry.matchCharacterPersonality === undefined) entry.matchCharacterPersonality = false;
                if (entry.matchCharacterDepthPrompt === undefined) entry.matchCharacterDepthPrompt = false;
                if (entry.matchScenario === undefined) entry.matchScenario = false;
                if (entry.matchCreatorNotes === undefined) entry.matchCreatorNotes = false;
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
    // Save the lorebook name from input
    const nameInput = document.getElementById('lorebookName').value.trim();
    lorebook.name = nameInput || 'lorebook';
    
    // Create filename (sanitize and ensure .json extension)
    let filename = lorebook.name.replace(/[^a-z0-9_-]/gi, '_');
    if (!filename.endsWith('.json')) {
        filename += '.json';
    }
    
    const dataStr = JSON.stringify(lorebook, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Lorebook exported successfully!', 'success');
}

// Import Lorebook for Merging
function importLorebookForMerge() {
    document.getElementById('fileMergeInput').click();
}

function handleMergeFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            mergeStaging = data;
            mergeSelectedEntries = [];
            
            // Add missing fields for backward compatibility
            Object.values(mergeStaging.entries).forEach(entry => {
                if (!entry.characterFilter) {
                    entry.characterFilter = { isExclude: false, names: [], tags: [] };
                }
                if (!entry.triggers) {
                    entry.triggers = [];
                }
                if (entry.matchPersonaDescription === undefined) entry.matchPersonaDescription = false;
                if (entry.matchCharacterDescription === undefined) entry.matchCharacterDescription = false;
                if (entry.matchCharacterPersonality === undefined) entry.matchCharacterPersonality = false;
                if (entry.matchCharacterDepthPrompt === undefined) entry.matchCharacterDepthPrompt = false;
                if (entry.matchScenario === undefined) entry.matchScenario = false;
                if (entry.matchCreatorNotes === undefined) entry.matchCreatorNotes = false;
            });
            
            showMergeModal();
        } catch (error) {
            showNotification('Error importing lorebook for merge: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

function showMergeModal() {
    document.getElementById('currentLorebookName').textContent = lorebook.name || 'Untitled';
    document.getElementById('mergeLorebookName').textContent = mergeStaging.name || 'Untitled';
    renderMergeEntryList();
    document.getElementById('mergeModal').style.display = 'flex';
}

function closeMergeModal() {
    document.getElementById('mergeModal').style.display = 'none';
    mergeStaging = null;
    mergeSelectedEntries = [];
}

function renderMergeEntryList() {
    const mergeList = document.getElementById('mergeEntryList');
    const entries = Object.values(mergeStaging.entries).sort((a, b) => a.uid - b.uid);
    
    mergeList.innerHTML = '';
    
    entries.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'merge-entry-item';
        if (mergeSelectedEntries.includes(entry.uid)) {
            div.classList.add('selected');
        }
        
        const header = document.createElement('div');
        header.className = 'merge-entry-header';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'merge-entry-checkbox';
        checkbox.checked = mergeSelectedEntries.includes(entry.uid);
        checkbox.addEventListener('change', () => toggleMergeSelection(entry.uid));
        
        const uid = document.createElement('div');
        uid.className = 'merge-entry-uid';
        uid.textContent = `#${entry.uid}`;
        
        const title = document.createElement('div');
        title.className = 'merge-entry-title';
        title.textContent = entry.comment || 'Untitled Entry';
        
        header.appendChild(checkbox);
        header.appendChild(uid);
        header.appendChild(title);
        
        // Keywords
        const keywords = document.createElement('div');
        keywords.className = 'merge-entry-keywords';
        if (entry.key && entry.key.length > 0) {
            entry.key.slice(0, 5).forEach(keyword => {
                const tag = document.createElement('span');
                tag.className = 'keyword-tag';
                tag.textContent = keyword;
                keywords.appendChild(tag);
            });
            if (entry.key.length > 5) {
                const more = document.createElement('span');
                more.className = 'keyword-tag';
                more.textContent = `+${entry.key.length - 5} more`;
                keywords.appendChild(more);
            }
        }
        
        // Status badges
        const status = document.createElement('div');
        status.className = 'merge-entry-status';
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
        
        div.appendChild(header);
        if (keywords.children.length > 0) {
            div.appendChild(keywords);
        }
        if (status.children.length > 0) {
            div.appendChild(status);
        }
        
        mergeList.appendChild(div);
    });
    
    updateMergeCount();
}

function toggleMergeSelection(uid) {
    const index = mergeSelectedEntries.indexOf(uid);
    if (index > -1) {
        mergeSelectedEntries.splice(index, 1);
    } else {
        mergeSelectedEntries.push(uid);
    }
    renderMergeEntryList();
}

function selectAllMergeEntries() {
    mergeSelectedEntries = Object.values(mergeStaging.entries).map(e => e.uid);
    renderMergeEntryList();
}

function deselectAllMergeEntries() {
    mergeSelectedEntries = [];
    renderMergeEntryList();
}

function updateMergeCount() {
    const countEl = document.querySelector('.merge-count');
    const count = mergeSelectedEntries.length;
    countEl.textContent = `${count} ${count === 1 ? 'entry' : 'entries'} selected`;
}

function executeMerge() {
    if (mergeSelectedEntries.length === 0) {
        alert('Please select at least one entry to merge.');
        return;
    }
    
    // Find the highest UID in current lorebook
    let maxUid = -1;
    Object.values(lorebook.entries).forEach(entry => {
        if (entry.uid > maxUid) {
            maxUid = entry.uid;
        }
    });
    
    let newUidStart = maxUid + 1;
    let addedCount = 0;
    
    // Copy selected entries and renumber them
    mergeSelectedEntries.forEach(oldUid => {
        const sourceEntry = mergeStaging.entries[oldUid];
        if (!sourceEntry) return;
        
        // Create a deep copy
        const newEntry = JSON.parse(JSON.stringify(sourceEntry));
        
        // Assign new UID
        const newUid = newUidStart + addedCount;
        newEntry.uid = newUid;
        newEntry.order = newUid;
        newEntry.displayIndex = newUid;
        
        // Add to current lorebook
        lorebook.entries[newUid] = newEntry;
        addedCount++;
    });
    
    // Update nextUid
    nextUid = newUidStart + addedCount;
    
    // Refresh UI
    renderEntryList();
    closeMergeModal();
    
    console.log(`Merged ${addedCount} entries from ${mergeStaging.name || 'lorebook'}`);
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
        displayIndex: uid,
        characterFilter: {
            isExclude: false,
            names: [],
            tags: []
        }
    };
    
    lorebook.entries[uid] = newEntry;
    renderEntryList();
    openEntryInTab(uid);
}

// Insert Entry Above - creates new entry before specified UID
function insertEntryAbove(targetUid) {
    const entries = Object.values(lorebook.entries);
    
    // Shift all entries at or after targetUid
    entries.forEach(entry => {
        if (entry.uid >= targetUid) {
            entry.uid++;
            entry.order = entry.uid;
            entry.displayIndex = entry.uid;
        }
    });
    
    // Create new entry at targetUid position
    const newEntry = {
        uid: targetUid,
        key: [],
        keysecondary: [],
        comment: "New Entry",
        content: "",
        constant: false,
        vectorized: false,
        selective: true,
        selectiveLogic: 0,
        addMemo: true,
        order: targetUid,
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
        displayIndex: targetUid,
        characterFilter: {
            isExclude: false,
            names: [],
            tags: []
        }
    };
    
    // Rebuild entries object with new keys
    const newEntries = {};
    entries.forEach(entry => {
        newEntries[entry.uid] = entry;
    });
    newEntries[targetUid] = newEntry;
    lorebook.entries = newEntries;
    
    // Update nextUid if necessary
    const maxUid = Math.max(...Object.keys(newEntries).map(k => parseInt(k)));
    nextUid = maxUid + 1;
    
    renderEntryList();
    openEntryInTab(targetUid);
}

// Insert Entry Below - creates new entry after specified UID
function insertEntryBelow(targetUid) {
    const entries = Object.values(lorebook.entries);
    const newUid = targetUid + 1;
    
    // Shift all entries after targetUid
    entries.forEach(entry => {
        if (entry.uid > targetUid) {
            entry.uid++;
            entry.order = entry.uid;
            entry.displayIndex = entry.uid;
        }
    });
    
    // Create new entry at position after targetUid
    const newEntry = {
        uid: newUid,
        key: [],
        keysecondary: [],
        comment: "New Entry",
        content: "",
        constant: false,
        vectorized: false,
        selective: true,
        selectiveLogic: 0,
        addMemo: true,
        order: newUid,
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
        displayIndex: newUid,
        characterFilter: {
            isExclude: false,
            names: [],
            tags: []
        }
    };
    
    // Rebuild entries object with new keys
    const newEntries = {};
    entries.forEach(entry => {
        newEntries[entry.uid] = entry;
    });
    newEntries[newUid] = newEntry;
    lorebook.entries = newEntries;
    
    // Update nextUid if necessary
    const maxUid = Math.max(...Object.keys(newEntries).map(k => parseInt(k)));
    nextUid = maxUid + 1;
    
    renderEntryList();
    openEntryInTab(newUid);
}

// Copy Entry - duplicates an entry and places it right after the original
function copyEntry(sourceUid) {
    const sourceEntry = lorebook.entries[sourceUid];
    if (!sourceEntry) return;
    
    const entries = Object.values(lorebook.entries);
    const newUid = sourceUid + 1;
    
    // Shift all entries after sourceUid
    entries.forEach(entry => {
        if (entry.uid > sourceUid) {
            entry.uid++;
            entry.order = entry.uid;
            entry.displayIndex = entry.uid;
        }
    });
    
    // Create copy of the entry
    const copiedEntry = JSON.parse(JSON.stringify(sourceEntry));
    copiedEntry.uid = newUid;
    copiedEntry.order = newUid;
    copiedEntry.displayIndex = newUid;
    copiedEntry.comment = (copiedEntry.comment || 'Untitled Entry') + ' (Copy)';
    
    // Rebuild entries object with new keys
    const newEntries = {};
    entries.forEach(entry => {
        newEntries[entry.uid] = entry;
    });
    newEntries[newUid] = copiedEntry;
    lorebook.entries = newEntries;
    
    // Update nextUid if necessary
    const maxUid = Math.max(...Object.keys(newEntries).map(k => parseInt(k)));
    nextUid = maxUid + 1;
    
    renderEntryList();
    openEntryInTab(newUid);
}

// Delete Entry from Sidebar - delete without opening
function deleteEntryFromSidebar(uid) {
    if (confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
        delete lorebook.entries[uid];
        closeTab(uid);
        renderEntryList();
    }
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
        
        li.appendChild(header);
        // Action buttons container - ALWAYS show these regardless of zoom level
        const actions = document.createElement('div');
        actions.className = 'entry-item-actions';
        
        // Insert Above button
        const insertAboveBtn = document.createElement('button');
        insertAboveBtn.className = 'entry-action-btn';
        insertAboveBtn.innerHTML = '<span class="material-symbols-outlined">add_row_above</span>';
        insertAboveBtn.title = 'Insert new entry above';
        insertAboveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            insertEntryAbove(entry.uid);
        });
        
        //Insert Below button
        const insertBelowBtn = document.createElement('button');
        insertBelowBtn.className = 'entry-action-btn';
        insertBelowBtn.innerHTML = '<span class="material-symbols-outlined">add_row_below</span>';
        insertBelowBtn.title = 'Insert new entry below';
        insertBelowBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            insertEntryBelow(entry.uid);
        });
        
        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'entry-action-btn';
        copyBtn.innerHTML = '<span class="material-symbols-outlined">content_copy</span>';
        copyBtn.title = 'Copy entry';
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyEntry(entry.uid);
        });
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'entry-action-btn entry-action-delete';
        deleteBtn.innerHTML = '<span class="material-symbols-outlined">delete</span>';
        deleteBtn.title = 'Delete entry';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteEntryFromSidebar(entry.uid);
        });
        
        actions.appendChild(insertAboveBtn);
        actions.appendChild(insertBelowBtn);
        actions.appendChild(copyBtn);
        actions.appendChild(deleteBtn);
        
        li.appendChild(actions);        
        // Add content based on zoom level
        if (currentZoomLevel >= 1) { // Normal or zoomed in
            const keywords = document.createElement('div');
            keywords.className = 'entry-item-keywords';
            if (entry.key && entry.key.length > 0) {
                const displayCount = currentZoomLevel === 2 ? 5 : 3; // Show more keywords when zoomed in
                entry.key.slice(0, displayCount).forEach(keyword => {
                    const tag = document.createElement('span');
                    tag.className = 'keyword-tag';
                    tag.textContent = keyword;
                    keywords.appendChild(tag);
                });
                if (entry.key.length > displayCount) {
                    const more = document.createElement('span');
                    more.className = 'keyword-tag';
                    more.textContent = `+${entry.key.length - displayCount} more`;
                    keywords.appendChild(more);
                }
            }
            li.appendChild(keywords);
            
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
            li.appendChild(status);
        }
        
        // Add content preview when zoomed in
        if (currentZoomLevel === 2 && entry.content) {
            const preview = document.createElement('div');
            preview.className = 'entry-item-content-preview';
            preview.textContent = entry.content;
            li.appendChild(preview);
        }
                
        li.addEventListener('click', () => openEntryInTab(entry.uid));
        
        entryList.appendChild(li);
    });
}
// Zoom Function
function changeZoomLevel(delta) {
    const newLevel = Math.max(0, Math.min(2, currentZoomLevel + delta));
    if (newLevel === currentZoomLevel) return;
    
    currentZoomLevel = newLevel;
    updateZoomUI();
    renderEntryList();
    
    // Save preference
    localStorage.setItem('sidebarZoom', currentZoomLevel.toString());
}
function updateZoomUI() {
    const sidebar = document.querySelector('.sidebar');
    const zoomLevelText = document.getElementById('zoomLevel');
    
    // Remove all zoom classes
    sidebar.classList.remove('zoomed-out', 'zoomed-in');
    
    // Add appropriate class and update text
    switch (currentZoomLevel) {
        case 0:
            sidebar.classList.add('zoomed-out');
            zoomLevelText.textContent = 'Compact';
            break;
        case 1:
            zoomLevelText.textContent = 'Normal';
            break;
        case 2:
            sidebar.classList.add('zoomed-in');
            zoomLevelText.textContent = 'Detailed';
            break;
    }
}
// Toggle View Mode
function toggleView() {
    sideBySideView = !sideBySideView;
    const viewIcon = document.getElementById('viewIcon');
    viewIcon.textContent = sideBySideView ? '▦' : '▥';
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
        entry.displayIndex = index; // Keep displayIndex synced with uid
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
        movingEntry.displayIndex = newUid; // Keep displayIndex synced with uid
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
        entry.displayIndex = index; // Keep displayIndex synced with uid
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
    
    // Clear unsaved state when closing tab
    unsavedChanges.delete(uid);
    delete formState[uid];
    
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
        const entryName = entry.comment || 'Untitled';
        const unsavedIndicator = unsavedChanges.has(uid) ? '● ' : '';
        tabText.textContent = unsavedIndicator + entryName;
        tabText.style.color = unsavedChanges.has(uid) ? '#f59e0b' : '';
        
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
    // Ensure new fields exist with defaults for backward compatibility
    if (!entry.characterFilter) {
        entry.characterFilter = { isExclude: false, names: [], tags: [] };
    }
    if (!entry.triggers) {
        entry.triggers = [];
    }
    if (entry.matchPersonaDescription === undefined) entry.matchPersonaDescription = false;
    if (entry.matchCharacterDescription === undefined) entry.matchCharacterDescription = false;
    if (entry.matchCharacterPersonality === undefined) entry.matchCharacterPersonality = false;
    if (entry.matchCharacterDepthPrompt === undefined) entry.matchCharacterDepthPrompt = false;
    if (entry.matchScenario === undefined) entry.matchScenario = false;
    if (entry.matchCreatorNotes === undefined) entry.matchCreatorNotes = false;
    
    // Use formState if it exists (unsaved changes), otherwise use entry data
    const state = formState[uid];
    const comment = state?.comment !== undefined ? state.comment : (entry.comment || '');
    const content = state?.content !== undefined ? state.content : (entry.content || '');
    const keywords = state?.keywords !== undefined ? state.keywords : entry.key.join(', ');
    const keywordsSecondary = state?.keywordsSecondary !== undefined ? state.keywordsSecondary : entry.keysecondary.join(', ');
    const selectiveLogic = state?.selectiveLogic !== undefined ? parseInt(state.selectiveLogic) : entry.selectiveLogic;
    const disable = state?.disable !== undefined ? state.disable : entry.disable;
    const constant = state?.constant !== undefined ? state.constant : entry.constant;
    const order = state?.order !== undefined ? state.order : entry.order;
    const position = state?.position !== undefined ? parseInt(state.position) : entry.position;
    const depth = state?.depth !== undefined ? state.depth : entry.depth;
    const scanDepth = state?.scanDepth !== undefined ? state.scanDepth : (entry.scanDepth !== null ? entry.scanDepth : '');
    const probability = state?.probability !== undefined ? state.probability : entry.probability;
    const useProbability = state?.useProbability !== undefined ? state.useProbability : entry.useProbability;
    const sticky = state?.sticky !== undefined ? state.sticky : entry.sticky;
    const cooldown = state?.cooldown !== undefined ? state.cooldown : entry.cooldown;
    const delay = state?.delay !== undefined ? state.delay : entry.delay;
    const group = state?.group !== undefined ? state.group : entry.group;
    const groupWeight = state?.groupWeight !== undefined ? state.groupWeight : entry.groupWeight;
    const automationId = state?.automationId !== undefined ? state.automationId : entry.automationId;
    const outletName = state?.outletName !== undefined ? state.outletName : entry.outletName;
    const role = state?.role !== undefined ? state.role : entry.role;
    const excludeRecursion = state?.excludeRecursion !== undefined ? state.excludeRecursion : entry.excludeRecursion;
    const preventRecursion = state?.preventRecursion !== undefined ? state.preventRecursion : entry.preventRecursion;
    const delayUntilRecursion = state?.delayUntilRecursion !== undefined ? state.delayUntilRecursion : entry.delayUntilRecursion;
    const ignoreBudget = state?.ignoreBudget !== undefined ? state.ignoreBudget : entry.ignoreBudget;
    const charFilterIsExclude = state?.charFilterIsExclude !== undefined ? state.charFilterIsExclude : entry.characterFilter.isExclude;
    const charFilterNames = state?.charFilterNames !== undefined ? state.charFilterNames : entry.characterFilter.names.join(', ');
    const charFilterTags = state?.charFilterTags !== undefined ? state.charFilterTags : entry.characterFilter.tags.join(', ');
    const triggers = state?.triggers !== undefined ? state.triggers : entry.triggers;
    const matchPersonaDescription = state?.matchPersonaDescription !== undefined ? state.matchPersonaDescription : entry.matchPersonaDescription;
    const matchCharacterDescription = state?.matchCharacterDescription !== undefined ? state.matchCharacterDescription : entry.matchCharacterDescription;
    const matchCharacterPersonality = state?.matchCharacterPersonality !== undefined ? state.matchCharacterPersonality : entry.matchCharacterPersonality;
    const matchCharacterDepthPrompt = state?.matchCharacterDepthPrompt !== undefined ? state.matchCharacterDepthPrompt : entry.matchCharacterDepthPrompt;
    const matchScenario = state?.matchScenario !== undefined ? state.matchScenario : entry.matchScenario;
    const matchCreatorNotes = state?.matchCreatorNotes !== undefined ? state.matchCreatorNotes : entry.matchCreatorNotes;
    
    return `
        <div class="entry-editor" data-uid="${uid}">
            <!-- Basic Fields -->
            <div class="form-group">
                <label class="form-label" for="entryName-${uid}">Name / Title</label>
                <input type="text" id="entryName-${uid}" class="form-input entry-name" value="${escapeHtml(comment)}" placeholder="Enter entry name...">
            </div>
            
            <div class="form-group">
                <label class="form-label" for="entryKeywords-${uid}">Keywords</label>
                <div class="keywords-row">
                    <div class="keyword-field">
                        <label class="form-label-small">Primary</label>
                        <input type="text" id="entryKeywords-${uid}" class="form-input entry-keywords" value="${escapeHtml(keywords)}" placeholder="sword, magic, fire">
                    </div>
                    <div class="keyword-logic">
                        <label class="form-label-small">Logic</label>
                        <select id="entrySelectiveLogic-${uid}" class="form-input entry-selective-logic">
                            <option value="0" ${selectiveLogic === 0 ? 'selected' : ''}>AND ANY</option>
                            <option value="1" ${selectiveLogic === 1 ? 'selected' : ''}>NOT ANY</option>
                            <option value="2" ${selectiveLogic === 2 ? 'selected' : ''}>NOT ALL</option>
                            <option value="3" ${selectiveLogic === 3 ? 'selected' : ''}>AND ALL</option>
                        </select>
                    </div>
                    <div class="keyword-field">
                        <label class="form-label-small">Secondary</label>
                        <input type="text" id="entryKeywordsSecondary-${uid}" class="form-input entry-keywords-secondary" value="${escapeHtml(keywordsSecondary)}" placeholder="holy, blessed">
                    </div>
                </div>
                <small style="color: var(--text-secondary); margin-top: 0.5rem; display: block;">Comma-separated keywords. Secondary keywords are optional filters.</small>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="entryContent-${uid}">Content</label>
                <textarea id="entryContent-${uid}" class="form-textarea entry-content" placeholder="Enter entry content...">${escapeHtml(content)}</textarea>
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
                                <input type="checkbox" id="entryDisable-${uid}" class="entry-disable" ${disable ? 'checked' : ''}>
                                <label class="form-label-small" for="entryDisable-${uid}">Disable Entry</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryConstant-${uid}" class="entry-constant" ${constant ? 'checked' : ''}>
                                <label class="form-label-small" for="entryConstant-${uid}">Constant (Always Active)</label>
                            </div>
                        </div>
                        
                        <!-- Order & Position -->
                        <div class="form-group">
                            <label class="form-label-small" for="entryOrder-${uid}">Order</label>
                            <input type="number" id="entryOrder-${uid}" class="form-input-number entry-order" value="${order}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryPosition-${uid}">Insertion Position</label>
                            <select id="entryPosition-${uid}" class="form-input entry-position">
                                <option value="0" ${position === 0 ? 'selected' : ''}>↑Char (Before Char)</option>
                                <option value="1" ${position === 1 ? 'selected' : ''}>↓Char (After Char)</option>
                                <option value="2" ${position === 2 ? 'selected' : ''}>↑AN (Before AN)</option>
                                <option value="3" ${position === 3 ? 'selected' : ''}>↓AN (After AN)</option>
                                <option value="4" ${position === 4 ? 'selected' : ''}>@D (At Depth)</option>
                                <option value="5" ${position === 5 ? 'selected' : ''}>↑EM (Before Examples)</option>
                                <option value="6" ${position === 6 ? 'selected' : ''}>↓EM (After Examples)</option>
                                <option value="7" ${position === 7 ? 'selected' : ''}>Outlet</option>
                            </select>
                        </div>
                        
                        ${position === 4 ? `
                        <div class="form-group">
                            <label class="form-label-small" for="entryDepth-${uid}">Insertion Depth (0 = bottom of prompt)</label>
                            <input type="number" id="entryDepth-${uid}" class="form-input-number entry-depth" value="${depth}" min="0">
                        </div>
                        <div class="form-group">
                            <label class="form-label-small" for="entryRole-${uid}">Role</label>
                            <select id="entryRole-${uid}" class="form-input entry-role">
                                <option value="null" ${role === null || role === 'null' ? 'selected' : ''}>None</option>
                                <option value="0" ${role === 0 || role === '0' ? 'selected' : ''}>⚙️ System</option>
                                <option value="1" ${role === 1 || role === '1' ? 'selected' : ''}>👤 User</option>
                                <option value="2" ${role === 2 || role === '2' ? 'selected' : ''}>🤖 Assistant</option>
                            </select>
                        </div>
                        ` : `
                        <div class="form-group">
                            <label class="form-label-small" for="entryDepth-${uid}">Depth</label>
                            <input type="number" id="entryDepth-${uid}" class="form-input-number entry-depth" value="${depth}" min="0">
                            <small style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">Used for position-specific behavior</small>
                        </div>
                        `}
                        
                        <!-- Scan Depth (optional override) -->
                        <div class="form-group">
                            <label class="form-label-small" for="entryScanDepth-${uid}">Scan Depth Override (leave empty for global)</label>
                            <input type="number" id="entryScanDepth-${uid}" class="form-input-number entry-scan-depth" value="${scanDepth}" min="0" placeholder="Use global">
                            <small style="color: var(--text-secondary); display: block; margin-top: 0.25rem;">How many messages back to scan for keywords</small>
                        </div>
                        
                        <!-- Per-Entry Overrides -->
                        <div class="form-group">
                            <label class="form-label-small" for="entryCaseSensitive-${uid}">Case Sensitive</label>
                            <select id="entryCaseSensitive-${uid}" class="form-input entry-case-sensitive">
                                <option value="null" ${(state?.caseSensitive ?? entry.caseSensitive) === null ? 'selected' : ''}>Use Global</option>
                                <option value="true" ${(state?.caseSensitive ?? entry.caseSensitive) === true ? 'selected' : ''}>Yes (Override)</option>
                                <option value="false" ${(state?.caseSensitive ?? entry.caseSensitive) === false ? 'selected' : ''}>No (Override)</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryMatchWholeWords-${uid}">Match Whole Words</label>
                            <select id="entryMatchWholeWords-${uid}" class="form-input entry-match-whole-words">
                                <option value="null" ${(state?.matchWholeWords ?? entry.matchWholeWords) === null ? 'selected' : ''}>Use Global</option>
                                <option value="true" ${(state?.matchWholeWords ?? entry.matchWholeWords) === true ? 'selected' : ''}>Yes (Override)</option>
                                <option value="false" ${(state?.matchWholeWords ?? entry.matchWholeWords) === false ? 'selected' : ''}>No (Override)</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryUseGroupScoring-${uid}">Use Group Scoring</label>
                            <select id="entryUseGroupScoring-${uid}" class="form-input entry-use-group-scoring">
                                <option value="null" ${(state?.useGroupScoring ?? entry.useGroupScoring) === null ? 'selected' : ''}>Use Global</option>
                                <option value="true" ${(state?.useGroupScoring ?? entry.useGroupScoring) === true ? 'selected' : ''}>Yes (Override)</option>
                                <option value="false" ${(state?.useGroupScoring ?? entry.useGroupScoring) === false ? 'selected' : ''}>No (Override)</option>
                            </select>
                        </div>
                        
                        ${position === 7 ? `
                        <div class="form-group">
                            <label class="form-label-small" for="entryOutletName-${uid}">Outlet Name</label>
                            <input type="text" id="entryOutletName-${uid}" class="form-input entry-outlet-name" value="${escapeHtml(outletName || '')}" placeholder="Outlet name...">
                        </div>
                        ` : ''}
                        
                        <!-- Probability -->
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryUseProbability-${uid}" class="entry-use-probability" ${useProbability ? 'checked' : ''}>
                                <label class="form-label-small" for="entryUseProbability-${uid}">Use Probability</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryProbability-${uid}">Probability %</label>
                            <input type="number" id="entryProbability-${uid}" class="form-input-number entry-probability" value="${probability}" min="0" max="100">
                        </div>
                        
                        <!-- Recursion Settings -->
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryExcludeRecursion-${uid}" class="entry-exclude-recursion" ${excludeRecursion ? 'checked' : ''}>
                                <label class="form-label-small" for="entryExcludeRecursion-${uid}">Exclude Recursion</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryPreventRecursion-${uid}" class="entry-prevent-recursion" ${preventRecursion ? 'checked' : ''}>
                                <label class="form-label-small" for="entryPreventRecursion-${uid}">Prevent Recursion</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryDelayUntilRecursion-${uid}" class="entry-delay-recursion" ${delayUntilRecursion ? 'checked' : ''}>
                                <label class="form-label-small" for="entryDelayUntilRecursion-${uid}">Delay Until Recursion</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryIgnoreBudget-${uid}" class="entry-ignore-budget" ${ignoreBudget ? 'checked' : ''}>
                                <label class="form-label-small" for="entryIgnoreBudget-${uid}">Ignore Budget</label>
                            </div>
                        </div>
                        
                        <!-- Sticky & Cooldown -->
                        <div class="form-group">
                            <label class="form-label-small" for="entrySticky-${uid}">Sticky</label>
                            <input type="number" id="entrySticky-${uid}" class="form-input-number entry-sticky" value="${sticky}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryCooldown-${uid}">Cooldown</label>
                            <input type="number" id="entryCooldown-${uid}" class="form-input-number entry-cooldown" value="${cooldown}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryDelay-${uid}">Delay</label>
                            <input type="number" id="entryDelay-${uid}" class="form-input-number entry-delay" value="${delay}" min="0">
                        </div>
                        
                        <!-- Group Settings -->
                        <div class="form-group">
                            <label class="form-label-small" for="entryGroup-${uid}">Group</label>
                            <input type="text" id="entryGroup-${uid}" class="form-input entry-group" value="${escapeHtml(group || '')}" placeholder="Group name...">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryGroupWeight-${uid}">Group Weight</label>
                            <input type="number" id="entryGroupWeight-${uid}" class="form-input-number entry-group-weight" value="${groupWeight}" min="0">
                        </div>
                        
                        <!-- Automation ID -->
                        <div class="form-group">
                            <label class="form-label-small" for="entryAutomationId-${uid}">Automation ID</label>
                            <input type="text" id="entryAutomationId-${uid}" class="form-input entry-automation-id" value="${escapeHtml(automationId || '')}" placeholder="Automation ID...">
                        </div>
                        
                        <!-- Character Filter -->
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label class="form-label-small">Character Filter</label>
                            <div style="display: flex; gap: 1rem; margin-bottom: 0.5rem;">
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                    <input type="radio" name="charFilterMode-${uid}" value="include" ${!charFilterIsExclude ? 'checked' : ''}>
                                    <span>Include (only these characters)</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                    <input type="radio" name="charFilterMode-${uid}" value="exclude" ${charFilterIsExclude ? 'checked' : ''}>
                                    <span>Exclude (all except these)</span>
                                </label>
                            </div>
                            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <div style="flex: 1;">
                                    <label class="form-label-small">Character Names</label>
                                    <input type="text" id="entryCharFilterNames-${uid}" class="form-input" value="${escapeHtml(charFilterNames)}" placeholder="Alice, Bob, Charlie">
                                </div>
                                <div style="flex: 1;">
                                    <label class="form-label-small">Character Tags</label>
                                    <input type="text" id="entryCharFilterTags-${uid}" class="form-input" value="${escapeHtml(charFilterTags)}" placeholder="tag1, tag2, tag3">
                                </div>
                            </div>
                            <small style="color: var(--text-secondary); display: block;">Comma-separated names/tags. Empty = no filter (works for all characters)</small>
                        </div>
                        
                        <!-- Generation Triggers -->
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label class="form-label-small">Generation Triggers</label>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.5rem; margin-top: 0.5rem;">
                                <label class="checkbox-group">
                                    <input type="checkbox" class="trigger-checkbox" data-trigger="Normal" ${triggers.includes('Normal') ? 'checked' : ''}>
                                    <span class="form-label-small">Normal</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" class="trigger-checkbox" data-trigger="Continue" ${triggers.includes('Continue') ? 'checked' : ''}>
                                    <span class="form-label-small">Continue</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" class="trigger-checkbox" data-trigger="Impersonate" ${triggers.includes('Impersonate') ? 'checked' : ''}>
                                    <span class="form-label-small">Impersonate</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" class="trigger-checkbox" data-trigger="Swipe" ${triggers.includes('Swipe') ? 'checked' : ''}>
                                    <span class="form-label-small">Swipe</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" class="trigger-checkbox" data-trigger="Regenerate" ${triggers.includes('Regenerate') ? 'checked' : ''}>
                                    <span class="form-label-small">Regenerate</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" class="trigger-checkbox" data-trigger="Quiet" ${triggers.includes('Quiet') ? 'checked' : ''}>
                                    <span class="form-label-small">Quiet</span>
                                </label>
                            </div>
                            <small style="color: var(--text-secondary); display: block; margin-top: 0.5rem;">Empty = all generation types. Select specific types to limit when this entry activates.</small>
                        </div>
                        
                        <!-- Additional Matching Sources -->
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label class="form-label-small">Additional Matching Sources</label>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; margin-top: 0.5rem;">
                                <label class="checkbox-group">
                                    <input type="checkbox" id="entryMatchPersona-${uid}" ${matchPersonaDescription ? 'checked' : ''}>
                                    <span class="form-label-small">Persona Description</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" id="entryMatchCharDesc-${uid}" ${matchCharacterDescription ? 'checked' : ''}>
                                    <span class="form-label-small">Character Description</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" id="entryMatchCharPers-${uid}" ${matchCharacterPersonality ? 'checked' : ''}>
                                    <span class="form-label-small">Character Personality</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" id="entryMatchCharDepth-${uid}" ${matchCharacterDepthPrompt ? 'checked' : ''}>
                                    <span class="form-label-small">Character Depth Prompt</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" id="entryMatchScenario-${uid}" ${matchScenario ? 'checked' : ''}>
                                    <span class="form-label-small">Scenario</span>
                                </label>
                                <label class="checkbox-group">
                                    <input type="checkbox" id="entryMatchCreatorNotes-${uid}" ${matchCreatorNotes ? 'checked' : ''}>
                                    <span class="form-label-small">Creator's Notes</span>
                                </label>
                            </div>
                            <small style="color: var(--text-secondary); display: block; margin-top: 0.5rem;">Match keywords against character/persona data instead of just chat messages</small>
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
    
    // Track changes on all form inputs to mark as unsaved
    const markAsUnsaved = () => {
        unsavedChanges.add(uid);
        captureFormState(uid);
        renderTabs();
    };
    
    // Add change listeners to all inputs
    container.querySelectorAll('input, textarea, select').forEach(element => {
        element.addEventListener('input', markAsUnsaved);
        element.addEventListener('change', markAsUnsaved);
    });
}

// Capture current form state for an entry
function captureFormState(uid) {
    const state = {};
    
    // Basic fields
    const nameEl = document.getElementById(`entryName-${uid}`);
    if (nameEl) state.comment = nameEl.value;
    
    const contentEl = document.getElementById(`entryContent-${uid}`);
    if (contentEl) state.content = contentEl.value;
    
    const keywordsEl = document.getElementById(`entryKeywords-${uid}`);
    if (keywordsEl) state.keywords = keywordsEl.value;
    
    const keywordsSecondaryEl = document.getElementById(`entryKeywordsSecondary-${uid}`);
    if (keywordsSecondaryEl) state.keywordsSecondary = keywordsSecondaryEl.value;
    
    const selectiveLogicEl = document.getElementById(`entrySelectiveLogic-${uid}`);
    if (selectiveLogicEl) state.selectiveLogic = selectiveLogicEl.value;
    
    // Advanced fields
    const disableEl = document.getElementById(`entryDisable-${uid}`);
    if (disableEl) state.disable = disableEl.checked;
    
    const constantEl = document.getElementById(`entryConstant-${uid}`);
    if (constantEl) state.constant = constantEl.checked;
    
    const orderEl = document.getElementById(`entryOrder-${uid}`);
    if (orderEl) state.order = orderEl.value;
    
    const positionEl = document.getElementById(`entryPosition-${uid}`);
    if (positionEl) state.position = positionEl.value;
    
    const depthEl = document.getElementById(`entryDepth-${uid}`);
    if (depthEl) state.depth = depthEl.value;
    
    const scanDepthEl = document.getElementById(`entryScanDepth-${uid}`);
    if (scanDepthEl) state.scanDepth = scanDepthEl.value;
    
    const caseSensitiveEl = document.getElementById(`entryCaseSensitive-${uid}`);
    if (caseSensitiveEl) state.caseSensitive = caseSensitiveEl.value;
    
    const matchWholeWordsEl = document.getElementById(`entryMatchWholeWords-${uid}`);
    if (matchWholeWordsEl) state.matchWholeWords = matchWholeWordsEl.value;
    
    const useGroupScoringEl = document.getElementById(`entryUseGroupScoring-${uid}`);
    if (useGroupScoringEl) state.useGroupScoring = useGroupScoringEl.value;
    
    const probabilityEl = document.getElementById(`entryProbability-${uid}`);
    if (probabilityEl) state.probability = probabilityEl.value;
    
    const useProbabilityEl = document.getElementById(`entryUseProbability-${uid}`);
    if (useProbabilityEl) state.useProbability = useProbabilityEl.checked;
    
    const stickyEl = document.getElementById(`entrySticky-${uid}`);
    if (stickyEl) state.sticky = stickyEl.value;
    
    const cooldownEl = document.getElementById(`entryCooldown-${uid}`);
    if (cooldownEl) state.cooldown = cooldownEl.value;
    
    const delayEl = document.getElementById(`entryDelay-${uid}`);
    if (delayEl) state.delay = delayEl.value;
    
    const groupEl = document.getElementById(`entryGroup-${uid}`);
    if (groupEl) state.group = groupEl.value;
    
    const groupWeightEl = document.getElementById(`entryGroupWeight-${uid}`);
    if (groupWeightEl) state.groupWeight = groupWeightEl.value;
    
    const automationIdEl = document.getElementById(`entryAutomationId-${uid}`);
    if (automationIdEl) state.automationId = automationIdEl.value;
    
    const outletNameEl = document.getElementById(`entryOutletName-${uid}`);
    if (outletNameEl) state.outletName = outletNameEl.value;
    
    const roleEl = document.getElementById(`entryRole-${uid}`);
    if (roleEl) state.role = roleEl.value;
    
    // Checkboxes
    const excludeRecursionEl = document.getElementById(`entryExcludeRecursion-${uid}`);
    if (excludeRecursionEl) state.excludeRecursion = excludeRecursionEl.checked;
    
    const preventRecursionEl = document.getElementById(`entryPreventRecursion-${uid}`);
    if (preventRecursionEl) state.preventRecursion = preventRecursionEl.checked;
    
    const delayRecursionEl = document.getElementById(`entryDelayUntilRecursion-${uid}`);
    if (delayRecursionEl) state.delayUntilRecursion = delayRecursionEl.checked;
    
    const ignoreBudgetEl = document.getElementById(`entryIgnoreBudget-${uid}`);
    if (ignoreBudgetEl) state.ignoreBudget = ignoreBudgetEl.checked;
    
    // Character Filter
    const charFilterIncludeEl = document.querySelector(`input[name="charFilterMode-${uid}"][value="include"]`);
    if (charFilterIncludeEl) state.charFilterIsExclude = !charFilterIncludeEl.checked;
    
    const charFilterNamesEl = document.getElementById(`entryCharFilterNames-${uid}`);
    if (charFilterNamesEl) state.charFilterNames = charFilterNamesEl.value;
    
    const charFilterTagsEl = document.getElementById(`entryCharFilterTags-${uid}`);
    if (charFilterTagsEl) state.charFilterTags = charFilterTagsEl.value;
    
    // Triggers
    const triggerCheckboxes = document.querySelectorAll(`#advancedContent-${uid} .trigger-checkbox`);
    if (triggerCheckboxes.length > 0) {
        state.triggers = Array.from(triggerCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.dataset.trigger);
    }
    
    // Additional Matching Sources
    const matchPersonaEl = document.getElementById(`entryMatchPersona-${uid}`);
    if (matchPersonaEl) state.matchPersonaDescription = matchPersonaEl.checked;
    
    const matchCharDescEl = document.getElementById(`entryMatchCharDesc-${uid}`);
    if (matchCharDescEl) state.matchCharacterDescription = matchCharDescEl.checked;
    
    const matchCharPersEl = document.getElementById(`entryMatchCharPers-${uid}`);
    if (matchCharPersEl) state.matchCharacterPersonality = matchCharPersEl.checked;
    
    const matchCharDepthEl = document.getElementById(`entryMatchCharDepth-${uid}`);
    if (matchCharDepthEl) state.matchCharacterDepthPrompt = matchCharDepthEl.checked;
    
    const matchScenarioEl = document.getElementById(`entryMatchScenario-${uid}`);
    if (matchScenarioEl) state.matchScenario = matchScenarioEl.checked;
    
    const matchCreatorNotesEl = document.getElementById(`entryMatchCreatorNotes-${uid}`);
    if (matchCreatorNotesEl) state.matchCreatorNotes = matchCreatorNotesEl.checked;
    
    formState[uid] = state;
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
    
    // Handle per-entry overrides (null = use global, true/false = override)
    const caseSensitiveEl = document.getElementById(`entryCaseSensitive-${uid}`);
    if (caseSensitiveEl) {
        const val = caseSensitiveEl.value;
        entry.caseSensitive = val === 'null' ? null : (val === 'true');
    }
    
    const matchWholeWordsEl = document.getElementById(`entryMatchWholeWords-${uid}`);
    if (matchWholeWordsEl) {
        const val = matchWholeWordsEl.value;
        entry.matchWholeWords = val === 'null' ? null : (val === 'true');
    }
    
    const useGroupScoringEl = document.getElementById(`entryUseGroupScoring-${uid}`);
    if (useGroupScoringEl) {
        const val = useGroupScoringEl.value;
        entry.useGroupScoring = val === 'null' ? null : (val === 'true');
    }
    
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
    
    // Handle Character Filter (with safety checks)
    const charFilterModeIncludeEl = document.querySelector(`input[name="charFilterMode-${uid}"][value="include"]`);
    if (charFilterModeIncludeEl) {
        entry.characterFilter.isExclude = !charFilterModeIncludeEl.checked;
    }
    
    const charFilterNamesEl = document.getElementById(`entryCharFilterNames-${uid}`);
    if (charFilterNamesEl) {
        const charFilterNamesRaw = charFilterNamesEl.value;
        entry.characterFilter.names = charFilterNamesRaw
            .split(',')
            .map(n => n.trim())
            .filter(n => n.length > 0);
    }
    
    const charFilterTagsEl = document.getElementById(`entryCharFilterTags-${uid}`);
    if (charFilterTagsEl) {
        const charFilterTagsRaw = charFilterTagsEl.value;
        entry.characterFilter.tags = charFilterTagsRaw
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0);
    }
    
    // Handle Generation Triggers (with safety check)
    const triggerCheckboxes = document.querySelectorAll(`#advancedContent-${uid} .trigger-checkbox`);
    if (triggerCheckboxes.length > 0) {
        entry.triggers = Array.from(triggerCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.dataset.trigger);
    }
    
    // Handle Additional Matching Sources (with safety checks)
    const matchPersonaEl = document.getElementById(`entryMatchPersona-${uid}`);
    if (matchPersonaEl) entry.matchPersonaDescription = matchPersonaEl.checked;
    
    const matchCharDescEl = document.getElementById(`entryMatchCharDesc-${uid}`);
    if (matchCharDescEl) entry.matchCharacterDescription = matchCharDescEl.checked;
    
    const matchCharPersEl = document.getElementById(`entryMatchCharPers-${uid}`);
    if (matchCharPersEl) entry.matchCharacterPersonality = matchCharPersEl.checked;
    
    const matchCharDepthEl = document.getElementById(`entryMatchCharDepth-${uid}`);
    if (matchCharDepthEl) entry.matchCharacterDepthPrompt = matchCharDepthEl.checked;
    
    const matchScenarioEl = document.getElementById(`entryMatchScenario-${uid}`);
    if (matchScenarioEl) entry.matchScenario = matchScenarioEl.checked;
    
    const matchCreatorNotesEl = document.getElementById(`entryMatchCreatorNotes-${uid}`);
    if (matchCreatorNotesEl) entry.matchCreatorNotes = matchCreatorNotesEl.checked;
    
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
    
    // Clear unsaved changes flag and form state
    unsavedChanges.delete(uid);
    delete formState[uid];
    
    renderEntryList();
    renderTabs();
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

// Help Modal Functions
function showHelp() {
    const helpContent = document.getElementById('helpContent');
    helpContent.innerHTML = `
        <h2>✨ Clean Interface</h2>
        <ul>
            <li>Simple, uncluttered design with good spacing</li>
            <li>Main fields visible: Name, Primary Keywords, Secondary Keywords with Logic, Content</li>
            <li>Advanced settings collapsed away until you need them</li>
        </ul>

        <h2>📄 Multi-Entry Editing</h2>
        <ul>
            <li>Open multiple entries in tabs</li>
            <li>Easily switch between entries</li>
            <li><strong>Side-by-side view</strong>: Toggle (▥/▦ button) to see all open entries at once!</li>
            <li>Compare and copy between entries</li>
            <li><strong>● Unsaved indicator</strong>: Orange dot shows which tabs have unsaved changes</li>
        </ul>

        <h2>🎯 Quick Sidebar Actions</h2>
        <ul>
            <li><strong>Hover to reveal action buttons</strong> on each entry</li>
            <li><strong>Insert Above/Below</strong> (↑̶+ / ↓̶+): Add new entry right where you need it, UIDs auto-adjust</li>
            <li><strong>Copy</strong> (📋): Duplicate an entry instantly</li>
            <li><strong>Delete</strong> (🗑️): Remove entries without opening them</li>
            <li>All actions work directly from the sidebar!</li>
        </ul>

        <h2>🔀 Import & Merge</h2>
        <ul>
            <li><strong>Import Lorebook</strong>: Replace your current lorebook with a new one</li>
            <li><strong>Import for Merging</strong>: Bring entries from another lorebook into your current one</li>
            <li>Select which entries to merge with checkboxes</li>
            <li>UIDs automatically renumber to avoid conflicts</li>
            <li>Perfect for combining multiple lorebooks or cherry-picking entries</li>
        </ul>

        <h2>📊 Smart Reordering</h2>
        <ul>
            <li>Each entry has a number (its UID)</li>
            <li>Change any entry's number to move it in the list</li>
            <li>Other entries automatically shift to make room</li>
            <li>Keeps everything organized and sequential</li>
        </ul>

        <h2>🎯 Multi-Select & Drag-Drop</h2>
        <ul>
            <li>Select multiple entries with checkboxes</li>
            <li>Drag and drop to reorder</li>
            <li>Drag multiple selected entries at once!</li>
            <li>Visual feedback when dragging</li>
        </ul>

        <h2>📕 Full Lorebook Support</h2>
        <ul>
            <li>Import/export SillyTavern JSON lorebooks</li>
            <li><strong>Main editing area</strong>: Name, Primary Keywords, Secondary Keywords with Logic dropdown, Content</li>
            <li><strong>Advanced settings (collapsed)</strong>: All SillyTavern fields including:
                <ul>
                    <li>Character Filter (include/exclude by names or tags)</li>
                    <li>Generation Triggers (Normal, Continue, Impersonate, Swipe, Regenerate, Quiet)</li>
                    <li>Additional Matching Sources (match against persona, character data, scenario, etc.)</li>
                    <li>All recursion, probability, timing, and positioning options</li>
                </ul>
            </li>
            <li><strong>Insertion Position</strong> dropdown with human-readable options (↑Char, ↓Char, @D, Outlet, etc.)</li>
            <li>Conditional fields that show/hide based on position:
                <ul>
                    <li><strong>@D position</strong>: Insertion Depth + Role selector</li>
                    <li><strong>Outlet position</strong>: Outlet Name text field</li>
                    <li><strong>All positions</strong>: Optional Scan Depth override (leave empty for global)</li>
                </ul>
            </li>
        </ul>

        <h2>💡 Tips</h2>
        <ul>
            <li><strong>Keywords are comma-separated</strong> - just type "sword, magic, fire" in the keyword fields</li>
            <li><strong>Secondary Keywords Logic</strong> determines how primary and secondary keywords work together (AND ANY, NOT ANY, NOT ALL, AND ALL)</li>
            <li><strong>Selective mode is automatic</strong> - it turns on automatically when you add secondary keywords, and off when they're empty</li>
            <li><strong>Hover over sidebar entries</strong> to reveal quick action buttons for copying, deleting, and inserting entries</li>
            <li><strong>No more popups!</strong> - The orange dot (●) on tabs tells you when changes are saved</li>
            <li><strong>Merging lorebooks</strong> - Use "Import for Merging" to combine entries from multiple lorebooks without losing your current work</li>
            <li>Advanced settings are collapsed by default - click to expand</li>
            <li><strong>Character Filter</strong> - Control which characters this entry activates for (Include or Exclude mode)</li>
            <li><strong>Generation Triggers</strong> - Limit entry to specific generation types (Normal, Continue, Impersonate, Swipe, Regenerate, Quiet). Empty = all types</li>
            <li><strong>Additional Matching Sources</strong> - Match keywords against character/persona data instead of just chat messages:
                <ul>
                    <li>Persona Description, Character Description, Character Personality</li>
                    <li>Character Depth Prompt, Scenario, Creator's Notes</li>
                </ul>
            </li>
            <li><strong>Understanding the two depth fields</strong>:
                <ul>
                    <li><strong>Depth</strong>: For @D position, this is where to inject the entry (Insertion Depth). For other positions, used for position-specific behavior</li>
                    <li><strong>Scan Depth Override</strong>: Optional field to override how many messages back to scan for keywords (leave empty to use global setting)</li>
                </ul>
            </li>
            <li><strong>Toggle side-by-side view</strong> (▥/▦ button) to see multiple entries at once</li>
            <li><strong>Check multiple entries</strong> and drag them together to reorder in bulk</li>
            <li>Click "Clear" to deselect all entries</li>
            <li>You can drag entries onto each other to reorder</li>
            <li>Search works on both entry names and keywords</li>
        </ul>

        <h2>♿ Accessibility Features</h2>
        <ul>
            <li><strong>🌙 Dark Mode</strong>: Toggle between creamy light mode and soothing dark chocolate mode</li>
            <li><strong>Aa Dyslexia Font</strong>: Switch to OpenDyslexic font for easier reading</li>
            <li>Your preferences are saved automatically and persist between sessions</li>
            <li>All colors meet WCAG contrast requirements in both modes</li>
        </ul>

        <h2>🚀 How to Use</h2>
        <ol>
            <li><strong>Open the app</strong>: Just open index.html in your web browser</li>
            <li><strong>Name your lorebook</strong> (optional): Enter a name in the header - this becomes your export filename!</li>
            <li><strong>Import</strong>: Click "Import Lorebook" and select your SillyTavern JSON file</li>
            <li><strong>Edit</strong>: Click any entry in the sidebar to open it</li>
            <li><strong>Quick actions</strong>: Hover over entries in the sidebar to see action buttons (insert, copy, delete)</li>
            <li><strong>Multiple tabs</strong>: Click more entries to open them side-by-side</li>
            <li><strong>Merge lorebooks</strong>: Click "Import for Merging" to bring entries from another lorebook</li>
            <li><strong>Save</strong>: Click "Save Changes" after editing (orange ● shows unsaved changes)</li>
            <li><strong>Export</strong>: Click "Export Lorebook" to download your edited file</li>
        </ol>

        <p style="text-align: center; margin-top: 2rem; color: var(--text-secondary);">
            Built with vanilla HTML/CSS/JavaScript - no dependencies needed! 🎉
        </p>
    `;
    document.getElementById('helpModal').style.display = 'flex';
}

function hideHelp() {
    document.getElementById('helpModal').style.display = 'none';
}

// Theme Toggle
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('themeToggle');
    const isDark = body.classList.toggle('dark-mode');
    
    if (isDark) {
        themeBtn.innerHTML = '☀️ Light';
        themeBtn.title = 'Toggle Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        themeBtn.innerHTML = '🌙 Dark';
        themeBtn.title = 'Toggle Dark Mode';
        localStorage.setItem('theme', 'light');
    }
}

// Font Toggle
function toggleDyslexiaFont() {
    const body = document.body;
    const fontBtn = document.getElementById('fontToggle');
    const isDyslexic = body.classList.toggle('dyslexia-font');
    
    if (isDyslexic) {
        fontBtn.innerHTML = '✓ Aa';
        fontBtn.title = 'Disable Dyslexia-Friendly Font';
        fontBtn.style.background = 'var(--primary-color)';
        fontBtn.style.color = 'white';
        localStorage.setItem('dyslexiaFont', 'true');
    } else {
        fontBtn.innerHTML = 'Aa';
        fontBtn.title = 'Enable Dyslexia-Friendly Font';
        fontBtn.style.background = '';
        fontBtn.style.color = '';
        localStorage.setItem('dyslexiaFont', 'false');
    }
}

// Load Preferences
function loadPreferences() {
    const savedTheme = localStorage.getItem('theme');
    const savedFont = localStorage.getItem('dyslexiaFont');
    const savedZoom = localStorage.getItem('sidebarZoom');
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        const themeBtn = document.getElementById('themeToggle');
        themeBtn.innerHTML = '☀️ Light';
        themeBtn.title = 'Toggle Light Mode';
    }
    
    // Apply saved font preference
    if (savedFont === 'true') {
        document.body.classList.add('dyslexia-font');
        const fontBtn = document.getElementById('fontToggle');
        fontBtn.innerHTML = '✓ Aa';
        fontBtn.title = 'Disable Dyslexia-Friendly Font';
        fontBtn.style.background = 'var(--primary-color)';
        fontBtn.style.color = 'white';
    }
    
    // Apply saved zoom level
    if (savedZoom !== null) {
        currentZoomLevel = parseInt(savedZoom);
        updateZoomUI();
    }
}
