// Lorebook Manager - Main Script

let lorebook = { entries: {} };
let openTabs = [];
let activeTabId = null;
let nextUid = 0;

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
    
    const entries = Object.values(lorebook.entries);
    entryCount.textContent = `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}`;
    
    entryList.innerHTML = '';
    
    entries.forEach(entry => {
        const li = document.createElement('li');
        li.className = 'entry-item';
        li.dataset.uid = entry.uid;
        
        if (openTabs.includes(entry.uid)) {
            li.classList.add('active');
        }
        
        const title = document.createElement('div');
        title.className = 'entry-item-title';
        title.textContent = entry.comment || 'Untitled Entry';
        
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
        
        li.appendChild(title);
        li.appendChild(keywords);
        li.appendChild(status);
        
        li.addEventListener('click', () => openEntryInTab(entry.uid));
        
        entryList.appendChild(li);
    });
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
    
    if (!activeTabId || !lorebook.entries[activeTabId]) {
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
    
    editorContent.innerHTML = `
        <div class="entry-editor">
            <!-- Basic Fields -->
            <div class="form-group">
                <label class="form-label" for="entryName">Name / Title</label>
                <input type="text" id="entryName" class="form-input" value="${escapeHtml(entry.comment || '')}" placeholder="Enter entry name...">
            </div>
            
            <div class="form-group">
                <label class="form-label" for="entryKeywords">Keywords (Primary)</label>
                <div id="keywordsContainer" class="keywords-input-container">
                    ${entry.key.map(k => `
                        <div class="keyword-chip">
                            <span>${escapeHtml(k)}</span>
                            <span class="keyword-remove" onclick="removeKeyword('${escapeHtml(k)}')">×</span>
                        </div>
                    `).join('')}
                    <input type="text" class="keyword-input" id="keywordInput" placeholder="Type keyword and press Enter...">
                </div>
                <small style="color: var(--text-secondary); margin-top: 0.5rem; display: block;">Press Enter to add a keyword</small>
            </div>
            
            <div class="form-group">
                <label class="form-label" for="entryContent">Content</label>
                <textarea id="entryContent" class="form-textarea" placeholder="Enter entry content...">${escapeHtml(entry.content || '')}</textarea>
            </div>
            
            <!-- Advanced Settings -->
            <div class="advanced-settings">
                <div class="advanced-settings-header" onclick="toggleAdvancedSettings()">
                    <span class="advanced-settings-title">⚙️ Advanced Settings</span>
                    <span class="advanced-settings-toggle" id="advancedToggle">▼</span>
                </div>
                <div class="advanced-settings-content" id="advancedContent">
                    <div class="advanced-grid">
                        <!-- Activation Settings -->
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryDisable" ${entry.disable ? 'checked' : ''}>
                                <label class="form-label-small" for="entryDisable">Disable Entry</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryConstant" ${entry.constant ? 'checked' : ''}>
                                <label class="form-label-small" for="entryConstant">Constant (Always Active)</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entrySelective" ${entry.selective ? 'checked' : ''}>
                                <label class="form-label-small" for="entrySelective">Selective</label>
                            </div>
                        </div>
                        
                        <!-- Depth & Order -->
                        <div class="form-group">
                            <label class="form-label-small" for="entryDepth">Scan Depth</label>
                            <input type="number" id="entryDepth" class="form-input-number" value="${entry.depth}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryOrder">Order</label>
                            <input type="number" id="entryOrder" class="form-input-number" value="${entry.order}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryPosition">Position</label>
                            <input type="number" id="entryPosition" class="form-input-number" value="${entry.position}">
                        </div>
                        
                        <!-- Probability -->
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryUseProbability" ${entry.useProbability ? 'checked' : ''}>
                                <label class="form-label-small" for="entryUseProbability">Use Probability</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryProbability">Probability %</label>
                            <input type="number" id="entryProbability" class="form-input-number" value="${entry.probability}" min="0" max="100">
                        </div>
                        
                        <!-- Recursion Settings -->
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryExcludeRecursion" ${entry.excludeRecursion ? 'checked' : ''}>
                                <label class="form-label-small" for="entryExcludeRecursion">Exclude Recursion</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryPreventRecursion" ${entry.preventRecursion ? 'checked' : ''}>
                                <label class="form-label-small" for="entryPreventRecursion">Prevent Recursion</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryDelayUntilRecursion" ${entry.delayUntilRecursion ? 'checked' : ''}>
                                <label class="form-label-small" for="entryDelayUntilRecursion">Delay Until Recursion</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="entryIgnoreBudget" ${entry.ignoreBudget ? 'checked' : ''}>
                                <label class="form-label-small" for="entryIgnoreBudget">Ignore Budget</label>
                            </div>
                        </div>
                        
                        <!-- Sticky & Cooldown -->
                        <div class="form-group">
                            <label class="form-label-small" for="entrySticky">Sticky</label>
                            <input type="number" id="entrySticky" class="form-input-number" value="${entry.sticky}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryCooldown">Cooldown</label>
                            <input type="number" id="entryCooldown" class="form-input-number" value="${entry.cooldown}" min="0">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryDelay">Delay</label>
                            <input type="number" id="entryDelay" class="form-input-number" value="${entry.delay}" min="0">
                        </div>
                        
                        <!-- Group Settings -->
                        <div class="form-group">
                            <label class="form-label-small" for="entryGroup">Group</label>
                            <input type="text" id="entryGroup" class="form-input" value="${escapeHtml(entry.group || '')}" placeholder="Group name...">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label-small" for="entryGroupWeight">Group Weight</label>
                            <input type="number" id="entryGroupWeight" class="form-input-number" value="${entry.groupWeight}" min="0">
                        </div>
                        
                        <!-- Role -->
                        <div class="form-group">
                            <label class="form-label-small" for="entryRole">Role</label>
                            <select id="entryRole" class="form-input">
                                <option value="null" ${entry.role === null ? 'selected' : ''}>None</option>
                                <option value="0" ${entry.role === 0 ? 'selected' : ''}>System (0)</option>
                                <option value="1" ${entry.role === 1 ? 'selected' : ''}>User (1)</option>
                                <option value="2" ${entry.role === 2 ? 'selected' : ''}>Assistant (2)</option>
                            </select>
                        </div>
                        
                        <!-- Automation ID -->
                        <div class="form-group">
                            <label class="form-label-small" for="entryAutomationId">Automation ID</label>
                            <input type="text" id="entryAutomationId" class="form-input" value="${escapeHtml(entry.automationId || '')}" placeholder="Automation ID...">
                        </div>
                    </div>
                    
                    <!-- Secondary Keywords -->
                    <div class="form-group" style="margin-top: 1.5rem;">
                        <label class="form-label-small" for="entryKeywordsSecondary">Keywords (Secondary)</label>
                        <div id="keywordsSecondaryContainer" class="keywords-input-container">
                            ${entry.keysecondary.map(k => `
                                <div class="keyword-chip">
                                    <span>${escapeHtml(k)}</span>
                                    <span class="keyword-remove" onclick="removeKeywordSecondary('${escapeHtml(k)}')">×</span>
                                </div>
                            `).join('')}
                            <input type="text" class="keyword-input" id="keywordSecondaryInput" placeholder="Type keyword and press Enter...">
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Actions -->
            <div class="editor-actions">
                <button id="saveBtn" class="btn btn-primary">Save Changes</button>
                <button id="deleteBtn" class="btn btn-danger">Delete Entry</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    document.getElementById('saveBtn').addEventListener('click', saveEntry);
    document.getElementById('deleteBtn').addEventListener('click', deleteEntry);
    
    // Keyword input handlers
    const keywordInput = document.getElementById('keywordInput');
    keywordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && keywordInput.value.trim()) {
            addKeyword(keywordInput.value.trim());
            keywordInput.value = '';
        }
    });
    
    const keywordSecondaryInput = document.getElementById('keywordSecondaryInput');
    keywordSecondaryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && keywordSecondaryInput.value.trim()) {
            addKeywordSecondary(keywordSecondaryInput.value.trim());
            keywordSecondaryInput.value = '';
        }
    });
}

// Save Entry
function saveEntry() {
    const entry = lorebook.entries[activeTabId];
    
    entry.comment = document.getElementById('entryName').value;
    entry.content = document.getElementById('entryContent').value;
    entry.disable = document.getElementById('entryDisable').checked;
    entry.constant = document.getElementById('entryConstant').checked;
    entry.selective = document.getElementById('entrySelective').checked;
    entry.depth = parseInt(document.getElementById('entryDepth').value);
    entry.order = parseInt(document.getElementById('entryOrder').value);
    entry.position = parseInt(document.getElementById('entryPosition').value);
    entry.useProbability = document.getElementById('entryUseProbability').checked;
    entry.probability = parseInt(document.getElementById('entryProbability').value);
    entry.excludeRecursion = document.getElementById('entryExcludeRecursion').checked;
    entry.preventRecursion = document.getElementById('entryPreventRecursion').checked;
    entry.delayUntilRecursion = document.getElementById('entryDelayUntilRecursion').checked;
    entry.ignoreBudget = document.getElementById('entryIgnoreBudget').checked;
    entry.sticky = parseInt(document.getElementById('entrySticky').value);
    entry.cooldown = parseInt(document.getElementById('entryCooldown').value);
    entry.delay = parseInt(document.getElementById('entryDelay').value);
    entry.group = document.getElementById('entryGroup').value;
    entry.groupWeight = parseInt(document.getElementById('entryGroupWeight').value);
    
    const roleValue = document.getElementById('entryRole').value;
    entry.role = roleValue === 'null' ? null : parseInt(roleValue);
    
    entry.automationId = document.getElementById('entryAutomationId').value;
    
    renderEntryList();
    renderTabs();
    showNotification('Entry saved!', 'success');
}

// Delete Entry
function deleteEntry() {
    if (confirm('Are you sure you want to delete this entry? This cannot be undone.')) {
        delete lorebook.entries[activeTabId];
        closeTab(activeTabId);
        renderEntryList();
        showNotification('Entry deleted', 'success');
    }
}

// Keyword Management
function addKeyword(keyword) {
    const entry = lorebook.entries[activeTabId];
    if (!entry.key.includes(keyword)) {
        entry.key.push(keyword);
        renderEditor();
    }
}

function removeKeyword(keyword) {
    const entry = lorebook.entries[activeTabId];
    entry.key = entry.key.filter(k => k !== keyword);
    renderEditor();
}

function addKeywordSecondary(keyword) {
    const entry = lorebook.entries[activeTabId];
    if (!entry.keysecondary.includes(keyword)) {
        entry.keysecondary.push(keyword);
        renderEditor();
    }
}

function removeKeywordSecondary(keyword) {
    const entry = lorebook.entries[activeTabId];
    entry.keysecondary = entry.keysecondary.filter(k => k !== keyword);
    renderEditor();
}

// Toggle Advanced Settings
function toggleAdvancedSettings() {
    const content = document.getElementById('advancedContent');
    const toggle = document.getElementById('advancedToggle');
    
    content.classList.toggle('open');
    toggle.classList.toggle('open');
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
