const settingsModal = document.getElementById("settings-modal");
const settingsBtn = document.getElementById('settings-btn')

const loadTabsBtn = document.getElementById('load-tabs')
const loadTabsTextArea = document.getElementById('ta-for-json')

settingsBtn.addEventListener('click', async () => {
    settingsModal.style.display = "block";

    const savedTabsAsString = await getTabsFromStore()
    loadTabsTextArea.value = savedTabsAsString
})

loadTabsBtn.addEventListener('click', async () => {
    if (loadTabsTextArea.value.length > 0) {
        // check that JSON is valid
        try {
            JSON.parse(loadTabsTextArea.value)
        } catch (error) {
            alert('invalid json')
            return
        }
        
        await saveTabsToStore(loadTabsTextArea.value)

        recreateVisualTabs()

        settingsModal.style.display = "none";
    }
})
