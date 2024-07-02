function appendVisualTab(visualTabsContainer, tab) {
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

function recreateVisualTabs(tabsAsJson, visualTabsContainer) {
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

    appendNewTabBtn(visualTabsContainer)

    return arrOfTabs
}

async function main() {
    const visualTabsContainer = document.getElementById('visual-tabs-container')
    const loadTabsBtn = document.getElementById('load-tabs')
    const loadTabsTextArea = document.getElementById('ta-for-json')

    const savedTabsAsString = await getTabsFromStore()

    if (savedTabsAsString?.length > 0) {
        recreateVisualTabs(savedTabsAsString, visualTabsContainer)

        loadTabsTextArea.value = savedTabsAsString
    }

    loadTabsBtn.addEventListener('click', async () => {
        if (loadTabsTextArea.value.length > 0) {
            recreateVisualTabs(loadTabsTextArea.value, visualTabsContainer)

            await saveTabsToStore(loadTabsTextArea.value)
        }
    })
}

main()
