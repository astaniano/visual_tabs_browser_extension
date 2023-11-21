const appendVisualTab = (visualTabsContainer, tab) => {
    const visualTab = document.createElement("button")

    const name = tab.displayName
    const text = name.length > 10 ? `${name.slice(0, 7)}...` : name

    visualTab.innerText = text
    visualTab.classList.add('link')
    visualTab.style.backgroundColor = tab.bgColor
    visualTab.addEventListener('click', () => {
        location.assign(tab.url)
    })

    visualTabsContainer.appendChild(visualTab)
}

const recreateVisualTabs = (tabsAsJson, visualTabsContainer) => {
    let arrOfTabs

    try {
        arrOfTabs = JSON.parse(tabsAsJson)
    } catch (error) {
        alert('invalid json')
        throw new Error('invalid json')
    }

    visualTabsContainer.replaceChildren([])

    for (const tab of arrOfTabs) {
        appendVisualTab(visualTabsContainer, tab)
    }

    return arrOfTabs
}

async function main() {
    const keyNameInStorage = 'storedArrOfTabs'

    const visualTabsContainer = document.getElementById('visual-tabs-container')
    const loadTabsBtn = document.getElementById('load-tabs')
    const loadTabsTextArea = document.getElementById('ta-for-json')

    const addNewTabForm = document.getElementById('add-new-tab-form')
    const newTabUrl = document.getElementById('new-tab-url')
    const newTabName = document.getElementById('new-tab-name')
    const newTabBgColor = document.getElementById('new-tab-color')

    const chromeStorage = await chrome.storage.local.get([keyNameInStorage])
    const savedTabsAsString = chromeStorage[keyNameInStorage]

    if (savedTabsAsString?.length > 0) {
        recreateVisualTabs(savedTabsAsString, visualTabsContainer)

        loadTabsTextArea.value = savedTabsAsString
    }

    loadTabsBtn.addEventListener('click', async () => {
        if (loadTabsTextArea.value.length > 0) {
            recreateVisualTabs(loadTabsTextArea.value, visualTabsContainer)

            await chrome.storage.local.set({ [keyNameInStorage]: loadTabsTextArea.value })
        } 
    })

    addNewTabForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        if (!newTabUrl.value.startsWith('https') && !newTabUrl.value.startsWith('file:///')) {
            alert('invalid url')
            return
        }
        const newVisualTab = {
            url: newTabUrl.value,
            displayName: newTabName.value,
            bgColor: newTabBgColor.value
        }

        const arrOfTabs = JSON.parse(loadTabsTextArea.value)
        arrOfTabs.push(newVisualTab)
        const updatedTabsAsString = JSON.stringify(arrOfTabs, null, 2)

        await chrome.storage.local.set({ [keyNameInStorage]: updatedTabsAsString })
        loadTabsTextArea.value = updatedTabsAsString

        appendVisualTab(visualTabsContainer, newVisualTab)

        newTabUrl.value = ''
        newTabName.value = ''
    })
}

main()
